export function adminUiPage(nonce: string, turnstileSiteKey?: string): string {
  const escapedTurnstileSiteKey = escapeHtmlAttr(turnstileSiteKey || "");
  const turnstileEnabled = Boolean(escapedTurnstileSiteKey);
  const turnstileScript = turnstileEnabled
    ? `<script nonce="${nonce}" src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
    : "";
  const turnstileMarkup = turnstileEnabled
    ? `<div class="turnstile-wrap">
              <div class="cf-turnstile" data-sitekey="${escapedTurnstileSiteKey}" data-theme="light"></div>
              <span class="help">Vérification de sécurité supplémentaire fournie par Cloudflare.</span>
            </div>`
    : "";

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f4f1ea">
    <link rel="icon" href="data:,">
    ${turnstileEnabled ? `<link rel="preconnect" href="https://challenges.cloudflare.com">` : ""}
    <title>IG AutoDM Worker</title>
    <style nonce="${nonce}">
      :root {
        color-scheme: light;
        --bg: #f4f1ea;
        --surface: #fffdf8;
        --surface-2: #f9f6ef;
        --ink: #171614;
        --soft-ink: #4b4944;
        --muted: #77736b;
        --line: #ded7cb;
        --line-strong: #c8bfb0;
        --accent: #0f6a43;
        --accent-ink: #073d27;
        --accent-soft: #e5f3ea;
        --danger: #b42318;
        --danger-soft: #fff0ee;
        --warn: #8a5a00;
        --warn-soft: #fff4d8;
        --mono: "JetBrains Mono", "SFMono-Regular", "Cascadia Mono", Consolas, monospace;
        --sans: "Aptos", "Geist", "Satoshi", "Helvetica Neue", Arial, sans-serif;
        --ease: cubic-bezier(0.16, 1, 0.3, 1);
      }

      * { box-sizing: border-box; }
      [hidden] { display: none !important; }
      html { background: var(--bg); }
      body {
        margin: 0;
        min-height: 100dvh;
        background:
          linear-gradient(90deg, rgba(23, 22, 20, 0.035) 1px, transparent 1px),
          linear-gradient(180deg, rgba(23, 22, 20, 0.035) 1px, transparent 1px),
          radial-gradient(circle at 20% 8%, rgba(15, 106, 67, 0.10), transparent 32rem),
          var(--bg);
        background-size: 36px 36px, 36px 36px, auto, auto;
        color: var(--ink);
        font-family: var(--sans);
        font-size: 14px;
        line-height: 1.45;
      }
      body::before {
        content: "";
        display: none;
      }
      button, input, textarea { font: inherit; }
      a, button, summary, input, textarea { touch-action: manipulation; }
      a, button, summary { -webkit-tap-highlight-color: transparent; }
      button {
        align-items: center;
        border: 1px solid var(--line);
        background: var(--surface);
        color: var(--ink);
        cursor: pointer;
        display: inline-flex;
        font-weight: 720;
        gap: 8px;
        justify-content: center;
        min-height: 40px;
        outline: 2px solid transparent;
        outline-offset: 2px;
        padding: 0 14px;
        transition: transform 180ms var(--ease), border-color 180ms var(--ease), background 180ms var(--ease), color 180ms var(--ease);
      }
      button:hover { border-color: var(--line-strong); }
      button:focus-visible {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(15, 106, 67, 0.14);
      }
      button:active { transform: translateY(1px) scale(0.99); }
      button:disabled { cursor: not-allowed; opacity: 0.52; }
      button.primary {
        background: var(--accent);
        border-color: var(--accent);
        color: #fffdf8;
      }
      button.secondary {
        background: var(--accent-soft);
        border-color: #b8dcc4;
        color: var(--accent-ink);
      }
      button.ghost { background: transparent; }
      button.danger { color: var(--danger); }
      button.full { width: 100%; }
      .action-hidden { display: none !important; }
      input, textarea {
        width: 100%;
        border: 1px solid var(--line);
        background: #fffefa;
        color: var(--ink);
        outline: 2px solid transparent;
        outline-offset: 2px;
        padding: 11px 12px;
        transition: border-color 180ms var(--ease), box-shadow 180ms var(--ease), background 180ms var(--ease);
      }
      input:focus-visible, textarea:focus-visible {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(15, 106, 67, 0.14);
      }
      textarea { min-height: 110px; resize: vertical; }
      label { color: var(--soft-ink); display: grid; font-weight: 740; gap: 7px; }
      .help { color: var(--muted); display: block; font-size: 12px; font-weight: 560; }
      .shell { min-height: 100dvh; position: relative; }
      .boot-screen {
        align-items: center;
        display: grid;
        min-height: 100dvh;
        padding: 28px;
        place-items: center;
      }
      .checking-card {
        background: var(--surface);
        border: 1px solid var(--line);
        display: grid;
        gap: 10px;
        max-width: 420px;
        padding: 24px;
        width: 100%;
      }
      .checking-card strong { font-size: 20px; letter-spacing: -0.035em; }
      .checking-card p { color: var(--muted); margin: 0; }

      .lock-screen {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
        min-height: 100dvh;
      }
      .lock-copy {
        align-content: end;
        display: grid;
        gap: 24px;
        padding: 64px clamp(28px, 6vw, 84px);
      }
      .eyebrow {
        color: var(--accent-ink);
        font-family: var(--mono);
        font-size: 12px;
        font-weight: 760;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .lock-copy h1 {
        font-size: clamp(46px, 9vw, 112px);
        letter-spacing: -0.055em;
        line-height: 0.88;
        margin: 0;
        max-width: 820px;
        text-wrap: balance;
      }
      .lock-copy p {
        color: var(--soft-ink);
        font-size: clamp(16px, 2.2vw, 21px);
        margin: 0;
        max-width: 610px;
      }
      .proof-grid {
        border-bottom: 1px solid var(--line);
        border-top: 1px solid var(--line);
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        max-width: 720px;
      }
      .proof {
        display: grid;
        gap: 7px;
        min-height: 104px;
        padding: 20px;
      }
      .proof + .proof { border-left: 1px solid var(--line); }
      .proof strong { font-size: 24px; letter-spacing: -0.04em; }
      .proof span { color: var(--muted); font-size: 12px; }

      .login-wrap {
        align-items: center;
        display: grid;
        padding: clamp(22px, 4vw, 48px);
      }
      .login-panel {
        background: rgba(255, 253, 248, 0.88);
        border: 1px solid rgba(222, 215, 203, 0.9);
        box-shadow: 0 24px 70px rgba(41, 34, 23, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72);
        display: grid;
        gap: 22px;
        padding: clamp(24px, 4vw, 40px);
      }
      .turnstile-wrap {
        border: 1px solid var(--line);
        background: #fffefa;
        display: grid;
        gap: 8px;
        justify-items: start;
        padding: 12px;
      }
      .login-head { display: grid; gap: 8px; }
      .login-head h2 {
        font-size: clamp(24px, 4vw, 38px);
        letter-spacing: -0.04em;
        line-height: 1;
        margin: 0;
      }
      .login-head p { color: var(--muted); margin: 0; }
      .remember {
        align-items: center;
        display: flex;
        gap: 9px;
        font-weight: 680;
      }
      .remember input { height: 18px; width: 18px; }

      .workspace {
        display: grid;
        gap: 0;
        min-height: 100dvh;
      }
      .app-header {
        align-items: center;
        background: rgba(255, 253, 248, 0.86);
        border-bottom: 1px solid var(--line);
        display: flex;
        gap: 18px;
        justify-content: space-between;
        padding: 16px clamp(18px, 4vw, 48px);
        position: sticky;
        top: 0;
        z-index: 20;
      }
      .brand-block {
        display: grid;
        gap: 4px;
      }
      .brand-block strong {
        font-size: 20px;
        letter-spacing: -0.045em;
      }
      .brand-block span { color: var(--muted); font-size: 13px; }
      .campaign-switcher {
        display: grid;
        gap: 16px;
        grid-area: list;
        padding: 16px 18px;
        position: sticky;
        top: 82px;
      }
      .section-head {
        align-items: end;
        display: flex;
        gap: 16px;
        justify-content: space-between;
      }
      .section-head h3 {
        font-size: 17px;
        letter-spacing: -0.03em;
        margin: 0;
      }
      .section-head p {
        color: var(--muted);
        margin: 4px 0 0;
      }
      .campaign-list {
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr;
        max-height: calc(100dvh - 240px);
        overflow: auto;
      }
      .campaign-row {
        background: transparent;
        border: 1px solid var(--line);
        display: grid;
        gap: 8px;
        justify-content: stretch;
        min-height: auto;
        padding: 12px;
        text-align: left;
      }
      .campaign-row:hover { background: rgba(255, 253, 248, 0.72); border-color: var(--line); }
      .campaign-row.active {
        background: var(--surface);
        border-color: var(--line-strong);
        box-shadow: inset 3px 0 0 var(--accent);
      }
      .campaign-row strong { overflow-wrap: anywhere; }
      .campaign-row small { color: var(--muted); font-family: var(--mono); font-size: 11px; overflow-wrap: anywhere; }

      .content {
        display: grid;
        gap: 18px;
        margin: 0 auto;
        max-width: 1680px;
        padding: 18px clamp(18px, 4vw, 48px) 48px;
        width: 100%;
        grid-template-columns: minmax(250px, 300px) minmax(0, 1fr) minmax(320px, 380px);
        grid-template-areas:
          "hero hero hero"
          "status status status"
          "list guide preview"
          "list editor preview"
          "list system system";
        align-items: start;
      }
      .hero-row {
        align-items: end;
        background: rgba(255, 253, 248, 0.82);
        border: 1px solid var(--line);
        display: grid;
        gap: 20px;
        grid-area: hero;
        grid-template-columns: minmax(0, 1fr) auto;
        padding: 16px 18px;
      }
      .hero-row h1 {
        font-size: 28px;
        letter-spacing: -0.045em;
        line-height: 1;
        margin: 0;
        text-wrap: balance;
      }
      .hero-row p { color: var(--muted); margin: 8px 0 0; }
      .top-actions { display: flex; flex-wrap: wrap; gap: 10px; }

      .summary-rail {
        border: 1px solid var(--line);
        display: grid;
        grid-template-columns: repeat(4, minmax(86px, 1fr));
        min-width: min(520px, 100%);
      }
      .status-strip {
        align-items: center;
        background: rgba(255, 253, 248, 0.82);
        border: 1px solid var(--line);
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        grid-area: status;
      }
      .status-strip span {
        color: var(--soft-ink);
        min-height: 38px;
        padding: 10px 14px;
      }
      .status-strip span + span { border-left: 1px solid var(--line); }
      .status-strip strong { color: var(--ink); }
      .quick-guide {
        align-items: center;
        background: var(--surface);
        border: 1px solid var(--line);
        display: grid;
        gap: 16px;
        grid-area: guide;
        grid-template-columns: minmax(0, 1fr) auto;
        padding: 16px 18px;
      }
      .quick-guide h3 {
        font-size: 18px;
        letter-spacing: -0.03em;
        margin: 0 0 4px;
      }
      .guide-steps {
        color: var(--soft-ink);
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .guide-steps span {
        background: var(--surface-2);
        border: 1px solid var(--line);
        padding: 7px 9px;
      }
      .metric {
        display: grid;
        gap: 4px;
        padding: 12px 14px;
      }
      .metric + .metric { border-left: 1px solid var(--line); }
      .metric span { color: var(--muted); font-size: 12px; font-weight: 760; text-transform: uppercase; }
      .metric strong {
        font-family: var(--mono);
        font-size: 23px;
        font-weight: 760;
        letter-spacing: -0.06em;
      }

      .work-grid {
        display: contents;
      }
      .work-grid > .surface:first-child { grid-area: editor; }
      .surface {
        background: rgba(255, 253, 248, 0.82);
        border: 1px solid var(--line);
      }
      .surface-head {
        align-items: center;
        border-bottom: 1px solid var(--line);
        display: flex;
        gap: 12px;
        justify-content: space-between;
        padding: 16px 18px;
      }
      .surface-head h3 { font-size: 15px; margin: 0; }
      .surface-head.editor-head {
        background: rgba(255, 253, 248, 0.96);
        position: sticky;
        top: 73px;
        z-index: 12;
      }
      .editor-title-block {
        display: grid;
        gap: 3px;
        min-width: 0;
      }
      .editor-head-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }
      .editor-head-actions button { min-width: 108px; }
      .surface-body { padding: 20px; }
      .form-grid {
        display: grid;
        gap: 18px;
        max-width: 860px;
      }
      .wizard-steps {
        counter-reset: steps;
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .wizard-steps li {
        background: var(--surface-2);
        border: 1px solid var(--line);
        color: var(--soft-ink);
        display: grid;
        gap: 3px;
        min-height: 70px;
        padding: 10px;
      }
      .wizard-steps li::before {
        color: var(--accent-ink);
        content: counter(steps, decimal-leading-zero);
        counter-increment: steps;
        font-family: var(--mono);
        font-size: 11px;
        font-weight: 780;
      }
      .wizard-steps strong { color: var(--ink); font-size: 13px; }
      .plain-guide {
        background: var(--accent-soft);
        border: 1px solid #b8dcc4;
        color: var(--accent-ink);
        font-weight: 720;
        padding: 12px;
      }
      .form-section {
        border: 1px solid var(--line);
        display: grid;
        gap: 14px;
        padding: 14px;
      }
      .form-section:focus-within {
        border-color: var(--line-strong);
        background: rgba(255, 253, 248, 0.62);
      }
      .form-section-head { display: grid; gap: 4px; }
      .form-section-head h4 {
        font-size: 16px;
        letter-spacing: -0.025em;
        margin: 0;
      }
      .form-section-head p { color: var(--muted); margin: 0; }
      .field-row { display: grid; gap: 14px; grid-template-columns: 1fr 1fr; }
      .creation-grid { display: block; }
      .post-picker {
        display: grid;
        gap: 14px;
        padding: 14px;
      }
      .post-picker-panel {
        background: #fffefa;
        border: 1px solid var(--line);
      }
      .post-picker-panel summary {
        align-items: center;
        cursor: pointer;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        list-style: none;
        padding: 14px;
      }
      .post-picker-panel summary::-webkit-details-marker { display: none; }
      .post-picker-panel summary strong { display: block; }
      .post-picker-panel summary small {
        color: var(--muted);
        display: block;
        font-family: var(--mono);
        font-size: 11px;
        margin-top: 3px;
        overflow-wrap: anywhere;
      }
      .summary-action {
        color: var(--accent-ink);
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
      }
      .post-list {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        max-height: 320px;
        overflow: auto;
      }
      .post-row {
        background: transparent;
        border: 1px solid var(--line);
        display: grid;
        gap: 8px;
        justify-content: stretch;
        min-height: auto;
        padding: 12px;
        text-align: left;
      }
      .post-row:hover { background: rgba(255, 253, 248, 0.74); border-color: var(--line-strong); }
      .post-row.active {
        background: var(--surface);
        border-color: var(--accent);
        box-shadow: inset 3px 0 0 var(--accent);
      }
      .post-row strong { overflow-wrap: anywhere; }
      .post-row small { color: var(--muted); font-family: var(--mono); font-size: 11px; overflow-wrap: anywhere; }
      .post-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: space-between;
      }
      .post-link {
        color: var(--accent-ink);
        font-size: 12px;
        font-weight: 760;
        text-decoration: none;
      }
      .post-link:hover { text-decoration: underline; }
      .post-meta {
        color: var(--muted);
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 12px;
      }
      .editor-pane { padding: 18px; }
      .mode-note {
        background: var(--surface-2);
        border: 1px solid var(--line);
        color: var(--soft-ink);
        display: grid;
        gap: 6px;
        padding: 12px;
      }
      .mode-note strong { color: var(--ink); }
      .advanced-panel {
        border: 1px solid var(--line);
        background: #fffefa;
      }
      .advanced-panel summary {
        cursor: pointer;
        font-weight: 780;
        padding: 12px;
      }
      .advanced-panel .advanced-body {
        border-top: 1px solid var(--line);
        display: grid;
        gap: 14px;
        padding: 12px;
      }
      .variant-library {
        border: 1px solid var(--line);
        background: rgba(255, 253, 248, 0.72);
        display: grid;
        gap: 12px;
        padding: 12px;
      }
      .variant-library-head {
        align-items: end;
        display: grid;
        gap: 10px;
        grid-template-columns: minmax(0, 1fr) minmax(200px, 0.55fr);
      }
      .variant-library-head strong { display: block; }
      .template-panel {
        border: 1px solid var(--line);
        background: rgba(255, 253, 248, 0.72);
      }
      .template-panel > summary {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 12px;
      }
      .template-panel > summary::-webkit-details-marker { display: none; }
      .template-panel > summary strong { display: block; }
      .template-panel > summary span {
        color: var(--muted);
        display: block;
        font-size: 12px;
        margin-top: 2px;
      }
      .template-panel .variant-library {
        border: 0;
        border-top: 1px solid var(--line);
      }
      .template-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: 126px;
        overflow: auto;
      }
      .template-chip {
        background: #fffefa;
        border: 1px solid var(--line);
        color: var(--soft-ink);
        min-height: 32px;
        max-width: 100%;
      }
      .template-chip.active {
        background: var(--accent-soft);
        border-color: #b8dcc4;
        color: var(--accent-ink);
      }
      .template-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
      .dm-step-panel > summary strong { color: var(--ink); }
      .dm-step-editor {
        border-top: 1px solid var(--line);
        display: grid;
        gap: 12px;
        padding: 12px;
      }
      .dm-step-list {
        display: grid;
        gap: 10px;
      }
      .dm-step-row {
        background: rgba(255, 253, 248, 0.78);
        border: 1px solid var(--line);
        display: grid;
        gap: 10px;
        padding: 12px;
      }
      .dm-step-row-head {
        align-items: center;
        display: flex;
        gap: 10px;
        justify-content: space-between;
      }
      .dm-step-row-head strong {
        color: var(--accent-ink);
        font-family: var(--mono);
        font-size: 12px;
        text-transform: uppercase;
      }
      .dm-step-grid {
        display: grid;
        gap: 10px;
        grid-template-columns: minmax(0, 1fr) minmax(150px, 220px);
      }
      .dm-step-variants { grid-column: 1 / -1; }
      .dm-step-actions {
        align-items: center;
        display: flex;
        gap: 10px;
        justify-content: space-between;
      }
      .field-error {
        color: var(--danger);
        display: none;
        font-size: 12px;
        font-weight: 680;
      }
      .field-error.show { display: block; }
      .live-control {
        background: var(--warn-soft);
        border: 1px solid #efd18b;
        display: grid;
        gap: 8px;
        padding: 12px;
      }
      .option-card {
        background: var(--surface-2);
        border: 1px solid var(--line);
        display: grid;
        gap: 8px;
        padding: 12px;
      }
      .option-card.active {
        background: var(--accent-soft);
        border-color: #b8dcc4;
      }
      .activation-card {
        background: var(--surface-2);
        border: 1px solid var(--line);
        display: grid;
        gap: 8px;
        padding: 14px;
      }
      .activation-card.live {
        background: var(--accent-soft);
        border-color: #b8dcc4;
      }
      .activation-card.draft {
        background: var(--warn-soft);
        border-color: #efd18b;
      }
      .activation-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .activation-actions button { min-width: 120px; }
      input[readonly] {
        background: #f3eee5;
        color: var(--muted);
      }
      .checks { align-items: center; display: flex; flex-wrap: wrap; gap: 16px; }
      .check { align-items: center; display: inline-flex; gap: 9px; font-weight: 740; }
      .check input { height: 18px; width: 18px; }
      .editor-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }

      .preview-panel {
        grid-area: preview;
        position: sticky;
        top: 82px;
        max-height: calc(100dvh - 98px);
        overflow: auto;
      }
      .preview-body {
        display: grid;
        gap: 14px;
        padding: 16px;
      }
      .readiness-list {
        background: #fffefa;
        border: 1px solid var(--line);
        color: var(--soft-ink);
        display: grid;
        gap: 8px;
        padding: 12px;
      }
      .readiness-list strong { color: var(--ink); }
      .readiness-item {
        align-items: center;
        background: transparent;
        border: 0;
        cursor: pointer;
        display: flex;
        font-weight: inherit;
        gap: 8px;
        justify-content: space-between;
        min-height: auto;
        padding: 0;
        text-align: left;
        width: 100%;
      }
      .readiness-item:active { transform: none; }
      .readiness-item:focus-visible {
        box-shadow: none;
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .readiness-item span:last-child {
        font-family: var(--mono);
        font-size: 11px;
        font-weight: 780;
      }
      .readiness-item.ok span:last-child { color: var(--accent-ink); }
      .readiness-item.missing span:last-child { color: var(--warn); }
      .ig-preview-block {
        background: #0f1014;
        border: 1px solid #252833;
        color: #f4f5f7;
        display: grid;
        gap: 12px;
        padding: 14px;
      }
      .ig-preview-block h4 {
        color: #f7f7f8;
        font-size: 13px;
        margin: 0;
      }
      .preview-muted {
        color: #a8abb5;
        font-size: 12px;
      }
      .comment-preview {
        display: grid;
        gap: 12px;
      }
      .comment-line {
        display: grid;
        gap: 10px;
        grid-template-columns: 34px minmax(0, 1fr);
      }
      .comment-avatar {
        align-items: center;
        background: linear-gradient(135deg, #315c4a, #0f6a43);
        border: 2px solid #30343d;
        border-radius: 999px;
        color: #fff;
        display: inline-flex;
        font-weight: 850;
        height: 34px;
        justify-content: center;
        width: 34px;
      }
      .comment-copy {
        display: grid;
        gap: 3px;
        min-width: 0;
      }
      .comment-copy strong {
        color: #f8f8fa;
        font-size: 13px;
      }
      .comment-copy span {
        color: #e8e9ee;
        overflow-wrap: anywhere;
      }
      .comment-reply {
        border-left: 2px solid #30343d;
        margin-left: 16px;
        padding-left: 14px;
      }
      .dm-phone {
        background: #050507;
        border: 1px solid #2b2d35;
        display: grid;
        gap: 12px;
        min-height: 390px;
        padding: 12px;
      }
      .dm-header {
        align-items: center;
        border-bottom: 1px solid #20222a;
        display: flex;
        gap: 10px;
        padding-bottom: 10px;
      }
      .dm-avatar {
        align-items: center;
        background: #f4f5f7;
        border-radius: 999px;
        color: #101114;
        display: inline-flex;
        font-weight: 900;
        height: 30px;
        justify-content: center;
        width: 30px;
      }
      .dm-thread {
        align-content: start;
        display: grid;
        gap: 12px;
      }
      .dm-card,
      .dm-bubble {
        border-radius: 18px;
        max-width: 92%;
        overflow-wrap: anywhere;
        padding: 12px;
      }
      .dm-card {
        background: #22242b;
        justify-self: start;
      }
      .dm-card.step-card {
        background: #262932;
        border-left: 3px solid #4c856c;
      }
      .dm-card p {
        margin: 0 0 10px;
        white-space: pre-wrap;
      }
      .dm-button-preview {
        background: #323640;
        border-radius: 10px;
        color: #fff;
        font-weight: 850;
        padding: 10px;
        text-align: center;
      }
      .dm-bubble.user {
        background: #5b37ee;
        justify-self: end;
      }
      .dm-bubble.brand {
        background: #22242b;
        justify-self: start;
        white-space: pre-wrap;
      }
      .preview-empty {
        color: #a8abb5;
        font-style: italic;
      }

      .system-panel {
        background: rgba(255, 253, 248, 0.62);
        border: 1px solid var(--line);
        grid-area: system;
      }
      .system-panel > summary {
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 14px 18px;
      }
      .system-panel > summary::-webkit-details-marker { display: none; }
      .system-body {
        border-top: 1px solid var(--line);
        display: grid;
        gap: 16px;
        grid-template-columns: 1fr 1fr;
        padding: 16px 18px;
      }
      .system-body h3 {
        font-size: 14px;
        margin: 0 0 10px;
      }
      .runtime-list { display: grid; }
      .runtime-item {
        align-items: center;
        border-bottom: 1px solid var(--line);
        display: flex;
        gap: 12px;
        justify-content: space-between;
        padding: 13px 0;
      }
      .runtime-item:first-child { padding-top: 0; }
      .runtime-item:last-child { border-bottom: 0; padding-bottom: 0; }
      .runtime-item span:first-child { color: var(--muted); }
      .runtime-item strong { font-family: var(--mono); font-size: 12px; overflow-wrap: anywhere; text-align: right; }
      .pill {
        align-items: center;
        display: inline-flex;
        font-size: 12px;
        font-weight: 780;
        min-height: 24px;
        padding: 0 9px;
      }
      .pill.ok { background: var(--accent-soft); color: var(--accent-ink); }
      .pill.off { background: #ebe5da; color: var(--soft-ink); }
      .pill.warn { background: var(--warn-soft); color: var(--warn); }
      .pill.bad { background: var(--danger-soft); color: var(--danger); }
      .notice {
        border: 1px solid var(--line);
        display: none;
        padding: 11px 12px;
      }
      .notice.show { display: block; }
      .notice.ok { background: var(--accent-soft); border-color: #b8dcc4; color: var(--accent-ink); }
      .notice.bad { background: var(--danger-soft); border-color: #f2b7b1; color: var(--danger); }
      .empty {
        border: 1px dashed var(--line-strong);
        color: var(--muted);
        padding: 28px;
        text-align: center;
      }
      .fade-in { animation: fadeIn 420ms var(--ease) both; }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 980px) {
        .lock-screen { grid-template-columns: 1fr; }
        .content {
          grid-template-columns: 1fr;
          grid-template-areas:
            "hero"
            "status"
            "guide"
            "list"
            "editor"
            "preview"
            "system";
        }
        .hero-row { align-items: stretch; grid-template-columns: 1fr; }
        .summary-rail { min-width: 0; }
        .campaign-switcher,
        .work-grid > .surface:first-child,
        .preview-panel,
        .system-panel {
          grid-column: 1;
          position: static;
          max-height: none;
        }
        .preview-panel { position: static; }
        .system-body { grid-template-columns: 1fr; }
      }
      @media (max-width: 640px) {
        .lock-copy, .login-wrap, .content { padding: 18px; }
        .app-header, .section-head { align-items: stretch; flex-direction: column; }
        .proof-grid, .field-row { grid-template-columns: 1fr; }
        .quick-guide { grid-template-columns: 1fr; }
        .wizard-steps { grid-template-columns: 1fr; }
        .summary-rail {
          border: 0;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .summary-rail .metric { border: 1px solid var(--line); }
        .proof + .proof { border-left: 0; border-top: 1px solid var(--line); }
        .app-header .top-actions { display: grid; grid-template-columns: 1fr 1fr; }
        .app-header .top-actions button { width: auto; }
        .editor-actions { justify-content: stretch; }
        .editor-actions button { width: 100%; }
        .dm-step-grid { grid-template-columns: 1fr; }
        .variant-library-head { grid-template-columns: 1fr; }
        .template-actions button { width: 100%; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: 0.001ms !important;
        }
      }
    </style>
  </head>
  <body data-admin-ui>
    <div class="shell">
      <section id="bootScreen" class="boot-screen">
        <div class="checking-card">
          <div class="eyebrow">Espace d’administration</div>
          <strong>Vérification de l’accès…</strong>
          <p>Si votre session est encore active, le tableau de bord s’ouvrira automatiquement.</p>
        </div>
      </section>

      <section id="lockScreen" class="lock-screen" hidden>
        <div class="lock-copy">
          <div class="eyebrow">Espace d’administration</div>
          <h1>IG AutoDM Worker</h1>
          <p>Gérez vos campagnes de messages privés Instagram depuis une interface claire et sécurisée.</p>
          <div class="proof-grid" aria-label="Résumé de la sécurité">
            <div class="proof"><strong>Privé</strong><span>accès réservé à l’administrateur</span></div>
            <div class="proof"><strong>2 étapes</strong><span>identifiants + clé de sécurité</span></div>
            <div class="proof"><strong>30 minutes</strong><span>verrouillage automatique en cas d’inactivité</span></div>
          </div>
        </div>
        <div class="login-wrap">
          <form id="loginForm" class="login-panel">
            <div class="login-head">
              <div class="eyebrow">Connexion</div>
              <h2>Accéder au tableau de bord</h2>
              <p>Utilisez votre compte administrateur et votre clé de sécurité.</p>
            </div>
            <div class="field-row">
              <label>
                Nom d’utilisateur
                <input id="adminUsername" name="username" type="text" autocomplete="username" spellcheck="false" placeholder="admin">
                <span class="help">Le compte administrateur autorisé.</span>
              </label>
              <label>
                Mot de passe
                <input id="adminPassword" name="password" type="password" autocomplete="current-password" spellcheck="false" placeholder="Mot de passe">
                <span class="help">Le mot de passe du compte administrateur.</span>
              </label>
            </div>
            <label>
              Clé de sécurité
              <input id="adminToken" name="adminToken" type="password" autocomplete="off" spellcheck="false" placeholder="Collez la clé de sécurité">
              <span class="help">Code d’accès supplémentaire protégeant le tableau de bord.</span>
            </label>
            ${turnstileMarkup}
            <div id="loginNotice" class="notice" role="alert" aria-live="assertive"></div>
            <button id="connectButton" class="primary" type="submit">Se connecter</button>
          </form>
        </div>
      </section>

      <section id="workspace" class="workspace fade-in" hidden>
        <header class="app-header">
          <div class="brand-block">
            <strong>IG AutoDM Worker</strong>
            <span id="connectionState">Connecté</span>
          </div>
          <div class="top-actions">
            <button id="refreshButton" type="button">Actualiser</button>
            <button id="clearButton" type="button">Verrouiller</button>
          </div>
        </header>

        <main class="content">
          <section class="hero-row">
            <div>
              <div class="eyebrow">Auto-DM Instagram</div>
              <h1>Campagnes de messages privés</h1>
              <p id="selectedCampaignId">Sélectionnez une campagne ou créez-en une. Une campagne active répond aux commentaires correspondant au déclencheur.</p>
            </div>
            <div class="summary-rail" aria-label="Résumé du tableau de bord">
              <div class="metric"><span>Campagnes</span><strong id="campaignCount">-</strong></div>
              <div class="metric"><span>Envoyés</span><strong id="deliveryCount">-</strong></div>
              <div class="metric"><span>Échecs</span><strong id="failedCount">-</strong></div>
              <div class="metric"><span>En attente</span><strong id="retryingCount">-</strong></div>
            </div>
          </section>

          <section class="status-strip" aria-label="État de préparation">
            <span>État : <strong id="readinessRuntime">vérification</strong></span>
            <span>Campagnes actives : <strong id="readinessLive">-</strong></span>
            <span>Connexion Instagram : <strong id="readinessToken">-</strong></span>
            <span>Erreur : <strong id="readinessError">aucune</strong></span>
          </section>

          <section id="quickGuide" class="quick-guide" aria-label="Guide de démarrage">
            <div>
              <h3>Créer une campagne</h3>
              <p class="help">Choisissez une publication, définissez le déclencheur, vérifiez l’aperçu, enregistrez le brouillon puis activez-le.</p>
              <div class="guide-steps">
                <span>1. Choisir une publication</span>
                <span>2. Définir le déclencheur</span>
                <span>3. Rédiger le parcours privé</span>
                <span>4. Enregistrer puis activer</span>
              </div>
            </div>
            <button id="quickStartButton" class="primary" type="button">Choisir une publication</button>
          </section>

          <section class="surface campaign-switcher" aria-label="Sélectionner une campagne">
            <div class="section-head">
              <div>
                <h3>Liste des campagnes</h3>
                <p>Chaque campagne surveille une publication, un déclencheur et un parcours de messages privés.</p>
              </div>
              <button id="newCampaignButtonSide" class="secondary" type="button">Créer une campagne</button>
            </div>
            <div id="campaignList" class="campaign-list" aria-label="Liste des campagnes">
              <div class="empty">Aucune campagne chargée.</div>
            </div>
          </section>

          <section class="work-grid">
            <div class="surface">
              <div class="surface-head editor-head">
                <div class="editor-title-block">
                  <h3 id="editorTitle">Éditeur de campagne</h3>
                  <span id="editorSubtitle" class="help">Sélectionnez une campagne ou créez-en une.</span>
                </div>
                <div class="editor-head-actions">
                  <span id="saveState" class="pill off">prêt</span>
                  <button id="saveDraftButton" class="primary" type="button">Enregistrer le brouillon</button>
                  <button id="goLiveButton" class="secondary" type="button">Activer la campagne</button>
                  <button id="pauseCampaignButton" type="button">Mettre en pause</button>
                  <button id="deleteCampaignButton" class="danger" type="button">Supprimer</button>
                </div>
              </div>
              <div class="surface-body">
                <form id="campaignForm" class="form-grid">
                  <div id="modeNote" class="mode-note">
                    <strong>Sélectionnez une campagne</strong>
                    <span class="help">Choisissez une campagne existante ou créez-en une nouvelle.</span>
                  </div>

                  <div class="plain-guide">Renseignez les éléments obligatoires : publication, déclencheur, premier message, bouton et contenu final. Vous pourrez ajouter des variantes ensuite.</div>

                  <section class="form-section">
                    <div class="form-section-head">
                      <h4>1. Choisissez une publication Instagram</h4>
                      <p>La campagne s’appliquera uniquement à cette publication, pas à tout le compte Instagram.</p>
                    </div>
                    <details id="postPickerPanel" class="post-picker-panel">
                      <summary>
                        <span>
                          <strong>Publication surveillée</strong>
                          <small id="selectedPostLabel">Aucune publication sélectionnée</small>
                        </span>
                        <span class="summary-action">Choisir</span>
                      </summary>
                      <div class="post-picker">
                        <div>
                          <div class="eyebrow">Publications récentes</div>
                          <p class="help">Choisissez la publication que cette campagne doit surveiller.</p>
                        </div>
                        <div id="mediaNotice" class="notice" role="status" aria-live="polite"></div>
                        <div id="postList" class="post-list" aria-label="Publications Instagram récentes">
                          <div class="empty">Ouvrez la liste ou cliquez sur Actualiser les publications.</div>
                        </div>
                        <button id="reloadMediaButton" class="full" type="button">Actualiser les publications</button>
                      </div>
                    </details>
                    <span id="mediaIdError" class="field-error"></span>
                  </section>

                  <section class="form-section">
                    <div class="form-section-head">
                      <h4>2. Déclencheur dans les commentaires</h4>
                      <p>Le parcours privé démarre lorsqu’un commentaire contient ce mot ou cette expression. La casse, les petites fautes de frappe et l’ordre des mots sont tolérés.</p>
                    </div>
                    <div class="field-row">
                      <label>Nom de la campagne<input id="name" name="name" maxlength="80" required placeholder="Exemple : Guide Bleu Vert"><span class="help">Ce nom apparaît uniquement dans le tableau de bord.</span><span id="nameError" class="field-error"></span></label>
                      <label>Mot ou expression déclencheur<input id="keyword" name="keyword" maxlength="80" required placeholder="Bleu Vert"><span class="help">Saisissez le déclencheur principal. Les petites fautes seront reconnues automatiquement.</span><span id="keywordError" class="field-error"></span></label>
                    </div>
                  </section>

                  <section class="form-section">
                    <div class="form-section-head">
                      <h4>3. Parcours en message privé</h4>
                      <p>Voici ce que reçoit l’utilisateur : un premier message, un bouton, puis le contenu ou le lien final.</p>
                    </div>
                    <label>Premier message privé<textarea id="openingText" name="openingText" maxlength="640" required placeholder="Votre contenu est prêt. Appuyez sur le bouton ci-dessous."></textarea><span class="help">Premier message envoyé après un commentaire correspondant au déclencheur.</span><span id="openingTextError" class="field-error"></span></label>
                    <label>Bouton du premier message<input id="buttonTitle" name="buttonTitle" maxlength="20" required><span class="help">Ce bouton mène au contenu ou au lien final. 20 caractères maximum.</span><span id="buttonTitleError" class="field-error"></span></label>
                    <div id="followGateCard" class="option-card">
                      <label class="check"><input id="followGateEnabled" name="followGateEnabled" type="checkbox"> Exiger un abonnement avant le contenu final</label>
                      <span class="help">Si l’utilisateur ne suit pas encore le compte, un message l’invite à s’abonner puis à réessayer. La réponse « PRÊT » reste disponible en solution de secours.</span>
                      <span id="followGateEnabledError" class="field-error"></span>
                      <label>Message si l’utilisateur n’est pas abonné<textarea id="followGateText" name="followGateText" maxlength="640" placeholder="Abonnez-vous à ce compte, puis appuyez de nouveau sur le bouton. S’il n’apparaît pas, répondez PRÊT."></textarea><span class="help">Facultatif. Si ce champ est vide, un texte adapté au nom du bouton sera généré.</span><span id="followGateTextError" class="field-error"></span></label>
                      <label>Bouton après abonnement<input id="followGateButtonTitle" name="followGateButtonTitle" maxlength="20" placeholder="JE SUIS ABONNÉ"><span class="help">Facultatif. Si ce champ est vide, le bouton du premier message sera réutilisé.</span><span id="followGateButtonTitleError" class="field-error"></span></label>
                    </div>
                    <details class="template-panel">
                      <summary>
                        <span>
                          <strong>Facultatif : variantes du premier message</strong>
                          <span>Ajoutez plusieurs formulations pour varier les messages envoyés.</span>
                        </span>
                        <span class="summary-action">Ouvrir</span>
                      </summary>
                      <div class="variant-library">
                        <label>Variantes du premier message<textarea id="openingTextVariants" name="openingTextVariants" placeholder="Votre contenu est prêt, appuyez sur le bouton ci-dessous.&#10;Tout est prêt. Continuez avec ce bouton."></textarea><span class="help">Une variante par ligne. Le message principal est toujours inclus.</span><span id="openingTextVariantsError" class="field-error"></span></label>
                        <div class="variant-library-head">
                          <div>
                            <strong>Bibliothèque de premiers messages</strong>
                            <span class="help">Cliquez sur un modèle pour l’ajouter aux variantes. Pensez ensuite à enregistrer la campagne.</span>
                          </div>
                          <label>Rechercher<input id="openingTemplateSearch" placeholder="Rechercher un premier message…" autocomplete="off"></label>
                        </div>
                        <div id="openingTemplateList" class="template-list">
                          <div class="empty">Aucun modèle enregistré.</div>
                        </div>
                        <div class="template-actions">
                          <button id="saveOpeningTemplatesButton" type="button">Ajouter à la bibliothèque</button>
                        </div>
                      </div>
                    </details>
                    <details id="dmStepPanel" class="template-panel dm-step-panel" hidden>
                      <summary>
                        <span>
                          <strong>Facultatif : messages intermédiaires</strong>
                          <span id="dmStepSummary">Sans étape supplémentaire, le premier bouton envoie directement le contenu final.</span>
                        </span>
                        <span class="summary-action">Configurer</span>
                      </summary>
                      <div class="dm-step-editor">
                        <p class="help">Utilisez ces étapes si l’utilisateur doit suivre plusieurs messages avant de recevoir le contenu final. 3 étapes supplémentaires maximum.</p>
                        <div id="dmStepsList" class="dm-step-list"></div>
                        <div class="dm-step-actions">
                          <span id="dmStepsError" class="field-error"></span>
                          <button id="addDmStepButton" class="secondary" type="button">Ajouter une étape</button>
                        </div>
                      </div>
                    </details>
                    <label>Contenu ou lien final<textarea id="deliveryText" name="deliveryText" maxlength="2000" required placeholder="Collez ici le lien Notion ou le contenu complet."></textarea><span class="help">Contenu principal remis à l’utilisateur à la fin du parcours privé.</span><span id="deliveryTextError" class="field-error"></span></label>
                  </section>

                  <section class="form-section">
                    <div class="form-section-head">
                      <h4>4. Réponse publique au commentaire</h4>
                      <p>Cette réponse apparaît sous le commentaire après l’envoi du premier message privé. Laissez vide pour ne rien publier.</p>
                    </div>
                    <label>Réponse publique principale<textarea id="commentReplyText" name="commentReplyText" maxlength="300" placeholder="Regardez vos messages privés 😊"></textarea><span class="help">Facultatif. Informe l’utilisateur que son message privé a été envoyé. 300 caractères maximum.</span><span id="commentReplyTextError" class="field-error"></span></label>
                    <label>Réponse si le message privé échoue<textarea id="openingFailureReplyText" name="openingFailureReplyText" maxlength="300" placeholder="Nous n’avons pas pu vous envoyer de message. Autorisez les messages privés, puis publiez un nouveau commentaire avec PROMPT."></textarea><span class="help">Facultatif. Publiée si Instagram refuse le premier message privé parce que l’utilisateur ne peut pas encore en recevoir.</span><span id="openingFailureReplyTextError" class="field-error"></span></label>
                    <details class="template-panel">
                      <summary>
                        <span>
                          <strong>Facultatif : variantes de réponse publique</strong>
                          <span>Ajoutez plusieurs formulations pour rendre les réponses plus naturelles.</span>
                        </span>
                        <span class="summary-action">Ouvrir</span>
                      </summary>
                      <div class="variant-library">
                        <label>Variantes de réponse publique<textarea id="commentReplyTextVariants" name="commentReplyTextVariants" placeholder="C’est envoyé en message privé 😊&#10;Consultez vos messages privés&#10;Voilà, regardez votre boîte de réception"></textarea><span class="help">Une variante par ligne. La réponse principale est toujours incluse.</span><span id="commentReplyTextVariantsError" class="field-error"></span></label>
                        <div class="variant-library-head">
                          <div>
                            <strong>Bibliothèque de réponses publiques</strong>
                            <span class="help">Cliquez sur un modèle pour l’ajouter aux variantes. Pensez ensuite à enregistrer la campagne.</span>
                          </div>
                          <label>Rechercher<input id="commentReplyTemplateSearch" placeholder="Rechercher une réponse…" autocomplete="off"></label>
                        </div>
                        <div id="commentReplyTemplateList" class="template-list">
                          <div class="empty">Aucun modèle enregistré.</div>
                        </div>
                        <div class="template-actions">
                          <button id="saveCommentReplyTemplatesButton" type="button">Ajouter à la bibliothèque</button>
                        </div>
                      </div>
                    </details>
                  </section>

                  <section id="activationCard" class="activation-card draft">
                    <div>
                      <strong id="activationTitle">Brouillon</strong>
                      <span id="activationCopy" class="help">Enregistrez d’abord le brouillon, puis activez-le après vérification.</span>
                    </div>
                    <input id="enabled" name="enabled" type="checkbox" hidden>
                  </section>
                  <details class="advanced-panel">
                    <summary>Paramètres avancés</summary>
                    <div class="advanced-body">
                      <div class="field-row">
                        <label>ID de la publication<input id="mediaId" name="mediaId" aria-required="true"><span class="help">Renseigné automatiquement. Vous pouvez le coller manuellement si la liste ne se charge pas.</span><span id="mediaIdAdvancedError" class="field-error"></span></label>
                        <label>ID de la campagne<input id="campaignId" name="campaignId" required><span class="help">Généré automatiquement. Ne le modifiez que si vous avez besoin d’un identifiant précis.</span><span id="campaignIdError" class="field-error"></span></label>
                      </div>
                      <div class="field-row">
                        <label>Code du bouton<input id="buttonPayload" name="buttonPayload" required readonly><span class="help">Généré automatiquement pour reconnaître le bouton utilisé.</span><span id="buttonPayloadError" class="field-error"></span></label>
                      </div>
                    </div>
                  </details>
                  <div id="formStatus" class="notice show ok" role="status" aria-live="polite">Sélectionnez une campagne ou créez-en une.</div>
                  <div id="summaryPreview" class="mode-note">
                    <strong>Résumé</strong>
                    <span class="help">Aucune campagne sélectionnée.</span>
                  </div>
                  <div id="notice" class="notice" role="status" aria-live="polite"></div>
                  <div class="editor-actions">
                    <button id="newCampaignButtonTop" class="secondary action-hidden" type="button">Créer une campagne</button>
                    <button id="reloadCampaignButton" type="button">Annuler les modifications</button>
                    <button id="reloadCampaignButtonBottom" class="action-hidden" type="button">Réinitialiser</button>
                    <button id="saveCampaignButtonTop" class="primary action-hidden" type="button">Enregistrer</button>
                    <button id="saveCampaignButton" class="primary action-hidden" type="submit">Enregistrer la campagne</button>
                  </div>
                </form>
              </div>
            </div>

            <aside class="surface preview-panel" aria-label="Aperçu de la campagne">
              <div class="surface-head">
                <h3>Aperçu côté abonné</h3>
                <span id="previewState" class="pill off">brouillon</span>
              </div>
              <div class="preview-body">
                <div class="readiness-list" aria-label="Vérifications avant activation">
                  <strong>Avant d’activer la campagne</strong>
                    <button id="readyPost" class="readiness-item missing" type="button"><span>Publication</span><span>Non sélectionnée</span></button>
                    <button id="readyKeyword" class="readiness-item missing" type="button"><span>Déclencheur</span><span>Non renseigné</span></button>
                    <button id="readyOpening" class="readiness-item missing" type="button"><span>Premier message + bouton</span><span>Incomplet</span></button>
                    <button id="readyFollowGate" class="readiness-item missing" type="button"><span>Abonnement requis</span><span>Désactivé</span></button>
                    <button id="readyFinal" class="readiness-item missing" type="button"><span>Contenu final</span><span>Non renseigné</span></button>
                    <button id="readyReply" class="readiness-item ok" type="button"><span>Réponse publique</span><span>Désactivée</span></button>
                </div>
                <div class="ig-preview-block">
                  <div>
                    <h4>Dans les commentaires</h4>
                    <span class="preview-muted">Aperçu après un commentaire contenant le déclencheur.</span>
                  </div>
                  <div class="comment-preview">
                    <div class="comment-line">
                      <span class="comment-avatar">U</span>
                      <div class="comment-copy">
                        <strong>@utilisateur</strong>
                        <span id="previewUserComment" class="preview-empty">Déclencheur non renseigné.</span>
                      </div>
                    </div>
                    <div class="comment-line comment-reply">
                    <span class="comment-avatar">B</span>
                      <div class="comment-copy">
                        <strong>@createur_exemple</strong>
                        <span id="previewPublicReply" class="preview-empty">Facultatif. Aucun commentaire public ne sera publié si ce champ reste vide.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ig-preview-block">
                  <div>
                    <h4>Dans les messages privés</h4>
                    <span class="preview-muted">Aperçu du parcours reçu dans la messagerie Instagram.</span>
                  </div>
                  <div class="dm-phone">
                    <div class="dm-header">
                      <span class="dm-avatar">B</span>
                      <div>
                        <strong>Créateur exemple</strong>
                        <div class="preview-muted">@createur_exemple</div>
                      </div>
                    </div>
                    <div id="previewDmThread" class="dm-thread">
                      <div class="dm-card">
                        <p id="previewOpening" class="preview-empty">Premier message non renseigné.</p>
                        <div id="previewButtonTitle" class="dm-button-preview">VOIR LE CONTENU</div>
                      </div>
                      <div id="previewTapBubble" class="dm-bubble user">VOIR LE CONTENU</div>
                      <div id="previewDelivery" class="dm-bubble brand preview-empty">Contenu final non renseigné.</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <details class="system-panel">
              <summary>
                <strong>État du système</strong>
                <span id="runtimeStatus" class="pill ok">en ligne</span>
              </summary>
              <div class="system-body">
                <div>
                  <h3>État du système</h3>
                  <div class="runtime-list">
                    <div class="runtime-item"><span>Connexion Instagram</span><strong id="tokenSource">-</strong></div>
                    <div class="runtime-item"><span>Expiration</span><strong id="tokenExpiry">-</strong></div>
                    <div class="runtime-item"><span>Dernière erreur</span><strong id="tokenError">-</strong></div>
                    <div class="runtime-item"><span>Limite d’envoi</span><strong id="sendLimit">-</strong></div>
                    <div class="runtime-item"><span>Commentaires analysés par publication</span><strong id="pollLimit">-</strong></div>
                  </div>
                </div>
                <div>
                  <h3>Campagne sélectionnée <span id="selectedState" class="pill off">aucune</span></h3>
                  <div class="runtime-list">
                    <div class="runtime-item"><span>Déclencheur</span><strong id="selectedKeyword">-</strong></div>
                    <div class="runtime-item"><span>ID de la publication</span><strong id="selectedMedia">-</strong></div>
                    <div class="runtime-item"><span>Réponse publique</span><strong id="selectedReply">-</strong></div>
                  </div>
                </div>
              </div>
            </details>
          </section>
        </main>
      </section>
    </div>

    ${turnstileScript}
    <script nonce="${nonce}">
      const state = {
        csrfToken: "",
        campaigns: [],
        media: [],
        templates: [],
        selectedId: null,
        selectedMediaId: null,
        dashboard: null,
        mode: "empty",
        dirty: false,
        saving: false,
        mediaLoaded: false
      };
      const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
      const CSRF_HEADER = "X-CSRF-Token";
      const MAX_DM_STEPS = 3;
      let inactivityTimer = null;
      let summaryTimer = null;
      let mediaLoading = false;

      const $ = (id) => document.getElementById(id);
      const formFields = [
        "name",
        "mediaId",
        "keyword",
        "buttonTitle",
        "buttonPayload",
        "openingText",
        "deliveryText",
        "commentReplyText",
        "openingFailureReplyText",
        "enabled",
        "followGateEnabled",
        "followGateText",
        "followGateButtonTitle"
      ];
      const variantFields = ["openingTextVariants", "commentReplyTextVariants"];
      const inputs = ["campaignId", ...formFields, ...variantFields];

      $("loginForm").addEventListener("submit", connect);
      $("clearButton").addEventListener("click", lockConsole);
      $("refreshButton").addEventListener("click", guardedRefreshAll);
      $("quickStartButton").addEventListener("click", startNewCampaign);
      $("reloadMediaButton").addEventListener("click", reloadMedia);
      $("postPickerPanel").addEventListener("toggle", () => {
        if ($("postPickerPanel").open) void ensureMediaLoaded();
      });
      $("newCampaignButtonSide").addEventListener("click", startNewCampaign);
      $("newCampaignButtonTop").addEventListener("click", startNewCampaign);
      $("reloadCampaignButton").addEventListener("click", resetCurrentForm);
      $("reloadCampaignButtonBottom").addEventListener("click", resetCurrentForm);
      $("saveDraftButton").addEventListener("click", () => $("campaignForm").requestSubmit());
      $("saveCampaignButtonTop").addEventListener("click", () => $("campaignForm").requestSubmit());
      $("campaignForm").addEventListener("submit", saveCampaign);
      $("campaignForm").addEventListener("invalid", handleInvalidField, true);
      $("addDmStepButton").addEventListener("click", () => {
        addDmStep();
        markDirty();
      });
      $("goLiveButton").addEventListener("click", () => void goLiveCampaign());
      $("pauseCampaignButton").addEventListener("click", () => void pauseCampaign());
      $("deleteCampaignButton").addEventListener("click", () => void deleteCampaign());
      $("openingTemplateSearch").addEventListener("input", renderTemplateLibraries);
      $("commentReplyTemplateSearch").addEventListener("input", renderTemplateLibraries);
      $("saveOpeningTemplatesButton").addEventListener("click", () => saveTemplatesFromForm("opening"));
      $("saveCommentReplyTemplatesButton").addEventListener("click", () => saveTemplatesFromForm("comment_reply"));
      bindReadyAction("readyPost", () => {
        $("postPickerPanel").open = true;
        $("postPickerPanel").querySelector("summary")?.focus();
        void ensureMediaLoaded();
      });
      bindReadyAction("readyKeyword", () => $("keyword").focus());
      bindReadyAction("readyOpening", () => $("openingText").focus());
      bindReadyAction("readyFollowGate", () => $("followGateEnabled").focus());
      bindReadyAction("readyFinal", () => $("deliveryText").focus());
      bindReadyAction("readyReply", () => $("commentReplyText").focus());
      $("keyword").addEventListener("input", syncGeneratedFields);
      $("name").addEventListener("input", syncGeneratedFields);
      $("campaignId").addEventListener("input", () => {
        $("campaignId").dataset.generated = "false";
        syncPayloadFromCampaignId();
        markDirty();
      });
      for (const field of [...formFields, ...variantFields]) {
        const input = $(field);
        input.addEventListener(input.type === "checkbox" ? "change" : "input", markDirty);
      }
      for (const eventName of ["click", "keydown", "pointerdown"]) {
        document.addEventListener(eventName, resetInactivityTimer, { passive: true });
      }
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") resetInactivityTimer();
      });
      window.addEventListener("beforeunload", (event) => {
        if (!state.dirty) return;
        event.preventDefault();
        event.returnValue = "";
      });

      setFormEnabled(false);
      void resumeSession();

      function bindReadyAction(id, action) {
        $(id).addEventListener("click", action);
      }

      async function resumeSession() {
        setLoginLoading(true, "Vérification de l’accès…");
        try {
          const response = await fetch("/admin/session", {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin"
          });
          if (!response.ok) {
            showLoginScreen();
            return;
          }
          const body = await response.json().catch(() => ({}));
          if (!body.csrfToken) {
            showLoginScreen();
            return;
          }
          state.csrfToken = body.csrfToken;
          await refreshAll();
          showWorkspace();
        } catch {
          state.csrfToken = "";
          showLoginScreen();
        } finally {
          setLoginLoading(false);
        }
      }

      async function connect(event) {
        event.preventDefault();
        const username = $("adminUsername").value.trim();
        const password = $("adminPassword").value;
        const adminToken = $("adminToken").value.trim();
        const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value || "";
        if (!username || !password || !adminToken) return showLoginNotice("Le nom d’utilisateur, le mot de passe et la clé de sécurité sont obligatoires.", false);
        if (${turnstileEnabled ? "true" : "false"} && !turnstileToken) return showLoginNotice("Terminez d’abord la vérification de sécurité.", false);
        setLoginLoading(true);
        try {
          const response = await fetch("/admin/session", {
            method: "POST",
            cache: "no-store",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              password,
              adminToken,
              ...(turnstileToken ? { turnstileToken } : {})
            })
          });
          const body = await response.json().catch(() => ({}));
          if (!response.ok) {
            const error = new Error(body.error || "Échec de la connexion");
            error.status = response.status;
            throw error;
          }
          state.csrfToken = body.csrfToken;
          applyBootstrap(body.bootstrap || await adminFetch("/admin/bootstrap"));
          showWorkspace();
          $("adminUsername").value = "";
          $("adminPassword").value = "";
          $("adminToken").value = "";
          showLoginNotice("", true);
        } catch (error) {
          const message = error.status === 401 || error.status === 403 ? "Identifiants incorrects" : error.message || "Impossible d’accéder au tableau de bord";
          clearToken();
          showLoginNotice(message, false);
          window.turnstile?.reset?.();
        } finally {
          setLoginLoading(false);
        }
      }

      function showLoginScreen() {
        $("bootScreen").hidden = true;
        $("lockScreen").hidden = false;
        $("workspace").hidden = true;
      }

      function showWorkspace() {
        $("bootScreen").hidden = true;
        $("lockScreen").hidden = true;
        $("workspace").hidden = false;
        updateWorkspaceChrome();
      }

      function applyBootstrap(bootstrap) {
        if (!bootstrap) return;
        state.dashboard = bootstrap.dashboard;
        state.campaigns = bootstrap.campaigns || [];
        state.templates = bootstrap.templates || [];
        renderDashboard(state.dashboard);
        renderCampaigns();
        renderTemplateLibraries();
        renderMedia();
        if (state.mode === "create") {
          startNewCampaign(false, true);
        } else {
          selectCampaign(state.selectedId || state.campaigns[0]?.id || null, true);
        }
      }

      function clearToken() {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
        state.csrfToken = "";
        state.campaigns = [];
        state.media = [];
        state.templates = [];
        state.selectedId = null;
        state.selectedMediaId = null;
        state.dashboard = null;
        state.mediaLoaded = false;
        state.mode = "empty";
        state.dirty = false;
        state.saving = false;
        $("adminUsername").value = "";
        $("adminPassword").value = "";
        $("adminToken").value = "";
        clearForm();
        showLoginScreen();
        renderCampaigns();
        renderMedia();
        renderTemplateLibraries();
        updateFormStatus("Sélectionnez une campagne ou créez-en une.", "ok");
        updateSummaryPreview();
        setFormEnabled(false);
      }

      async function lockConsole() {
        if (!confirmDiscard("et verrouiller le tableau de bord")) return;
        await revokeSession();
        clearToken();
      }

      async function revokeSession() {
        const csrfToken = state.csrfToken;
        if (!csrfToken) return;
        await fetch("/admin/session", {
          method: "DELETE",
          cache: "no-store",
          credentials: "same-origin",
          headers: { [CSRF_HEADER]: csrfToken }
        }).catch(() => {});
      }

      async function refreshAll() {
        if (!state.csrfToken) throw new Error("La session d’administration n’est pas active");
        setWorkspaceLoading(true);
        try {
          applyBootstrap(await adminFetch("/admin/bootstrap"));
          showWorkspace();
        } catch (error) {
          if (error.status === 401 || error.status === 403) {
            clearToken();
            showLoginNotice("Votre session a expiré. Veuillez vous reconnecter.", false);
          }
          throw error;
        } finally {
          setWorkspaceLoading(false);
        }
      }

      async function refreshDashboardOnly() {
        state.dashboard = await adminFetch("/admin/dashboard");
        renderDashboard(state.dashboard);
      }

      async function guardedRefreshAll() {
        if (!confirmDiscard("et actualiser les données")) return;
        try {
          await refreshAll();
        } catch (error) {
          showNotice(error.message || "Impossible d’actualiser les données.", false);
        }
      }

      async function adminFetch(path, options = {}) {
        resetInactivityTimer();
        const response = await fetch(path, {
          ...options,
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            ...(options.headers || {}),
            [CSRF_HEADER]: state.csrfToken
          }
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          const error = new Error(formatApiError(body, response.status));
          error.status = response.status;
          error.body = body;
          error.details = body.details;
          throw error;
        }
        return body;
      }

      async function loadVariantTemplates() {
        try {
          const body = await adminFetch("/admin/variant-templates");
          state.templates = body.templates || [];
        } catch {
          state.templates = [];
        }
        return state.templates;
      }

      function renderDashboard(dashboard) {
        const counts = dashboard?.counts || {};
        $("campaignCount").textContent = counts.campaigns ?? "-";
        $("deliveryCount").textContent = counts.deliveries ?? "-";
        $("failedCount").textContent = counts.failedDeliveries ?? "-";
        $("retryingCount").textContent = counts.retryingDeliveries ?? "-";

        const token = dashboard?.token || {};
        const tokenSourceLabel = token.source === "stored"
          ? "enregistré"
          : token.source === "env"
            ? "variable d’environnement"
            : token.source || "-";
        $("tokenSource").textContent = tokenSourceLabel;
        $("tokenExpiry").textContent = formatDate(token.expiresAt);
        $("tokenError").textContent = token.lastError || "aucune";
        $("runtimeStatus").textContent = token.lastError ? "à vérifier" : "en ligne";
        $("runtimeStatus").className = "pill " + (token.lastError ? "warn" : "ok");
        $("sendLimit").textContent = (dashboard?.limits?.metaSendsPerMinute ?? "-") + "/min";
        $("pollLimit").textContent = String(dashboard?.limits?.pollLimitPerMedia ?? "-");
        $("readinessRuntime").textContent = token.lastError ? "vérifier le jeton" : "prêt";
        $("readinessLive").textContent = String(counts.enabledCampaigns ?? 0);
        $("readinessToken").textContent = tokenSourceLabel;
        $("readinessError").textContent = token.lastError || "aucune";
      }

      function renderCampaigns() {
        const list = $("campaignList");
        list.textContent = "";
        if (!state.campaigns.length) {
          const empty = document.createElement("div");
          empty.className = "empty";
          empty.textContent = "Aucune campagne. Cliquez sur Créer une campagne.";
          list.append(empty);
          return;
        }

        for (const campaign of state.campaigns) {
          const row = document.createElement("button");
          row.type = "button";
          row.className = "campaign-row" + (campaign.id === state.selectedId ? " active" : "");
          row.setAttribute("aria-pressed", campaign.id === state.selectedId ? "true" : "false");
          row.addEventListener("click", () => selectCampaign(campaign.id));

          const title = document.createElement("strong");
          title.textContent = campaign.name || campaign.id;

          const meta = document.createElement("small");
          meta.textContent = campaign.keyword ? "Déclencheur : " + campaign.keyword : "Déclencheur non renseigné";

          const status = document.createElement("span");
          status.className = "pill " + (campaign.enabled ? "ok" : "off");
          status.textContent = campaign.enabled ? "active" : "brouillon";

          row.append(title, meta, status);
          list.append(row);
        }
      }

      async function reloadMedia() {
        if (mediaLoading) return;
        mediaLoading = true;
        $("reloadMediaButton").disabled = true;
        try {
          const media = await adminFetch("/admin/media?limit=12");
          state.media = media.data || [];
          state.mediaLoaded = true;
          renderMedia();
        } catch (error) {
          renderMedia(error.message || "Impossible de charger les publications");
        } finally {
          mediaLoading = false;
          $("reloadMediaButton").disabled = false;
        }
      }

      async function ensureMediaLoaded() {
        if (state.mediaLoaded || mediaLoading) return;
        await reloadMedia();
      }

      function renderMedia(errorMessage = "") {
        const list = $("postList");
        list.textContent = "";
        showMediaNotice(errorMessage, false);

        if (!state.media.length) {
          const empty = document.createElement("div");
          empty.className = "empty";
          empty.textContent = errorMessage ? "Impossible de charger les publications. Collez leur ID dans les paramètres avancés." : "Aucune publication récente. Cliquez sur Actualiser ou collez son ID dans les paramètres avancés.";
          list.append(empty);
          return;
        }

        for (const media of state.media) {
          const row = document.createElement("div");
          row.className = "post-row" + (media.id === state.selectedMediaId ? " active" : "");

          const title = document.createElement("strong");
          title.textContent = media.caption ? truncate(media.caption, 92) : "Publication Instagram";

          const meta = document.createElement("small");
          meta.textContent = media.id;

          const details = document.createElement("div");
          details.className = "post-meta";
          const timestamp = document.createElement("span");
          timestamp.textContent = formatDate(media.timestamp);
          const type = document.createElement("span");
          type.textContent = formatMediaType(media.mediaType || media.mediaProductType);
          details.append(timestamp, type);

          const actions = document.createElement("div");
          actions.className = "post-actions";
          const useButton = document.createElement("button");
          useButton.type = "button";
          useButton.className = "secondary";
          useButton.textContent = media.id === state.selectedMediaId ? "Sélectionnée" : "Utiliser cette publication";
          useButton.setAttribute("aria-pressed", media.id === state.selectedMediaId ? "true" : "false");
          useButton.addEventListener("click", () => selectMedia(media));
          actions.append(useButton);
          const permalink = safeHttpsUrl(media.permalink);
          if (permalink) {
            const link = document.createElement("a");
            link.className = "post-link";
            link.href = permalink;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = "Voir sur Instagram";
            actions.append(link);
          }

          row.append(title, meta, details, actions);
          list.append(row);
        }
      }

      function selectMedia(media) {
        const shouldReplaceGenerated = state.mode === "create" && $("campaignId").dataset.generated !== "false";
        if (state.mode === "empty") {
          startNewCampaign(false, true, media);
          return;
        }
        state.selectedMediaId = media.id;
        $("mediaId").value = media.id;
        if (state.mode === "create" && (shouldReplaceGenerated || !$("name").value.trim())) $("name").value = postName(media);
        syncGeneratedFields(shouldReplaceGenerated);
        renderMedia();
        markDirty();
        updatePostPickerLabel();
      }

      function startNewCampaign(showMessage = true, force = false, presetMedia = null) {
        if (typeof showMessage !== "boolean") showMessage = true;
        if (!force && !confirmDiscard("et créer une campagne")) return;
        state.mode = "create";
        state.selectedId = null;
        const selectedMedia = presetMedia || null;
        state.selectedMediaId = selectedMedia?.id || null;
        renderCampaigns();
        renderMedia();
        clearForm();
        $("enabled").checked = false;
        $("followGateEnabled").checked = false;
        $("buttonTitle").value = "VOIR LE CONTENU";
        $("commentReplyText").value = "Regardez vos messages privés 😊";
        $("commentReplyTextVariants").value = "";
        $("openingTextVariants").value = "";
        renderDmSteps([]);
        $("campaignId").dataset.generated = "true";
        if (selectedMedia) {
          $("mediaId").value = selectedMedia.id;
          $("name").value = postName(selectedMedia);
        }
        syncGeneratedFields(true);
        updateSelectionPanel({
          id: "Nouvelle campagne",
          keyword: $("keyword").value,
          mediaId: $("mediaId").value,
          commentReplyText: $("commentReplyText").value,
          enabled: false
        });
        $("editorTitle").textContent = "Nouvelle campagne";
        $("modeNote").querySelector("strong").textContent = "Nouveau brouillon";
        $("modeNote").querySelector("span").textContent = "Choisissez une publication, définissez le déclencheur et le contenu, puis enregistrez le brouillon. L’activation se fait séparément.";
        $("postPickerPanel").open = !selectedMedia;
        $("campaignId").readOnly = false;
        setFormEnabled(true);
        updateWorkspaceChrome();
        state.dirty = false;
        updateFormStatus("Nouveau brouillon. Enregistrez-le avant d’activer la campagne.", "warn");
        updateSummaryPreview();
        updateActivationPanel();
        if (!selectedMedia) void ensureMediaLoaded();
        if (showMessage) showNotice("Le nouveau brouillon est prêt. Choisissez une publication et définissez le déclencheur.", true);
      }

      function selectCampaign(id, force = false) {
        if (!force && state.selectedId !== id && !confirmDiscard("et changer de campagne")) return;
        state.selectedId = id;
        state.mode = id ? "edit" : "empty";
        const campaign = state.campaigns.find((item) => item.id === id);
        renderCampaigns();
        if (!campaign) {
          $("selectedCampaignId").textContent = "Aucune campagne sélectionnée";
          $("selectedState").textContent = "aucune";
          $("selectedState").className = "pill off";
          $("selectedKeyword").textContent = "-";
          $("selectedMedia").textContent = "-";
          $("selectedReply").textContent = "-";
          $("editorTitle").textContent = "Éditeur de campagne";
          $("modeNote").querySelector("strong").textContent = "Sélectionnez une campagne";
          $("modeNote").querySelector("span").textContent = "Choisissez une campagne dans la liste ou créez-en une nouvelle.";
          $("postPickerPanel").open = false;
          clearForm();
          state.selectedMediaId = null;
          renderMedia();
          state.dirty = false;
          updateFormStatus("Sélectionnez une campagne ou créez-en une.", "ok");
          updateSummaryPreview();
          setFormEnabled(false);
          updateActivationPanel();
          updateWorkspaceChrome();
          return;
        }

        state.selectedMediaId = campaign.mediaId;
        $("campaignId").value = campaign.id;
        $("campaignId").readOnly = true;
        $("campaignId").dataset.generated = "false";
        for (const field of formFields) {
          const input = $(field);
          if (input.type === "checkbox") input.checked = Boolean(campaign[field]);
          else input.value = campaign[field] ?? "";
        }
        $("openingTextVariants").value = formatVariantTextarea(campaign.openingTextVariants, campaign.openingText);
        $("commentReplyTextVariants").value = formatVariantTextarea(campaign.commentReplyTextVariants, campaign.commentReplyText);
        renderDmSteps([]);
        $("editorTitle").textContent = "Modifier la campagne";
        $("modeNote").querySelector("strong").textContent = campaign.enabled ? "Campagne active" : "Campagne en brouillon";
        $("modeNote").querySelector("span").textContent = "Les modifications prennent effet après enregistrement. Ouvrez Publication surveillée pour changer de cible.";
        $("postPickerPanel").open = false;
        updateSelectionPanel(campaign);
        renderMedia();
        setFormEnabled(true);
        updateWorkspaceChrome();
        state.dirty = false;
        updateFormStatus(campaign.enabled ? "Campagne active. Les modifications prendront effet après enregistrement." : "Brouillon enregistré. Vérifiez son contenu avant de l’activer.", campaign.enabled ? "ok" : "warn");
        updateSummaryPreview();
        updateActivationPanel(campaign);
      }

      async function saveCampaign(event, forcedEnabled = null) {
        event?.preventDefault();
        if (state.saving) return;
        clearFieldErrors();
        const currentId = state.mode === "edit" ? state.selectedId : $("campaignId").value.trim();
        const campaignId = slugify(currentId);
        if (!campaignId) return showNotice("L’ID de la campagne est obligatoire.", false);
        $("campaignId").value = campaignId;
        syncPayloadFromCampaignId();
        if (!requireSelectedPost()) return;

        const payload = { id: campaignId };
        for (const field of formFields) {
          const input = $(field);
          payload[field] = input.type === "checkbox" ? input.checked : input.value.trim();
        }
        if (forcedEnabled !== null) payload.enabled = forcedEnabled;
        payload.openingTextVariants = collectVariantPool(payload.openingText, $("openingTextVariants").value);
        const dmStepRead = isDmStepUiEnabled() ? readDmSteps() : { steps: [], invalid: null };
        if (dmStepRead.invalid) {
          setFieldError("dmSteps", dmStepRead.invalid.message);
          updateFormStatus(dmStepRead.invalid.message, "bad");
          showNotice(dmStepRead.invalid.message, false);
          dmStepRead.invalid.node.focus();
          return;
        }
        payload.dmSteps = dmStepRead.steps;
        payload.commentReplyTextVariants = collectVariantPool(payload.commentReplyText, $("commentReplyTextVariants").value);
        if (!payload.commentReplyText && payload.commentReplyTextVariants.length) {
          payload.commentReplyText = payload.commentReplyTextVariants[0];
        }
        payload.commentReplyText = payload.commentReplyText || null;
        payload.openingFailureReplyText = payload.openingFailureReplyText || null;
        payload.followGateText = payload.followGateText || null;
        payload.followGateButtonTitle = payload.followGateButtonTitle || null;
        payload.buttonPayload = campaignId + ":confirm";
        payload.writeMode = state.mode === "create" ? "create" : "update";
        const currentCampaign = state.campaigns.find((item) => item.id === campaignId);
        if (forcedEnabled === null && currentCampaign?.enabled && !confirm("Cette campagne est active. Les modifications prendront effet dès leur enregistrement. Continuer ?")) return;

        state.saving = true;
        updateActionLock();
        setSaveState("enregistrement…", "warn");
        try {
          const saved = await adminFetch("/admin/campaigns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          showNotice("Campagne enregistrée", true);
          setSaveState("enregistré", "ok");
          state.dirty = false;
          updateFormStatus(payload.enabled ? "Campagne enregistrée et active." : "Brouillon enregistré. La campagne ne répondra aux commentaires qu’après son activation.", payload.enabled ? "ok" : "warn");
          upsertLocalCampaign(saved?.campaign || payload);
          await refreshDashboardOnly();
          selectCampaign(campaignId, true);
        } catch (error) {
          showFieldErrors(error.details);
          showNotice(error.message || "Impossible d’enregistrer la campagne.", false);
          setSaveState("erreur", "bad");
          updateFormStatus(error.message || "Impossible d’enregistrer la campagne.", "bad");
        } finally {
          state.saving = false;
          updateActionLock();
          setTimeout(() => setSaveState("prêt", "off"), 1600);
        }
      }

      async function goLiveCampaign() {
        if (state.mode === "empty") return;
        clearFieldErrors();
        if (!requireSelectedPost()) return;
        if (!$("campaignForm").reportValidity()) return;
        const summary = $("summaryPreview").querySelector("span").textContent;
        if (!confirm("Activer cette campagne ?\\n\\n" + summary + "\\n\\nDès son activation, les commentaires correspondant au déclencheur pourront être traités.")) return;
        await saveCampaign(null, true);
      }

      async function pauseCampaign() {
        if (state.mode !== "edit" || !state.selectedId || state.saving) return;
        if (state.dirty && !confirm("La mise en pause ne concerne que la version enregistrée. Les modifications non enregistrées seront perdues. Continuer ?")) return;
        if (!confirm("Mettre cette campagne en pause ? Les réponses automatiques reprendront uniquement après sa réactivation.")) return;
        state.saving = true;
        updateActionLock();
        try {
          setSaveState("mise en pause…", "warn");
          await adminFetch("/admin/campaigns/" + encodeURIComponent(state.selectedId), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: false })
          });
          showNotice("Campagne mise en pause.", true);
          state.dirty = false;
          const campaign = state.campaigns.find((item) => item.id === state.selectedId);
          if (campaign) campaign.enabled = false;
          renderCampaigns();
          updateActivationPanel(campaign || null);
          await refreshDashboardOnly();
          selectCampaign(state.selectedId, true);
        } catch (error) {
          showNotice(error.message || "Impossible de mettre la campagne en pause.", false);
          setSaveState("erreur", "bad");
        } finally {
          state.saving = false;
          updateActionLock();
        }
      }

      async function deleteCampaign() {
        if (state.mode !== "edit" || !state.selectedId || state.saving) return;
        const campaign = state.campaigns.find((item) => item.id === state.selectedId);
        const campaignId = state.selectedId;
        const campaignName = campaign?.name || campaignId;
        if (state.dirty && !confirm("Les modifications non enregistrées seront perdues avant la suppression. Continuer ?")) return;
        if (!confirm("Supprimer cette campagne ?\\n\\n" + campaignName + "\\n\\nSon historique et ses données de livraison seront également supprimés.")) return;
        const confirmation = prompt("Saisissez l’ID de la campagne pour confirmer sa suppression :\\n" + campaignId);
        if (confirmation !== campaignId) {
          showNotice("Suppression annulée : l’ID ne correspond pas.", false);
          return;
        }

        state.saving = true;
        updateActionLock();
        try {
          setSaveState("suppression…", "warn");
          await adminFetch("/admin/campaigns/" + encodeURIComponent(campaignId), { method: "DELETE" });
          state.campaigns = state.campaigns.filter((item) => item.id !== campaignId);
          state.selectedId = null;
          state.selectedMediaId = null;
          state.dirty = false;
          renderCampaigns();
          await refreshDashboardOnly();
          selectCampaign("", true);
          showNotice("Campagne supprimée.", true);
          setSaveState("prêt", "off");
        } catch (error) {
          showNotice(error.message || "Impossible de supprimer la campagne.", false);
          setSaveState("erreur", "bad");
        } finally {
          state.saving = false;
          updateActionLock();
        }
      }

      function updateActivationPanel(campaign = null) {
        if (campaign) {
          $("enabled").checked = Boolean(campaign.enabled);
        }
        const isLive = $("enabled").checked;
        const card = $("activationCard");
        card.className = "activation-card " + (isLive ? "live" : "draft");
        $("activationTitle").textContent = isLive ? "Campagne active" : "Campagne en brouillon";
        $("activationCopy").textContent = isLive
          ? "La campagne est active. Les modifications enregistrées seront appliquées aux prochains commentaires."
          : "La campagne ne fonctionne pas encore. Enregistrez le brouillon, vérifiez-le puis activez-le.";
        $("saveDraftButton").textContent = isLive ? "Enregistrer les modifications" : "Enregistrer le brouillon";
        $("goLiveButton").hidden = isLive || state.mode === "empty";
        $("pauseCampaignButton").hidden = !isLive || state.mode !== "edit";
        $("deleteCampaignButton").hidden = state.mode !== "edit";
        updateWorkspaceChrome();
      }

      function clearForm() {
        clearFieldErrors();
        for (const field of inputs) {
          const input = $(field);
          if (input.type === "checkbox") input.checked = false;
          else input.value = "";
        }
        renderDmSteps([]);
      }

      function upsertLocalCampaign(campaign) {
        if (!campaign?.id) return;
        state.campaigns = [
          campaign,
          ...state.campaigns.filter((item) => item.id !== campaign.id)
        ];
        renderCampaigns();
      }

      function requireSelectedPost() {
        if ($("mediaId").value.trim()) return true;
        const message = "Sélectionnez d’abord la publication à surveiller.";
        setFieldError("mediaId", message);
        $("postPickerPanel").open = true;
        updateFormStatus(message, "bad");
        showNotice(message, false);
        void ensureMediaLoaded();
        $("postPickerPanel").querySelector("summary")?.focus();
        return false;
      }

      function resetCurrentForm() {
        if (!confirmDiscard("et réinitialiser le formulaire")) return;
        if (state.mode === "create") {
          startNewCampaign(false, true);
        } else {
          selectCampaign(state.selectedId, true);
        }
      }

      function markDirty() {
        if (state.mode === "empty") return;
        state.dirty = true;
        updateFormStatus("Certaines modifications ne sont pas enregistrées.", "warn");
        scheduleSummaryPreview();
      }

      function scheduleSummaryPreview() {
        clearTimeout(summaryTimer);
        summaryTimer = setTimeout(updateSummaryPreview, 150);
      }

      function confirmDiscard(action) {
        if (!state.dirty) return true;
        return confirm("Certaines modifications ne sont pas enregistrées. Voulez-vous continuer " + action + " ?");
      }

      function updateSelectionPanel(campaign) {
        $("selectedCampaignId").textContent = campaign.name || campaign.id || "Nouvelle campagne";
        $("selectedState").textContent = campaign.enabled ? "active" : "brouillon";
        $("selectedState").className = "pill " + (campaign.enabled ? "ok" : "off");
        $("selectedKeyword").textContent = campaign.keyword || "-";
        $("selectedMedia").textContent = campaign.mediaId || "-";
        $("selectedReply").textContent = campaign.commentReplyText || "aucune";
        updatePostPickerLabel(campaign.mediaId);
      }

      function updateWorkspaceChrome() {
        $("quickGuide").hidden = state.mode === "edit";
        $("editorSubtitle").textContent = state.mode === "empty"
          ? "Sélectionnez une campagne ou créez-en une."
          : $("enabled").checked
            ? "Active : les modifications enregistrées s’appliqueront aux prochains commentaires."
            : "Brouillon : vous pouvez le modifier avant de l’activer.";
      }

      function updateFormStatus(message, tone) {
        const status = $("formStatus");
        status.textContent = message;
        status.className = "notice show " + tone;
      }

      function updateSummaryPreview() {
        if (state.mode === "empty") {
          $("summaryPreview").querySelector("span").textContent = "Aucune campagne sélectionnée.";
          updatePostPickerLabel();
          updateVisualPreview();
          return;
        }
        const parts = [];
        if ($("mediaId").value.trim()) parts.push("Publication " + $("mediaId").value.trim());
        if ($("keyword").value.trim()) parts.push("Déclencheur : " + $("keyword").value.trim());
        const openingCount = collectVariantPool($("openingText").value, $("openingTextVariants").value).length;
        const replyCount = collectVariantPool($("commentReplyText").value, $("commentReplyTextVariants").value).length;
        if (openingCount > 1) parts.push(openingCount + " variantes du premier message");
        if (replyCount > 1) parts.push(replyCount + " variantes de réponse publique");
        if ($("openingFailureReplyText").value.trim()) parts.push("Réponse en cas d’échec : activée");
        if ($("followGateEnabled").checked) parts.push("Abonnement requis : oui");
        parts.push($("enabled").checked ? "État : active" : "État : brouillon");
        $("summaryPreview").querySelector("span").textContent = parts.join(" / ");
        updatePostPickerLabel();
        updateVisualPreview();
      }

      function updatePostPickerLabel(mediaId = $("mediaId").value.trim()) {
        if (!mediaId) {
          $("selectedPostLabel").textContent = "Aucune publication sélectionnée";
          return;
        }
        const media = state.media.find((item) => item.id === mediaId);
        $("selectedPostLabel").textContent = media
          ? "Sélectionnée : " + formatDate(media.timestamp) + " - " + truncate(media.caption || "Publication Instagram", 58)
          : "Sélectionnée : " + mediaId;
      }

      function updateVisualPreview() {
        const keyword = $("keyword").value.trim();
        const opening = $("openingText").value.trim();
        const delivery = $("deliveryText").value.trim();
        const publicReplyPool = collectVariantPool($("commentReplyText").value, $("commentReplyTextVariants").value);
        const publicReply = publicReplyPool[0] || "";
        const buttonTitle = $("buttonTitle").value.trim() || "VOIR LE CONTENU";
        const dmSteps = isDmStepUiEnabled() ? readDmSteps({ allowPartial: true }).steps : [];
        const isLive = $("enabled").checked;

        setPreviewText("previewUserComment", keyword, "Déclencheur non renseigné.");
        setPreviewText("previewPublicReply", publicReply, "Facultatif. Aucun commentaire public ne sera publié si ce champ reste vide.");
        renderDmPreview(opening, buttonTitle, dmSteps, delivery, $("followGateEnabled").checked, $("followGateText").value.trim(), $("followGateButtonTitle").value.trim());
        updateReadinessChecklist();
        $("previewState").textContent = isLive ? "active" : "brouillon";
        $("previewState").className = "pill " + (isLive ? "ok" : "off");
      }

      function updateReadinessChecklist() {
        setReadyItem("readyPost", Boolean($("mediaId").value.trim()), "Prête", "Non sélectionnée");
        setReadyItem("readyKeyword", Boolean($("keyword").value.trim()), "Prêt", "Non renseigné");
        setReadyItem("readyOpening", Boolean($("openingText").value.trim() && $("buttonTitle").value.trim()), "Prêt", "Incomplet");
        setReadyItem("readyFollowGate", $("followGateEnabled").checked, "Activé", "Désactivé");
        setReadyItem("readyFinal", Boolean($("deliveryText").value.trim()), "Prêt", "Non renseigné");
        setReadyItem("readyReply", Boolean(collectVariantPool($("commentReplyText").value, $("commentReplyTextVariants").value).length), "Activée", "Désactivée");
        $("followGateCard").classList.toggle("active", $("followGateEnabled").checked);
      }

      function setReadyItem(id, ready, okLabel = "Prêt", missingLabel = "Incomplet") {
        const node = $(id);
        node.className = "readiness-item " + (ready ? "ok" : "missing");
        node.querySelector("span:last-child").textContent = ready ? okLabel : missingLabel;
      }

      function renderDmPreview(opening, buttonTitle, dmSteps, delivery, followGateEnabled, followGateText, followGateButtonTitle) {
        const thread = $("previewDmThread");
        thread.textContent = "";
        appendPreviewCard(thread, opening, buttonTitle, "previewOpening", "previewButtonTitle", false);
        appendPreviewTap(thread, buttonTitle, "previewTapBubble");
        dmSteps.forEach((step, index) => {
          appendPreviewCard(thread, step.text, step.buttonTitle, null, null, true);
          appendPreviewTap(thread, step.buttonTitle, null);
        });
        if (followGateEnabled) {
          const retryButtonTitle = followGateButtonTitle.trim() || buttonTitle;
          appendPreviewCard(thread, followGateInstruction(retryButtonTitle, followGateText), retryButtonTitle, null, null, true);
          appendPreviewTap(thread, retryButtonTitle, null);
        }
        const finalBubble = document.createElement("div");
        finalBubble.id = "previewDelivery";
        finalBubble.className = "dm-bubble brand" + (delivery ? "" : " preview-empty");
        finalBubble.textContent = delivery || "Contenu final non renseigné.";
        thread.append(finalBubble);
      }

      function followGateInstruction(buttonTitle, customText) {
        if (customText?.trim()) return customText.trim();
        const title = buttonTitle.trim() || "le bouton précédent";
        return "Abonnez-vous à ce compte, puis appuyez de nouveau sur « " + title + " ». Si le bouton n’apparaît pas, répondez PRÊT.";
      }

      function appendPreviewCard(thread, text, buttonTitle, textId, buttonId, isStep) {
        const card = document.createElement("div");
        card.className = "dm-card" + (isStep ? " step-card" : "");
        const copy = document.createElement("p");
        if (textId) copy.id = textId;
        copy.className = text ? "" : "preview-empty";
        copy.textContent = text || (isStep ? "Message de l’étape non renseigné." : "Premier message non renseigné.");
        const button = document.createElement("div");
        if (buttonId) button.id = buttonId;
        button.className = "dm-button-preview";
        button.classList.toggle("preview-empty", !buttonTitle);
        button.textContent = buttonTitle || (isStep ? "Bouton de l’étape non renseigné." : "Bouton non renseigné.");
        card.append(copy, button);
        thread.append(card);
      }

      function appendPreviewTap(thread, buttonTitle, id) {
        const bubble = document.createElement("div");
        if (id) bubble.id = id;
        bubble.className = "dm-bubble user";
        bubble.classList.toggle("preview-empty", !buttonTitle);
        bubble.textContent = buttonTitle || "Appuyer sur le bouton";
        thread.append(bubble);
      }

      function setPreviewText(id, value, fallback) {
        const node = $(id);
        node.textContent = value || fallback;
        node.classList.toggle("preview-empty", !value);
      }

      function syncGeneratedFields(force = false) {
        if (state.mode !== "create") return;
        const base = $("name").value.trim() || $("keyword").value.trim() || "campaign";
        const nextId = slugify(base);
        if (force || $("campaignId").dataset.generated !== "false") {
          $("campaignId").value = nextId;
          $("campaignId").dataset.generated = "true";
        }
        syncPayloadFromCampaignId();
      }

      function syncPayloadFromCampaignId() {
        const id = slugify($("campaignId").value.trim());
        if (!id) return;
        $("campaignId").value = id;
        $("buttonPayload").value = id + ":confirm";
      }

      function postName(media) {
        const caption = media.caption ? truncate(media.caption.replace(/\\s+/g, " "), 44) : "Publication Instagram";
        return caption === "Publication Instagram" ? "Nouvelle campagne Instagram" : caption;
      }

      function slugify(value) {
        return value
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[\\u0300-\\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 64);
      }

      function truncate(value, max) {
        if (!value) return "";
        return value.length > max ? value.slice(0, max - 1).trimEnd() + "…" : value;
      }

      function collectVariantPool(primaryText, rawVariants) {
        const seen = new Set();
        const values = [primaryText, ...rawVariants.split(/\\r?\\n/)];
        const variants = [];
        for (const value of values) {
          const trimmed = value.trim();
          if (!trimmed || seen.has(trimmed)) continue;
          seen.add(trimmed);
          variants.push(trimmed);
        }
        return variants;
      }

      function addDmStep(step = { text: "", textVariants: [], buttonTitle: "CONTINUER" }) {
        const current = readDmSteps({ allowPartial: true }).steps;
        if (current.length >= MAX_DM_STEPS) {
          showNotice("Vous pouvez ajouter au maximum 3 étapes.", false);
          return;
        }
        renderDmSteps([...current, step]);
        const rows = $("dmStepsList").querySelectorAll(".dm-step-row");
        rows[rows.length - 1]?.querySelector("textarea")?.focus();
      }

      function renderDmSteps(steps = []) {
        const list = $("dmStepsList");
        list.textContent = "";
        const safeSteps = steps.slice(0, MAX_DM_STEPS);
        safeSteps.forEach((step, index) => {
          const row = document.createElement("div");
          row.className = "dm-step-row";
          row.dataset.index = String(index);

          const head = document.createElement("div");
          head.className = "dm-step-row-head";
          const title = document.createElement("strong");
          title.textContent = "Message privé " + (index + 2);
          const remove = document.createElement("button");
          remove.type = "button";
          remove.textContent = "Supprimer";
          remove.setAttribute("aria-label", "Supprimer l’étape de message privé " + (index + 2));
          remove.addEventListener("click", () => {
            row.remove();
            renderDmSteps(readDmSteps({ allowPartial: true }).steps);
            markDirty();
          });
          head.append(title, remove);

          const grid = document.createElement("div");
          grid.className = "dm-step-grid";
          const textLabel = document.createElement("label");
          textLabel.textContent = "Message de l’étape";
          const textArea = document.createElement("textarea");
          textArea.className = "dm-step-text";
          textArea.maxLength = 640;
          textArea.placeholder = "Avant de vous envoyer le contenu, choisissez cette option.";
          textArea.value = step.text || "";
          textLabel.append(textArea, helpNode("Message principal de cette étape."));

          const buttonLabel = document.createElement("label");
          buttonLabel.textContent = "Bouton de l’étape";
          const buttonInput = document.createElement("input");
          buttonInput.className = "dm-step-button";
          buttonInput.maxLength = 20;
          buttonInput.placeholder = "CONTINUER";
          buttonInput.value = step.buttonTitle || "";
          buttonLabel.append(buttonInput, helpNode("20 caractères maximum."));

          const variantsLabel = document.createElement("label");
          variantsLabel.className = "dm-step-variants";
          variantsLabel.textContent = "Variantes du message";
          const variantsArea = document.createElement("textarea");
          variantsArea.className = "dm-step-variants-input";
          variantsArea.maxLength = 4096;
          variantsArea.placeholder = "Première variante de cette étape\\nDeuxième variante de cette étape";
          variantsArea.value = formatVariantTextarea(step.textVariants || [], step.text || "");
          variantsLabel.append(variantsArea, helpNode("Facultatif. Une variante par ligne. Le message principal reste inclus."));

          for (const input of [textArea, buttonInput, variantsArea]) {
            input.disabled = state.mode === "empty";
            input.addEventListener("input", markDirty);
          }

          grid.append(textLabel, buttonLabel, variantsLabel);
          row.append(head, grid);
          list.append(row);
        });
        updateDmStepSummary(safeSteps.length);
        $("addDmStepButton").disabled = state.mode === "empty" || safeSteps.length >= MAX_DM_STEPS;
      }

      function readDmSteps(options = {}) {
        const allowPartial = Boolean(options.allowPartial);
        const steps = [];
        const rows = Array.from($("dmStepsList").querySelectorAll(".dm-step-row"));
        for (const row of rows) {
          const textNode = row.querySelector(".dm-step-text");
          const buttonNode = row.querySelector(".dm-step-button");
          const variantsNode = row.querySelector(".dm-step-variants-input");
          const text = textNode.value.trim();
          const buttonTitle = buttonNode.value.trim();
          const rawVariants = variantsNode?.value || "";
          if (!text && !buttonTitle && !rawVariants.trim()) continue;
          if (!allowPartial && (!text || !buttonTitle)) {
            return {
              steps,
              invalid: {
                node: text ? buttonNode : textNode,
                message: "Chaque étape doit contenir un message et un bouton. Supprimez l’étape si elle n’est pas utilisée."
              }
            };
          }
          steps.push({
            text,
            textVariants: text ? collectVariantPool(text, rawVariants) : [],
            buttonTitle
          });
        }
        return { steps, invalid: null };
      }

      function updateDmStepSummary(count = readDmSteps({ allowPartial: true }).steps.length) {
        $("dmStepSummary").textContent = count
          ? count + " étape(s) supplémentaire(s) avant le contenu final."
          : "Sans étape supplémentaire, le premier bouton envoie directement le contenu final.";
      }

      function isDmStepUiEnabled() {
        return !$("dmStepPanel").hidden;
      }

      function helpNode(text) {
        const span = document.createElement("span");
        span.className = "help";
        span.textContent = text;
        return span;
      }

      function formatVariantTextarea(variants = [], primaryText = "") {
        return variants.filter((value) => value && value !== primaryText).join("\\n");
      }

      function setFormEnabled(enabled) {
        for (const field of inputs) $(field).disabled = !enabled;
        updateActionLock(enabled);
        $("saveOpeningTemplatesButton").disabled = !enabled;
        $("saveCommentReplyTemplatesButton").disabled = !enabled;
        renderDmSteps(isDmStepUiEnabled() ? readDmSteps({ allowPartial: true }).steps : []);
      }

      function updateActionLock(formEnabled = state.mode !== "empty") {
        const disabled = !formEnabled || state.saving;
        $("saveCampaignButton").disabled = disabled;
        $("saveDraftButton").disabled = disabled;
        $("goLiveButton").disabled = disabled;
        $("pauseCampaignButton").disabled = disabled;
        $("deleteCampaignButton").disabled = disabled || state.mode !== "edit";
        $("saveCampaignButtonTop").disabled = disabled;
        $("reloadCampaignButton").disabled = !formEnabled || state.saving;
        $("reloadCampaignButtonBottom").disabled = !formEnabled || state.saving;
      }

      function setLoginLoading(loading, label = "Vérification de l’accès…") {
        $("connectButton").disabled = loading;
        $("connectButton").textContent = loading ? label : "Se connecter";
      }

      function setWorkspaceLoading(loading) {
        $("refreshButton").disabled = loading;
        $("connectionState").textContent = loading ? "Chargement…" : "Connecté";
      }

      function showLoginNotice(message, ok) {
        const notice = $("loginNotice");
        notice.textContent = message;
        notice.className = message ? "notice show " + (ok ? "ok" : "bad") : "notice";
      }

      function showNotice(message, ok) {
        const notice = $("notice");
        notice.textContent = message;
        notice.className = "notice show " + (ok ? "ok" : "bad");
        clearTimeout(showNotice.timer);
        if (ok) showNotice.timer = setTimeout(() => notice.className = "notice", 2400);
      }

      function showMediaNotice(message, ok) {
        const notice = $("mediaNotice");
        notice.textContent = message;
        notice.className = message ? "notice show " + (ok ? "ok" : "bad") : "notice";
      }

      function handleInvalidField(event) {
        const field = event.target;
        if (!field?.id) return;
        const message = field.validationMessage || "Vérifiez ce champ.";
        revealField(field.id);
        setFieldError(field.id, message);
        showNotice(message, false);
        updateFormStatus(message, "bad");
      }

      function formatApiError(body, status) {
        const fieldErrors = body?.details?.fieldErrors || {};
        const firstField = Object.keys(fieldErrors).find((key) => fieldErrors[key]?.length);
        if (firstField) {
          return labelForField(normalizeErrorField(firstField)) + ": " + fieldErrors[firstField][0];
        }
        if (status === 409) return "Cet ID de campagne est déjà utilisé. Choisissez un autre nom ou modifiez la campagne existante.";
        if (status === 404) return body?.error || "Données introuvables.";
        return body?.error || "Échec de la requête (" + status + ")";
      }

      function clearFieldErrors() {
        for (const node of document.querySelectorAll(".field-error")) {
          node.textContent = "";
          node.className = "field-error";
        }
        for (const node of document.querySelectorAll("[aria-invalid='true']")) {
          node.removeAttribute("aria-invalid");
          node.removeAttribute("aria-describedby");
        }
      }

      function showFieldErrors(details) {
        const fieldErrors = details?.fieldErrors || {};
        let firstField = "";
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (!messages?.length) continue;
          const uiField = normalizeErrorField(field);
          setFieldError(uiField, messages[0]);
          if (!firstField) firstField = uiField;
        }
        if (firstField === "dmSteps") {
          $("dmStepPanel").open = true;
          $("addDmStepButton").focus();
          return;
        }
        if (firstField && $(firstField)) {
          revealField(firstField);
          $(firstField).focus();
        }
      }

      function revealField(fieldId) {
        if (fieldId === "mediaId") {
          $("postPickerPanel").open = true;
          void ensureMediaLoaded();
        }
        if (["campaignId", "mediaId", "buttonPayload"].includes(fieldId)) {
          document.querySelector(".advanced-panel").open = true;
        }
        const field = $(fieldId);
        const details = field?.closest?.("details");
        if (details) details.open = true;
      }

      function setFieldError(field, message) {
        const ids = field === "mediaId"
          ? ["mediaIdError", "mediaIdAdvancedError"]
          : field === "dmSteps"
            ? ["dmStepsError"]
            : [field + "Error"];
        const input = field === "dmSteps" ? $("dmStepPanel") : $(field);
        if (input) {
          input.setAttribute("aria-invalid", "true");
          input.setAttribute("aria-describedby", ids.join(" "));
        }
        for (const id of ids) {
          const node = $(id);
          if (!node) continue;
          node.textContent = message;
          node.className = "field-error show";
        }
      }

      function normalizeErrorField(field) {
        if (field === "id") return "campaignId";
        if (field === "texts") return "openingTextVariants";
        if (field === "dmSteps") return "dmSteps";
        return field;
      }

      function labelForField(field) {
        const labels = {
          id: "ID de la campagne",
          campaignId: "ID de la campagne",
          mediaId: "ID de la publication",
          name: "Nom de la campagne",
          keyword: "Mot ou expression déclencheur",
          openingText: "Premier message privé",
          openingTextVariants: "Variantes du premier message",
          dmSteps: "Étapes supplémentaires",
          deliveryText: "Contenu ou lien final",
          commentReplyText: "Réponse publique",
          openingFailureReplyText: "Réponse en cas d’échec du message privé",
          commentReplyTextVariants: "Variantes de réponse publique",
          followGateEnabled: "Abonnement requis",
          followGateText: "Message de demande d’abonnement",
          followGateButtonTitle: "Bouton après abonnement",
          buttonTitle: "Bouton",
          buttonPayload: "Code du bouton"
        };
        return labels[field] || field;
      }

      function renderTemplateLibraries() {
        renderTemplateLibrary("opening", "openingTemplateSearch", "openingTemplateList", "openingTextVariants", "openingText");
        renderTemplateLibrary("comment_reply", "commentReplyTemplateSearch", "commentReplyTemplateList", "commentReplyTextVariants", "commentReplyText");
      }

      function renderTemplateLibrary(kind, searchId, listId, textareaId, primaryId) {
        const list = $(listId);
        const query = $(searchId).value.trim().toLowerCase();
        const current = new Set(collectVariantPool($(primaryId).value, $(textareaId).value));
        const templates = state.templates
          .filter((template) => template.kind === kind)
          .filter((template) => !query || template.text.toLowerCase().includes(query))
          .slice(0, 30);
        list.textContent = "";
        if (!templates.length) {
          const empty = document.createElement("div");
          empty.className = "empty";
          empty.textContent = query ? "Aucun modèle ne correspond à votre recherche." : "Aucun modèle enregistré.";
          list.append(empty);
          return;
        }

        for (const template of templates) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "template-chip" + (current.has(template.text) ? " active" : "");
          button.textContent = truncate(template.text, 72);
          button.title = template.text;
          button.addEventListener("click", () => {
            const latest = new Set(collectVariantPool($(primaryId).value, $(textareaId).value));
            if (latest.has(template.text)) {
              showNotice("Ce modèle est déjà utilisé dans la campagne.", true);
              return;
            }
            appendVariantLine(textareaId, template.text);
            renderTemplateLibraries();
            markDirty();
          });
          list.append(button);
        }
      }

      async function saveTemplatesFromForm(kind) {
        const textareaId = kind === "opening" ? "openingTextVariants" : "commentReplyTextVariants";
        const primaryId = kind === "opening" ? "openingText" : "commentReplyText";
        const button = kind === "opening" ? $("saveOpeningTemplatesButton") : $("saveCommentReplyTemplatesButton");
        const variants = collectVariantPool($(primaryId).value, $(textareaId).value);
        if (!variants.length) return showNotice("Aucune variante à enregistrer.", false);
        if (!confirm("Ajouter " + variants.length + " modèle(s) à la bibliothèque ?\\n\\nCette action n’enregistre pas les modifications de la campagne.")) return;
        button.disabled = true;
        try {
          await adminFetch("/admin/variant-templates/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind, texts: variants })
          });
          await loadVariantTemplates();
          renderTemplateLibraries();
          showNotice("Bibliothèque mise à jour. Enregistrez aussi la campagne si vous l’avez modifiée.", true);
        } catch (error) {
          const textErrors = error.details?.fieldErrors?.texts;
          if (textErrors?.length) {
            const message = kind === "comment_reply"
              ? "Une réponse publique de la bibliothèque dépasse 300 caractères. Vérifiez les lignes trop longues."
              : textErrors[0];
            setFieldError(textareaId, message);
            $(textareaId).focus();
          }
          showNotice(error.message || "Impossible d’enregistrer les modèles.", false);
        } finally {
          button.disabled = false;
        }
      }

      function appendVariantLine(textareaId, text) {
        const textarea = $(textareaId);
        const variants = collectVariantPool("", textarea.value);
        if (variants.includes(text)) return;
        textarea.value = [...variants, text].join("\\n");
      }

      function setSaveState(text, tone) {
        $("saveState").textContent = text;
        $("saveState").className = "pill " + tone;
      }

      function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        if (!state.csrfToken) return;
        inactivityTimer = setTimeout(async () => {
          await revokeSession();
          clearToken();
          showLoginNotice("Le tableau de bord a été verrouillé après une période d’inactivité.", false);
        }, INACTIVITY_TIMEOUT_MS);
      }

      function formatDate(value) {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleString();
      }

      function formatMediaType(value) {
        const labels = {
          IMAGE: "Image",
          VIDEO: "Vidéo",
          REELS: "Reel",
          CAROUSEL_ALBUM: "Carrousel"
        };
        return labels[value] || value || "Média";
      }

      // Upstream values are only ever rendered as link targets when they are https URLs.
      function safeHttpsUrl(value) {
        if (typeof value !== "string" || !value) return "";
        try {
          return new URL(value).protocol === "https:" ? value : "";
        } catch {
          return "";
        }
      }
    </script>
  </body>
</html>`;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
