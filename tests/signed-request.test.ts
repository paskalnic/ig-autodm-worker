import { describe, expect, it } from "vitest";
import { parseMetaSignedRequest } from "../src/security/signed-request";

const appSecret = "test-meta-app-secret-with-enough-entropy";

describe("parseMetaSignedRequest", () => {
  it("classifies missing and structurally malformed requests", async () => {
    await expect(parseMetaSignedRequest(null, appSecret)).resolves.toEqual({ ok: false, error: "missing" });
    await expect(parseMetaSignedRequest("only-one-part", appSecret)).resolves.toEqual({ ok: false, error: "malformed" });
    await expect(parseMetaSignedRequest(".", appSecret)).resolves.toEqual({ ok: false, error: "malformed" });
  });

  it("rejects unsupported algorithms before signature verification", async () => {
    const payload = encodePayload({ algorithm: "HMAC-SHA1", issued_at: Math.floor(Date.now() / 1000) });

    await expect(parseMetaSignedRequest(`AA.${payload}`, appSecret)).resolves.toEqual({
      ok: false,
      error: "unsupported_algorithm"
    });
  });

  it("rejects an invalid HMAC-SHA256 signature", async () => {
    const payload = encodePayload({ algorithm: "HMAC-SHA256", issued_at: Math.floor(Date.now() / 1000) });

    await expect(parseMetaSignedRequest(`AA.${payload}`, appSecret)).resolves.toEqual({
      ok: false,
      error: "invalid_signature"
    });
  });
});

function encodePayload(payload: Record<string, unknown>): string {
  return btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
