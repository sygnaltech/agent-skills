**Clipboard Workarounds (Designer Extension in iframe)**

- Context: The Webflow Designer embeds extensions in a cross‑origin iframe. Chromium blocks `navigator.clipboard.*` inside such iframes unless the host grants permission via Permissions Policy (`allow` on the iframe and/or `Permissions-Policy` header). As extension authors, we can’t change host policy, so we implement graceful, user‑gesture‑based fallbacks.

**Copy (JSON → clipboard)**

- Primary: `navigator.clipboard.writeText(text)` on button click.
- Fallback 1: Hidden `<textarea>` + `document.execCommand('copy')` (still works in many iframes because it doesn’t use the Clipboard API; requires a user gesture).
- Fallback 2: Manual Copy dialog
  - Show the JSON in a textarea, pre‑selected or easily selectable; user presses Ctrl/Cmd+C.
- Optional alternative: “Download JSON” → save `.json` file to disk (avoids clipboard entirely).

Diagnostics (in the iframe’s console)

- Policy status: `(document.permissionsPolicy||document.featurePolicy)?.allowsFeature?.('clipboard-write')`
- Secure context: `window.isSecureContext` (localhost counts as secure in Chromium)
- If the policy blocks it, `writeText` throws and we use the fallbacks above.

**Paste (clipboard → JSON)**

- Clipboard API read is typically blocked: `navigator.clipboard.readText()` fails under Permissions Policy.
- Recommended UX: explicit Paste dialog
  - User opens dialog, pastes JSON into a textarea, then clicks Import.
  - No reliance on `readText`; preserves clear, deliberate user gesture.
- Optional alternative: “Upload JSON” file input in the same dialog.
- Note: `document.execCommand('paste')` is not permitted on web pages for security; extensions cannot rely on it here.

**Host‑side enablement (informational)**

- iframe attribute: `<iframe ... allow="clipboard-read; clipboard-write">`
- Response header (top‑level document):
  - `Permissions-Policy: clipboard-read=(self "http://localhost:1337"), clipboard-write=(self "http://localhost:1337")`
- With these in place, `navigator.clipboard.*` will work in the embedded extension (still requires a user gesture).

**Troubleshooting**

- Console message: “Permissions policy violation: The Clipboard API has been blocked …” → host page hasn’t granted clipboard permissions to the iframe origin.
- Copy still works via execCommand fallback; Paste requires the manual dialog (or file upload).
- If even execCommand fails (rare), use the manual dialog or “Download/Upload JSON” flow.

