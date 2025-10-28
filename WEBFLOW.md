

To extract Webflow docs, we want to first get a list of the URLs, however as a React(?) app it doesn't have a clean ToC in HTML that we can parse. 
Or act least I've been able to find one.

However-

The docs pages to emit a console debug() message like this whenever a visual ToC link is clicked. 

```
scrolling to route: /designer/reference/designer-api/getting-started
scrolling to route: /designer/reference/webflow-cli
scrolling to route: /designer/reference/error-handling
scrolling to route: /designer/reference/app-modes
scrolling to route: /designer/reference/creating-retrieving-elements
```

This means we can walk the tree, click on each item to generate the full list of messages. 

# Process

Open the docs in question 
Open browser devtools console 
Paste this function in to capture logging- 

```
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

Initiate logging with

```
startCapture('scrolling to')
```

This will begin capturing any log messages that match the text, to an array.
You MAY need to enable Verbose logging in the console's settings to ensure that the messages are actually emitted 

Start clicking on the left-nav links you need to capture. 


At any point, you can use 

```
showCaptured();                // view
copyCaptured();                // copy to clipboard 
stopCapture();                 // stop  
```

Then, integrate these with our docs-specific ToC. 

The Markdown page URL for any given log; 


```
scrolling to route: /designer/reference/designer-api/getting-started
```

would be; 


```
https://developers.webflow.com/designer/reference/designer-api/getting-started.md
```
