# Webflow Documentation Generator

This tool downloads Webflow documentation from developers.webflow.com for use in Claude Code skills.

## How It Works

Each generator reads URLs from a companion `.txt` file that explicitly lists which documentation pages to download. This approach gives you full control over which documentation files are included.

## URL List Files

Each generator has a companion `.txt` file in the `src/generators/` directory:

- `webflow-cloud.txt` - URLs for Webflow Cloud documentation
- `webflow-code-components.txt` - URLs for Webflow Code Components documentation
- `webflow-data-api.txt` - URLs for Webflow Data API documentation

### Format

Each `.txt` file should contain:
- One URL path per line
- Paths must start with `/` (e.g., `/webflow-cloud/intro.md`)
- Lines starting with `#` are treated as comments
- Empty lines are ignored
- `.md` extension is automatically added if missing

Example:
```
# Webflow Cloud Documentation URLs
# One URL per line. Lines starting with # are ignored.

/webflow-cloud/intro.md
/webflow-cloud/docs/getting-started.md
/webflow-cloud/docs/authentication.md
```

## Usage

Run a generator using the CLI:

```bash
npm run generate webflow-cloud
npm run generate webflow-code-components
npm run generate webflow-data-api
```

Or programmatically:

```javascript
const { generate } = require('@sygnal/webflow-agent-skills');

await generate('webflow-cloud');
```

## How to Find Documentation URLs

The Webflow developer documentation is published in a React SPA without a clean HTML table of contents. Here are two approaches to find URLs:

### Approach 1: Manual URL Collection

Browse the documentation and copy URLs manually into the `.txt` file. You can convert browser URLs to markdown URLs by adding `.md` to the end:

```
Browser URL: https://developers.webflow.com/designer/reference/getting-started
Markdown URL: /designer/reference/getting-started.md
```

### Approach 2: Capture Navigation Events

The docs pages emit a console debug message whenever a visual ToC link is clicked:

```
scrolling to route: /designer/reference/designer-api/getting-started
scrolling to route: /designer/reference/webflow-cli
scrolling to route: /designer/reference/error-handling
```

You can capture these by:

1. Open the docs page you want to capture
2. Open browser devtools console
3. Paste this function to capture logging:

```javascript
(() => {
  const METHODS = ["log","warn","error","info","debug"];
  const S = (window.__cap ||= { buf: [], orig: {}, pat: "", on: false });

  const toText = (a)=>Array.from(a).map(v=>{
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.stack || v.message;
    try { return JSON.stringify(v); } catch { return String(v); }
  }).join(" ");

  window.startCapture = (substr) => {
    S.pat = String(substr).toLowerCase();
    if (S.on) return; S.on = true;
    METHODS.forEach(m => {
      if (S.orig[m]) return;
      const orig = console[m].bind(console);
      S.orig[m] = orig;
      console[m] = (...args) => {
        const msg = toText(args);
        if (msg.toLowerCase().includes(S.pat)) S.buf.push(msg);
        orig(...args);
      };
    });
  };
  window.stopCapture = () => { METHODS.forEach(m => S.orig[m] && (console[m]=S.orig[m])); S.orig={}; S.on=false; };
  window.showCaptured = () => S.buf.slice();
  window.clearCaptured = () => (S.buf.length = 0);
  window.copyCaptured = () => {
    const t = S.buf.join("\n");
    if (typeof copy === "function") copy(t);
    else if (navigator.clipboard?.writeText) navigator.clipboard.writeText(t);
    else { const ta=document.createElement("textarea"); ta.value=t; ta.style="position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
  };
})();
```

4. Start capturing:

```javascript
startCapture('scrolling to')
```

Note: You may need to enable Verbose logging in the console's settings to ensure messages are emitted.

5. Click on the left-nav links you need to capture

6. View, copy, or stop:

```javascript
showCaptured();    // view captured messages
copyCaptured();    // copy to clipboard
stopCapture();     // stop capturing
```

7. Extract the routes from the captured messages and convert them to markdown URLs:

```
scrolling to route: /designer/reference/designer-api/getting-started
```

Becomes:

```
/designer/reference/designer-api/getting-started.md
```

8. Add these URLs to the appropriate `.txt` file in `src/generators/`

## Architecture

### Shared Utilities

Common functionality is centralized in [src/generator.js](src/generator.js):

- `fetchUrl(url)` - Fetch content with redirect following
- `readUrlList(urlListFile)` - Read and parse `.txt` files
- `ensureDir(dirPath)` - Create directories as needed
- `downloadMarkdownFile(urlPath, baseUrl, outputDir, pathTransform)` - Download and save files
- `printSummary(results)` - Display download statistics

### Generator Structure

Each generator in `src/generators/`:
1. Imports shared utilities from [src/generator.js](src/generator.js)
2. Defines constants for base URL and companion `.txt` file
3. Implements a `pathToFilePath()` function to strip URL prefixes
4. Exports a `generate()` function that orchestrates the download process

### Output

Downloaded files are saved to:
```
.claude/skills/<generator-name>/references/
```

Example:
- `webflow-cloud` → `.claude/skills/webflow-cloud/references/`
- `webflow-code-components` → `.claude/skills/webflow-code-components/references/`
- `webflow-data-api` → `.claude/skills/webflow-data-api/references/`
