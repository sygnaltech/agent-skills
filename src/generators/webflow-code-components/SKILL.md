---
name: webflow-code-components
description: Documentation for Webflow Code Components via DevLink. Use this skill when users ask about creating React components for Webflow, DevLink integration, component props, slots, styling Shadow DOM components, bundling, or importing custom components into Webflow Designer.
resources:
  - references/**/*.md
  - solutions/**/*.md
---

# Webflow Code Components Documentation

This skill provides comprehensive documentation for building and deploying React code components to Webflow via DevLink. Learn how to create interactive, reusable components in your codebase and use them directly in the Webflow Designer.


## Core Concepts

### Architecture Overview

Code components run as **isolated React applications** in Shadow DOM:

- Each component instance has its own React root
- Shadow DOM creates style and DOM boundaries
- Components cannot share state through React Context
- SSR is enabled by default but can be disabled

**Key constraint:** React Context, Redux, Zustand, and similar state management libraries do NOT work across separate component instances. Use alternative communication patterns instead.

### Project Structure

```
project/
├── .env                          # Workspace API token (gitignored)
├── webflow.json                  # CLI configuration
├── webpack.webflow.js            # Optional webpack overrides
└── src/
    └── components/
        └── ComponentName/
            ├── ComponentName.tsx          # React component
            ├── ComponentName.module.css   # Styles
            └── ComponentName.webflow.tsx  # Webflow declaration
```

## Setup Workflow

### Initial Setup

1. **Install dependencies:**
   ```bash
   npm i --save-dev @webflow/webflow-cli @webflow/react @webflow/data-types
   ```

2. **Create `webflow.json`:**
   ```json
   {
     "library": {
       "name": "Component Library Name",
       "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"]
     }
   }
   ```

3. **Authenticate:**
   - Run `npx webflow library share` for interactive auth, OR
   - Get workspace token from Webflow → Apps & Integrations → Workspace API Access
   - Add to `.env`: `WEBFLOW_WORKSPACE_API_TOKEN=your_token`

### Component Creation Workflow

1. **Create React component** (`ComponentName.tsx`)
2. **Add styles** (`ComponentName.module.css`)
3. **Create Webflow declaration** (`ComponentName.webflow.tsx`)
4. **Import to Webflow:** `npx webflow library share`

## Component Declaration

Always use `declareComponent` in `.webflow.tsx` files:

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Component } from './Component';
import './Component.module.css';  // ← Import styles HERE

export default declareComponent(Component, {
  name: 'Component Name',
  description: 'Brief description',
  group: 'Category',  // Optional: 'Interactive', 'Content', 'Layout', etc.
  
  props: {
    propName: props.Text({
      name: 'Display Name',
      defaultValue: 'default value',
      group: 'Prop Group',      // Optional
      tooltip: 'Help text'       // Optional
    }),
  },
  
  options: {
    applyTagSelectors: false,  // Default: false
    ssr: true,                 // Default: true
  },
});
```

**Critical:** Always import styles in `.webflow.tsx`, not just in `.tsx`.

## Prop Types Reference

Quick reference for available prop types:

| Type | Returns | Use For |
|------|---------|---------|
| `props.Text()` | `string` | Single-line text |
| `props.RichText()` | `string` | Multi-line text |
| `props.TextNode()` | `string` | Canvas-editable text |
| `props.Link()` | `{ href, target, preload }` | URLs (requires wrapper) |
| `props.Image()` | `string` | Image URLs |
| `props.Number()` | `number` | Numeric values |
| `props.Boolean()` | `boolean` | Toggles |
| `props.Variant()` | `string` | Dropdown options |
| `props.Visibility()` | `boolean` | Show/hide controls |
| `props.Slot()` | `ReactNode` | Flexible content areas |
| `props.Color()` | `string` | Color picker ⚠️ **NOT YET AVAILABLE** |
| `props.ID()` | `string` | HTML element IDs ⚠️ **NOT YET AVAILABLE** |

**For detailed configuration options for each prop type, refer to `references/prop-types.md`.**

**Note:** Some prop types are documented but not yet available in the current Webflow release. Do not use prop types marked as "NOT YET AVAILABLE".

## Wrapper Components for Link Props

`props.Link()` returns an object, but React components often expect separate props. Use wrapper components:

```tsx
// Component.webflow.tsx
import { props, PropType, PropValues } from "@webflow/data-types";
import { Component, ComponentProps } from "./Component";

type WebflowProps = {
  link: PropValues[PropType.Link];
} & Omit<ComponentProps, "href" | "target">;

const WebflowComponent = ({ link: { href, target }, ...rest }: WebflowProps) => {
  return <Component href={href} target={target} {...rest} />;
};

export default declareComponent(WebflowComponent, {
  // ... configuration
});
```

**For complete wrapper patterns and other complex transformations, refer to `references/wrapper-components.md`.**

## Styling in Shadow DOM

### Key Principles

- **Import in `.webflow.tsx`** - Styles must be imported in declaration file
- **Use CSS Modules** - Prevent global conflicts
- **Use site variables** - Connect to Webflow's design system: `var(--variable-name, fallback)`
- **Always provide fallbacks** - `var(--colors-primary, #007bff)`
- **Site classes don't work** - Shadow DOM isolation prevents access
- **Use inheritance** - `font-family: inherit` works across Shadow boundary

### Site Variables

Get variable names from Webflow Designer:
1. Variables panel → Three dots → Copy CSS
2. Use in styles: `background-color: var(--colors-primary, #007bff);`

### Tag Selectors

Enable site-wide tag styles (h1, p, etc.) with:

```tsx
declareComponent(Article, {
  options: {
    applyTagSelectors: true,
  },
});
```

**For comprehensive styling strategies, Shadow DOM workarounds, and CSS-in-JS configuration, refer to `references/styling.md`.**

## Component Communication

Since React Context doesn't work across component instances, use these patterns:

| Method | Best For | Persistence |
|--------|----------|-------------|
| **URL Parameters** | Filters, search state, navigation | Browser history |
| **localStorage** | User preferences, settings | Across sessions |
| **sessionStorage** | Temporary session data | Until tab closes |
| **Nano Stores** | Complex shared state, reactive updates | In-memory only |
| **Custom Events** | One-way notifications, broadcasts | Event-based |

### Quick Examples

**URL Parameters:**
```tsx
const url = new URL(window.location.href);
url.searchParams.set('filter', 'active');
window.history.pushState({}, '', url);
window.dispatchEvent(new Event('urlchange'));
```

**localStorage + Events:**
```tsx
localStorage.setItem('theme', 'dark');
window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: 'dark' } }));
```

**Nano Stores:**
```bash
npm install nanostores @nanostores/react
```

```tsx
import { atom } from 'nanostores';
export const $cart = atom<CartItem[]>([]);
```

**For complete communication patterns, type-safe implementations, and complex state sharing examples, refer to `references/component-communication.md`.**

## Data Fetching

### Key Constraints

- **Client-side only** - No server-side data fetching
- **Public APIs only** - Never include API keys (visible to users)
- **CORS required** - API must allow cross-origin requests
- **No environment variables** - `.env` files not supported

### Basic Pattern

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const controller = new AbortController();
  
  fetch(apiUrl, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    })
    .finally(() => setLoading(false));
    
  return () => controller.abort();
}, [apiUrl]);
```

**For complete data fetching patterns, caching strategies, POST requests, and error handling, refer to `references/data-fetching.md`.**

## Webflow Hooks

### useWebflowContext

Access current Webflow environment information:

```tsx
import { useWebflowContext } from '@webflow/react';

const { mode, interactive, locale } = useWebflowContext();
```

**Returns:**
- `mode` - Current Webflow mode (`design`, `publish`, etc.)
- `interactive` - Whether component should be interactive
- `locale` - User's locale string or null

**Common use cases:**
- Show expanded states in designer: `defaultExpanded={!interactive}`
- Disable interactions in designer: `draggable={interactive}`
- Locale-aware content: `translations[locale] || translations.en`
- Designer helpers: `if (mode === 'design') { /* show helpful message */ }`

**For detailed hook usage, mode types, and advanced patterns, refer to `references/hooks.md`.**

## SSR Configuration

### When to Disable SSR

Disable SSR (`ssr: false`) when component uses:

- Browser APIs (`window`, `document`, `localStorage`)
- Client-specific data or user context
- Heavy interactive UI (WebGL, Canvas)
- Non-deterministic rendering (random, time-based)

### When to Keep SSR Enabled

Keep SSR enabled (default) for:

- Static content (text, images, layouts)
- SEO-critical content
- Performance optimization
- Deterministic rendering

### Guarding Browser APIs

If SSR is needed but some browser APIs are used:

```tsx
useEffect(() => {
  if (typeof window !== 'undefined') {
    // Browser-only code
    setWidth(window.innerWidth);
  }
}, []);
```

**For SSR architecture details, hydration, and React Server Components limitations, refer to `references/architecture.md`.**

## CLI Commands

### Primary Commands

**Import components:**
```bash
npx webflow library share
```

**Bundle locally:**
```bash
npx webflow library bundle --public-path http://localhost:4000/
```

**View import logs:**
```bash
npx webflow library log
```

### Common Flags

- `--verbose` - Detailed output for debugging
- `--dev` - Development mode (no minification)
- `--no-input` - Skip prompts (for CI/CD)
- `--api-token <token>` - Pass token directly

**For complete CLI reference, webpack configuration, CSS Modules setup, and CI/CD integration, refer to `references/cli-reference.md`.**

## Webflow Designer MCP (Optional)

**Note:** Webflow Designer MCP tools may not be available in all environments. Always check for tool availability before attempting to use them.

### Availability Check

```typescript
// Check if Webflow MCP tools are available
const hasWebflowMCP = typeof mcp__webflow__sites_list === 'function';

if (!hasWebflowMCP) {
  // MCP tools not available - use alternative approach
  console.log('Webflow Designer MCP not available');
}
```

### What Are Designer MCP Tools?

Model Context Protocol (MCP) tools for Webflow Designer allow you to programmatically:

- Access and navigate Webflow sites and pages
- Create and modify page elements
- Manage CMS collections and content
- Publish site changes
- Add content to component showcase pages

**Use cases:**
- Adding descriptive content to component demo pages
- Updating page content programmatically
- Managing CMS data for components
- Bulk content operations across pages

### Connection Workflow

1. **Check tool availability** (see above)
2. **Get site information:**
   ```typescript
   const { sites } = await mcp__webflow__sites_list();
   const site = sites.find(s => s.displayName === 'My Site');
   ```

3. **Provide connection link to user:**
   ```markdown
   Click this link to connect:
   [Launch Webflow Designer](https://{shortName}.design.webflow.com?app={appId})
   ```

4. **Wait for user confirmation** that Designer is connected

5. **Navigate and make changes:**
   ```typescript
   // Switch to page
   await mcp__webflow__de_page_tool({
     siteId: site.id,
     actions: [{ switch_page: { page_id: pageId } }]
   });

   // Ask user to select target element
   // User MUST manually select in Designer

   // Create content
   await mcp__webflow__element_builder({
     siteId: site.id,
     actions: [{
       parent_element_id: selectedElementId,
       creation_position: "append",
       element_schema: {
         type: "Paragraph",
         set_text: { text: "Content here" }
       }
     }]
   });
   ```

### Critical Requirements

**User must manually select elements:**
- For operations that target specific elements, user must select them in Designer first
- Always ask user to select element, then confirm before proceeding
- Example: "Please select the `section-inner--about` section, then let me know when ready"

**Connection can drop:**
- Long operations may lose connection
- Ask user to reconnect if errors occur
- Provide fresh connection link when needed

**Element creation is sequential:**
- Each element operation is separate
- Creating multiple elements takes time
- Batch operations in logical groups

### Quick Reference

**Common tasks:**
- List sites: `mcp__webflow__sites_list()`
- List pages: `mcp__webflow__pages_list({ site_id })`
- Switch page: `mcp__webflow__de_page_tool({ siteId, actions: [{ switch_page }] })`
- Get selected: `mcp__webflow__element_tool({ siteId, actions: [{ get_selected_element }] })`
- Create element: `mcp__webflow__element_builder({ siteId, actions: [...] })`
- Publish: `mcp__webflow__sites_publish({ site_id })`

**For complete Designer MCP documentation, patterns, troubleshooting, and API reference, refer to `references/webflow-designer-mcp.md`.**

## Troubleshooting Quick Reference

### Components Don't Appear

1. Check glob pattern in `webflow.json` matches files
2. Verify `.webflow.tsx` extension
3. Look for compilation errors in terminal
4. Refresh Webflow Designer

### Styles Not Showing

1. Import styles in `.webflow.tsx` (not just `.tsx`)
2. Verify CSS Module import: `import styles from './Component.module.css'`
3. Check Shadow DOM in browser DevTools

### Authentication Fails

1. Verify token in `.env`
2. Ensure you're Workspace Admin
3. Try manual auth: `--api-token` flag

### State Not Shared

1. React Context doesn't work across components
2. Use URL params, localStorage, Nano Stores, or Custom Events
3. Refer to component communication patterns

### API Requests Fail

1. Check CORS headers on API
2. Verify public endpoint (no authentication required)
3. Test API in browser console

**For comprehensive troubleshooting, error messages, and solutions, refer to `references/troubleshooting.md`.**

## Best Practices Summary

### Component Design

- Keep components focused on single responsibility
- Use TypeScript for type safety
- Provide sensible defaults for all props
- Handle edge cases (empty states, errors, loading)

### Prop Configuration

- Use descriptive prop names
- Group related props together
- Add helpful tooltips for complex props
- Use appropriate prop types for data

### Styling

- Use site variables with fallbacks
- Use CSS Modules for scoped styles
- Respect `prefers-reduced-motion`
- Mobile-first responsive design

### Performance

- Minimize bundle size (target < 10MB)
- Use `React.memo` for expensive components
- Clean up side effects in `useEffect`
- Lazy load heavy features

### Data & State

- Handle all states (loading, error, empty, success)
- Use AbortController for fetch cleanup
- Validate API responses
- Never hardcode secrets or API keys

**For complete best practices, code examples, and detailed patterns, refer to `references/best-practices.md`.**

## Documentation Reference Map

Use these references for detailed information:

- **`references/getting-started.md`** - Setup, installation, first component
- **`references/component-declaration.md`** - Complete `declareComponent` API
- **`references/prop-types.md`** - All prop types with full configuration
- **`references/wrapper-components.md`** - Transform complex prop types
- **`references/hooks.md`** - `useWebflowContext` patterns and examples
- **`references/architecture.md`** - Shadow DOM, React roots, SSR details
- **`references/styling.md`** - CSS strategies, Shadow DOM, site variables
- **`references/component-communication.md`** - State sharing patterns
- **`references/data-fetching.md`** - API integration, caching, requests
- **`references/cli-reference.md`** - All CLI commands and options
- **`references/webflow-designer-mcp.md`** - Webflow Designer MCP tools (if available)
- **`references/best-practices.md`** - Comprehensive recommendations
- **`references/troubleshooting.md`** - Common issues and solutions

## Implementation Workflow

When helping users develop components:

1. **Understand requirements** - Clarify component purpose and props needed
2. **Choose appropriate patterns** - Select prop types, styling approach, communication method
3. **Implement incrementally** - Start with basic structure, add features progressively
4. **Reference documentation** - Load relevant reference files as needed for detailed guidance
5. **Test and troubleshoot** - Use CLI to bundle and import, fix issues iteratively
6. **Optimize** - Review bundle size, performance, accessibility

## Context Management

**Progressive disclosure:** Load reference files only when needed for specific questions:

## Document Structure

This map uses a hierarchical structure:

* **##** marks documentation topic areas
* **###** marks individual documentation pages with clickable links
* **Nested bullets** show the heading structure within each page
* Each page title links to the full documentation in the references/ directory

## Getting Started

### [introduction](references/introduction.md)

* Get started
* Key capabilities
* How code components work in Webflow

### [introduction/quick-start](references/introduction/quick-start.md)

* Before you start
* 1. Setup your development environment
* 2. Define a Webflow code component
* 3. Share your library to Webflow
* 4. Use the component on your Webflow site
* Congratulations
* Next steps
  * Learn the fundamentals
  * Advanced configuration

### [installation](references/installation.md)

* Setup requirements
  * Webflow CLI
  * webflow.json
* Authentication
  * Manual authentication
  * Workspace API token
* Next steps
* Related topics

## Core Concepts

### [component-architecture](references/component-architecture.md)

* Key concepts
* Shadow DOM and React roots
* Server-side rendering (SSR)
  * When to disable SSR
* Communicating between components
  * Sharing state across components
    * URL parameters
    * Browser storage
    * Nano Stores
  * Custom events
* Data fetching
  * Key considerations

### [define-code-component](references/define-code-component.md)

* File structure and naming
* Imports
* Declare component
  * Component metadata
  * Prop definitions
  * Options
    * Tag selectors
    * Server-side rendering (SSR)
* Best practices
* Next steps

### [frameworks-and-libraries](references/frameworks-and-libraries.md)

* CSS frameworks
* Component libraries
* Preprocessors & post-processing
* Next steps
* Troubleshooting

## Styling

### [styling-components](references/styling-components.md)

* How Shadow DOM affects styling
* Adding styles to your code components
* CSS capabilities
  * Site variables
  * Inherited properties
  * Tag selectors
* Advanced configuration

## Build & Deploy

### [bundling-and-import](references/bundling-and-import.md)

* Import
  * CI/CD pipelines
* Bundling
  * Bundle limits
* Debugging
  * Disable minification
  * CSS modules
* Bundle locally

### [webpack-configuration-overrides](references/webpack-configuration-overrides.md)

* Overview
  * Review the default configuration
* Configuration file setup
* Configuration API
  * Blocked properties
  * Special property handling
    * Module rules
    * Plugins
* Examples
  * Add a new loader
  * Add a new rule
  * Extend an existing loader
  * Add custom plugins
  * Provide aliases
* Best practices
* Troubleshooting

## Reference

### [reference/cli](references/reference/cli.md)

* Installation
* Commands
  * Import
    * Options
  * Bundle
    * Options
  * Log
* CI/CD workflows
* Troubleshooting

### [reference/hooks/declareComponent](references/reference/hooks/declareComponent.md)

* declareComponent(Component, data)
* Syntax
  * Parameters
    * Data object
* Example

### [reference/hooks/useWebflowContext](references/reference/hooks/useWebflowContext.md)

* useWebflowContext()
* Syntax
* Returns
  * WebflowContext properties
* Examples
  * Conditional rendering based on interactive state
  * Locale-aware content

### [reference/prop-types](references/reference/prop-types.md)

* Defining props in your code component
* Basic usage
* Available prop types
  * Text and content
  * Assets and data
  * Structure and styles
* Prop values
* Best practices
  * Provide helpful defaults
  * Use succinct names
  * Group related props
* Example: Complete component

## Prop Types Reference

### [reference/prop-types/text](references/reference/prop-types/text.md)

* Syntax
  * Prop Definition
    * Properties
    * Example
  * Prop Value
    * Example
* When to use
* Best practices

### [reference/prop-types/rich-text](references/reference/prop-types/rich-text.md)

* Syntax
  * Prop definition
    * Properties
    * Example
  * Prop value
    * Example
* When to use
* Best practices

### [reference/prop-types/text-node](references/reference/prop-types/text-node.md)

* Syntax
  * Prop definition
    * Properties
    * Example
  * Prop value
    * Example
* When to use
* Best practices

### [reference/prop-types/link](references/reference/prop-types/link.md)

* Syntax
  * Prop definition
    * Properties
  * Prop value
    * Examples
* When to use
* Best practices

### [reference/prop-types/image](references/reference/prop-types/image.md)

* Syntax
  * Prop definition
    * Properties
  * Prop value
  * Examples
* When to use
* Best practices

### [reference/prop-types/number](references/reference/prop-types/number.md)

* Syntax
  * Prop definition
    * Properties
    * Example
  * Prop value
    * Example
* When to use
* Best practices

### [reference/prop-types/boolean](references/reference/prop-types/boolean.md)

* Syntax
  * Prop definition
    * Properties
    * Example
  * Prop value
    * Example

### [reference/prop-types/variant](references/reference/prop-types/variant.md)

* Syntax
  * Prop Definition
    * Properties
    * Example
  * Prop Value
    * Example
* When to use
* Best practices

### [reference/prop-types/visibility](references/reference/prop-types/visibility.md)

* Syntax
  * Prop definition
    * Properties
    * Example
  * Prop value
    * Example
* When to use
* Best practices

### [reference/prop-types/slot](references/reference/prop-types/slot.md)

* Syntax
  * Prop definition
    * Properties
    * Example
  * Prop value
    * Example
* When to use
* Best practices

### [reference/prop-types/id](references/reference/prop-types/id.md)

* Syntax
  * Prop definition
    * Properties
    * Example
  * Prop value
    * Example
* When to use

## Troubleshooting

### [faqs](references/faqs.md)

* Getting started
* Development and styling
* Imports and updates
* Troubleshooting
* Performance and limitations
* Advanced topics

## When to Use This Skill

Activate this skill when users ask about:
- "How do I create a React component for Webflow?"
- "Set up DevLink code components"
- "Define props in declareComponent"
- "Style components with Shadow DOM"
- "Use slots in Webflow components"
- "Import third-party libraries in code components"
- "Deploy code components to Webflow"
- "Configure webpack for Webflow components"
- Any DevLink or code component development questions

## Specific Solutions, Tips & Workarounds

### [using slots](solutions/slots.md)

- How Slots Work in Webflow 
- The Slot Wrapper Problem 
- Shadow DOM Pseudo-selectors - Deep dive into :host and ::slotted() with examples
- display: contents Explanation - The crucial CSS property for slot layouts
- Common Patterns and Solutions - 4 proven patterns including Grid layout and click interception
- Slot Limitations and Workarounds - 5 major limitations with practical solutions
- Slot Best Practices - 6 key practices for robust slot implementations
- Slot Debug Checklist - Step-by-step debugging guide

And specifically for troubleshooting; 

- Why React.Children.toArray(content) doesn't work with slots
- How :host applies styles to the shadow host from within Shadow DOM
- How ::slotted() can only target direct children, not descendants
- The "Golden Pattern" for slot layouts using :host + ::slotted(*)
- Why !important is needed to override Webflow's inline styles
- How pointerEvents: 'none' enables click interception on slotted content



