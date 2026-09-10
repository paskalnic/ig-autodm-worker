import { Hono } from "hono";
import { adminRoutes } from "./admin/routes";
import { adminUiPage } from "./admin/ui";
import { adminTransportSecurityHeaders, adminUiSecurityHeaders, makeNonce } from "./admin/ui-auth";
import { isAutomationEnabled } from "./config";
import { Repository } from "./db/repository";
import { FlowRouter } from "./flows/router";
import { MetaApiClient } from "./meta/api";
import { normalizeMetaWebhook } from "./meta/webhook";
import { runScheduledMaintenance } from "./ops/maintenance";
import { pollCampaignComments } from "./poller/comments";
import { processDeliveryBatch } from "./queue/consumer";
import { recoverStaleDeliveries } from "./queue/recovery";
import { timingSafeEqual } from "./security/constant-time";
import { parseMetaSignedRequest } from "./security/signed-request";
import { verifyMetaSignature } from "./security/signature";
import { refreshInstagramTokenIfDue } from "./token/manager";
import type { DeliveryJob, Env } from "./types";

export const app = new Hono<{ Bindings: Env }>();
const MAX_WEBHOOK_BODY_BYTES = 256 * 1024;
const MAX_DATA_DELETION_BODY_BYTES = 16 * 1024;
const MIN_META_SECRET_LENGTH = 16;
const MIN_VERIFY_TOKEN_LENGTH = 8;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

app.get("/health", (c) => c.json({ ok: true, service: "ig-autodm-worker" }));
app.get("/admin-ui", (c) => {
  const nonce = makeNonce();
  const turnstileEnabled = Boolean(c.env.TURNSTILE_SITE_KEY && c.env.TURNSTILE_SECRET_KEY);
  return new Response(adminUiPage(nonce, turnstileEnabled ? c.env.TURNSTILE_SITE_KEY : undefined), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...adminUiSecurityHeaders(nonce, turnstileEnabled),
      ...adminTransportSecurityHeaders(c.req.url)
    }
  });
});

function publicHtmlSecurityHeaders(nonce: string): HeadersInit {
  return {
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    "Content-Security-Policy": [
      "default-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'none'",
      "img-src 'none'",
      "object-src 'none'",
      "script-src 'none'",
      "script-src-attr 'none'",
      `style-src 'nonce-${nonce}'`,
      "style-src-attr 'none'",
      "connect-src 'none'"
    ].join("; "),
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()"
  };
}

function htmlResponse(title: string, body: string, status = 200): Response {
  const nonce = makeNonce();
  return new Response(legalPage(title, body, nonce), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...publicHtmlSecurityHeaders(nonce)
    }
  });
}

const legalPage = (title: string, body: string, nonce: string) => `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} - IG AutoDM Worker</title>
    <style nonce="${nonce}">
      body { color: #111827; font-family: system-ui, sans-serif; line-height: 1.6; margin: 0; }
      main { margin: 0 auto; max-width: 760px; padding: 48px 20px; }
      h1 { font-size: 32px; line-height: 1.2; margin: 0 0 16px; }
      h2 { font-size: 18px; margin: 28px 0 8px; }
      p { margin: 0 0 14px; }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`;

const privacyBody = `<h1>Politique de confidentialité</h1>
      <p>IG AutoDM Worker est un outil d’automatisation Instagram auto-hébergé. Il permet au propriétaire du compte de répondre aux commentaires et aux messages privés Instagram.</p>
      <h2>Données traitées</h2>
      <p>Le service traite les identifiants de comptes Instagram, les noms d’utilisateur transmis par Instagram, le contenu des commentaires et des messages, les actions sur les boutons, les règles des campagnes et les états de livraison nécessaires aux réponses automatiques.</p>
      <h2>Finalité</h2>
      <p>Ces données servent uniquement à associer les commentaires ou messages aux campagnes configurées, envoyer la réponse Instagram demandée, éviter les doublons et diagnostiquer les problèmes de livraison.</p>
      <h2>Partage et conservation</h2>
      <p>Les données sont stockées dans le compte Cloudflare du propriétaire. Elles ne sont ni vendues ni partagées avec des tiers, à l’exception des prestataires techniques indispensables au fonctionnement du service. Les données opérationnelles sont conservées uniquement pendant la durée nécessaire à l’automatisation et à l’assistance.</p>
      <h2>Contact</h2>
      <p>Pour demander l’accès à vos données ou leur suppression, contactez le propriétaire du compte Instagram ayant connecté cet outil.</p>`;

const termsBody = `<h1>Conditions d’utilisation</h1>
      <p>IG AutoDM Worker est un outil d’automatisation auto-hébergé destiné au propriétaire du compte Instagram qui le connecte.</p>
      <h2>Utilisation du service</h2>
      <p>Le propriétaire du compte est responsable de la configuration des campagnes, du contenu des réponses et du respect des règles des plateformes Instagram et Meta.</p>
      <h2>Disponibilité</h2>
      <p>Le service est fourni sans garantie pour un usage interne d’automatisation. L’accès peut être révoqué en supprimant l’application connectée dans les paramètres Instagram ou en renouvelant les jetons d’accès enregistrés.</p>`;

const deletionBody = `<h1>Suppression des données</h1>
      <p>Pour retirer l’accès à IG AutoDM Worker, ouvrez les paramètres Instagram, accédez à Autorisations du site web, puis Applications et sites web, et supprimez l’application IG AutoDM Worker.</p>
      <p>Pour demander la suppression des données d’automatisation enregistrées, contactez le propriétaire du compte Instagram ayant connecté cet outil. Il pourra supprimer l’historique des campagnes de la base Cloudflare D1 et renouveler le jeton d’accès Instagram.</p>`;

app.get("/", () =>
  htmlResponse(
    "IG AutoDM Worker",
    `<h1>IG AutoDM Worker</h1>
      <p>Service d’automatisation Instagram auto-hébergé pour les commentaires et les messages privés.</p>
      <p><a href="/privacy">Politique de confidentialité</a> | <a href="/terms">Conditions d’utilisation</a> | <a href="/data-deletion">Suppression des données</a></p>`
  )
);

app.get("/privacy", () => htmlResponse("Politique de confidentialité", privacyBody));

app.get("/terms", () => htmlResponse("Conditions d’utilisation", termsBody));

const dataDeletionHandler = () => htmlResponse("Suppression des données", deletionBody);

app.get("/data-deletion", dataDeletionHandler);
app.get("/data_deletion", dataDeletionHandler);

app.post("/data-deletion", async (c) => {
  if (!metaAppSecretConfigured(c.env.META_APP_SECRET)) {
    return c.json({ error: "Le traitement des demandes de suppression n’est pas configuré" }, 503);
  }

  const rawBody = await readLimitedBody(c.req.raw, MAX_DATA_DELETION_BODY_BYTES);
  if (!rawBody.ok) return c.json({ error: "Le corps de la requête est trop volumineux" }, 413);

  const form = new URLSearchParams(new TextDecoder().decode(rawBody.bytes));
  const signedRequestValue = form.get("signed_request");
  const signedRequest = await parseMetaSignedRequest(signedRequestValue, c.env.META_APP_SECRET);
  if (!signedRequest.ok) {
    return c.json({ error: "Requête signée invalide" }, 400);
  }

  const userId = typeof signedRequest.payload.user_id === "string" ? signedRequest.payload.user_id : "";
  if (!userId) {
    return c.json({ error: "La requête signée ne contient pas de user_id" }, 400);
  }

  const repo = new Repository(c.env.DB);
  const replayHash = await sha256Hex(signedRequestValue ?? "");
  const claim = await repo.claimDataDeletionRequest(replayHash);
  if (claim.status === "completed") {
    if (!claim.confirmationCode) {
      return c.json({ error: "La demande de suppression a déjà été traitée" }, 409);
    }
    return dataDeletionJson(c, claim.confirmationCode);
  }
  if (claim.status === "processing") {
    return c.json({ error: "La demande de suppression est déjà en cours de traitement" }, 409);
  }

  try {
    const deleted = await repo.deleteUserData(userId);
    const confirmationCode = crypto.randomUUID();
    await repo.insertOperationalEvent({
      eventType: "data_deletion_requested",
      status: "ok",
      metadata: {
        confirmationCode,
        deleted
      }
    });
    await repo.completeDataDeletionRequest(replayHash, confirmationCode);

    return dataDeletionJson(c, confirmationCode);
  } catch (error) {
    await repo.releaseDataDeletionRequest(replayHash);
    throw error;
  }
});

app.get("/data-deletion/status/:code", async (c) => {
  const code = c.req.param("code");
  if (!UUID_PATTERN.test(code)) {
    return dataDeletionStatusResponse(false);
  }

  const repo = new Repository(c.env.DB);
  const found = await repo.dataDeletionConfirmationExists(code);
  return dataDeletionStatusResponse(found);
});

function dataDeletionStatusResponse(found: boolean): Response {
  return htmlResponse(
    found ? "État de la suppression des données" : "Demande de suppression introuvable",
    found
      ? `<h1>État de la suppression des données</h1><p>La demande de suppression a bien été reçue et traitée par le service d’automatisation.</p>`
      : `<h1>État de la suppression des données</h1><p>Cette demande de suppression est introuvable.</p>`,
    found ? 200 : 404
  );
}

function dataDeletionJson(c: { req: { url: string }; json: (data: unknown) => Response }, confirmationCode: string): Response {
  return c.json({
    url: new URL(`/data-deletion/status/${confirmationCode}`, c.req.url).toString(),
    confirmation_code: confirmationCode
  });
}

app.get("/webhooks/meta", async (c) => {
  if (!metaWebhookConfigured(c.env)) return c.text("Le webhook n’est pas configuré", 503);

  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");

  if (mode === "subscribe" && token && challenge && (await matchesVerifyToken(token, c.env.META_VERIFY_TOKEN))) {
    return c.text(challenge);
  }

  return c.text("Accès interdit", 403);
});

app.post("/webhooks/meta", async (c) => {
  if (!metaWebhookConfigured(c.env)) return c.text("Le webhook n’est pas configuré", 503);

  const rawBody = await readLimitedBody(c.req.raw, MAX_WEBHOOK_BODY_BYTES);
  if (!rawBody.ok) return c.text("Charge utile trop volumineuse", 413);

  const signature = c.req.header("X-Hub-Signature-256") ?? null;
  const valid = await verifyAnyMetaSignature(rawBody.bytes, signature, metaWebhookSecrets(c.env));

  if (!valid) return c.text("Non autorisé", 401);

  const rawText = new TextDecoder().decode(rawBody.bytes);
  let payload: unknown;
  try {
    payload = JSON.parse(rawText) as unknown;
  } catch {
    return c.json({ error: "Corps JSON invalide" }, 400);
  }

  const events = normalizeMetaWebhook(payload, c.env.INSTAGRAM_ACCOUNT_ID, messagingAccountIds(c.env));
  const repo = new Repository(c.env.DB);
  const router = new FlowRouter(repo, c.env.DELIVERY_QUEUE, isAutomationEnabled(c.env), c.env.INSTAGRAM_ACCOUNT_ID);

  for (const event of events) {
    await router.handleEvent(event, rawText);
  }

  return c.json({ ok: true, processed: events.length });
});

app.route("/admin", adminRoutes);

export default {
  fetch: app.fetch,
  queue: processDeliveryBatch,
  scheduled(_controller, env, ctx) {
    const repo = new Repository(env.DB);
    const meta = new MetaApiClient(env.INSTAGRAM_ACCOUNT_ID, env.INSTAGRAM_ACCESS_TOKEN);
    ctx.waitUntil(pollCampaignComments(env));
    if (isAutomationEnabled(env)) {
      ctx.waitUntil(recoverStaleDeliveries(repo, env.DELIVERY_QUEUE));
    }
    ctx.waitUntil(runScheduledMaintenance(repo, () => refreshInstagramTokenIfDue(env, repo, meta)));
  }
} satisfies ExportedHandler<Env, DeliveryJob>;

async function readLimitedBody(
  request: Request,
  maxBytes: number
): Promise<{ ok: true; bytes: ArrayBuffer } | { ok: false }> {
  const contentLength = request.headers.get("Content-Length");
  if (contentLength) {
    const parsed = Number.parseInt(contentLength, 10);
    if (Number.isFinite(parsed) && parsed > maxBytes) return { ok: false };
  }

  const body = request.body;
  if (!body) {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > maxBytes) return { ok: false };
    return { ok: true, bytes };
  }

  // Bodies without a trustworthy Content-Length must be capped while streaming,
  // not after they are fully buffered.
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return { ok: false };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, bytes: bytes.buffer };
}

function metaWebhookConfigured(env: Env): boolean {
  return (
    metaWebhookSecrets(env).length > 0 &&
    Boolean(env.INSTAGRAM_ACCOUNT_ID?.trim()) &&
    !env.INSTAGRAM_ACCOUNT_ID.includes("replace-with") &&
    Boolean(env.META_VERIFY_TOKEN?.trim()) &&
    env.META_VERIFY_TOKEN.trim().length >= MIN_VERIFY_TOKEN_LENGTH &&
    !env.META_VERIFY_TOKEN.includes("replace-with")
  );
}

function metaWebhookSecrets(env: Env): string[] {
  const secrets = [env.META_APP_SECRET, env.INSTAGRAM_APP_SECRET].filter(metaAppSecretConfigured);
  return [...new Set(secrets)];
}

function metaAppSecretConfigured(secret: string | undefined): secret is string {
  return Boolean(
    secret &&
      secret.trim().length >= MIN_META_SECRET_LENGTH &&
      !secret.includes("replace-with") &&
      secret !== "app-secret"
  );
}

function messagingAccountIds(env: Pick<Env, "INSTAGRAM_MESSAGING_ACCOUNT_IDS">): string[] {
  return (env.INSTAGRAM_MESSAGING_ACCOUNT_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Verify-token checks compare digests, like every other secret comparison here,
// so the comparison cost does not depend on how much of the token matched.
async function matchesVerifyToken(provided: string, expected: string): Promise<boolean> {
  const [providedHash, expectedHash] = await Promise.all([sha256Hex(provided), sha256Hex(expected)]);
  return timingSafeEqual(providedHash, expectedHash);
}

async function verifyAnyMetaSignature(
  rawBody: ArrayBuffer,
  signature: string | null,
  secrets: string[]
): Promise<boolean> {
  for (const secret of secrets) {
    if (await verifyMetaSignature(rawBody, signature, secret)) return true;
  }

  return false;
}
