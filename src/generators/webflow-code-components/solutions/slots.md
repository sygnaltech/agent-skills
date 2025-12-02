# Working with Slots in Webflow Code Components

This document explains the mechanics, limitations, and solutions for working with slots in Webflow code components.

## Table of Contents

1. [How Slots Work in Webflow](#how-slots-work-in-webflow)
2. [The Slot Wrapper Problem](#the-slot-wrapper-problem)
3. [Shadow DOM Pseudo-selectors](#shadow-dom-pseudo-selectors)
4. [Common Patterns and Solutions](#common-patterns-and-solutions)
5. [Limitations and Workarounds](#limitations-and-workarounds)

---

## How Slots Work in Webflow

### Basic Structure

When you declare a slot in a Webflow code component, the rendered structure looks like this:

```html
<!-- Light DOM (page content) -->
<code-island data-props="{...}" data-slots='["content"]'>
  <div slot="content">              <!-- Webflow's wrapper -->
    <button>User Item 1</button>
    <button>User Item 2</button>
    <button>User Item 3</button>
  </div>

  #shadow-root (open)
    <!-- Shadow DOM (component internals) -->
    <div data-root="true">
      <!-- Your component's render output -->
      <slot name="content"></slot>
    </div>
</code-island>
```

### Key Points

1. **Webflow wraps all slot content** in a `<div slot="content">` container
2. **User-added items are children** of that wrapper div, not direct children of `<code-island>`
3. **The slot element** (`<slot name="content">`) lives in the Shadow DOM
4. **Content renders in the light DOM** but projects into the shadow DOM slot location

---

## The Slot Wrapper Problem

### The Issue

Because Webflow wraps all slot content in a single container, that wrapper becomes **one element** in your component's layout. This creates problems for layout systems like CSS Grid and Flexbox.

**Example Problem: CSS Grid**

```tsx
// Your component
export const Grid = ({ content }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {content}  // This renders <slot name="content"></slot>
    </div>
  );
};
```

**Rendered structure:**

```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr)">
  <slot name="content"></slot>  <!-- Slot element itself -->
</div>

<!-- In the light DOM: -->
<div slot="content">             <!-- This becomes ONE grid item -->
  <button>Item 1</button>         <!-- These stack inside it -->
  <button>Item 2</button>
  <button>Item 3</button>
</div>
```

**Result:** All buttons stack vertically inside one grid cell instead of distributing across columns.

### Why You Can't Process Slot Children in React

You might think to do this:

```tsx
// ❌ THIS WON'T WORK
const slotItems = React.Children.toArray(content);
return (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
    {slotItems.map((item, i) => (
      <div key={i}>{item}</div>  // Try to wrap each child
    ))}
  </div>
);
```

**Why it fails:**
- The `content` prop is the **slot element itself**, not the slotted children
- Slotted children live in the **light DOM**, outside the component's React tree
- You cannot iterate over or access individual slotted children from within the component
- `React.Children.toArray(content)` sees one element (the slot), not its children

---

## Shadow DOM Pseudo-selectors

The solution to the slot wrapper problem involves two powerful CSS pseudo-selectors that work in Shadow DOM.

### `:host` - Target the Shadow Host

The `:host` pseudo-selector targets the shadow host element (the `<code-island>`) from within the Shadow DOM stylesheet.

**Syntax:**

```css
:host {
  /* Styles applied to <code-island> */
}
```

**Example:**

```tsx
const gridStyles = `
  :host {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
`;

return (
  <>
    <style>{gridStyles}</style>
    {content}
  </>
);
```

**What happens:**
- The `<code-island>` element becomes the grid container
- The `<div slot="content">` wrapper becomes a direct child of the grid container

**Important notes:**
- `:host` can be overridden by inline styles on the host element
- Use `!important` to override Webflow's `style="display:contents"` on code-island
- `:host` only works in Shadow DOM stylesheets, not external CSS

### `::slotted()` - Target Slotted Content

The `::slotted()` pseudo-selector targets elements that are slotted into the Shadow DOM from the light DOM.

**Syntax:**

```css
::slotted(selector) {
  /* Styles applied to slotted elements */
}
```

**Important constraints:**
- Only targets **direct children** of the slot wrapper (`<div slot="content">`)
- Cannot target **descendants** of slotted elements
- Can only style the slotted elements themselves, not their children

**Example:**

```tsx
const gridStyles = `
  :host {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  ::slotted(*) {
    display: contents;
  }
`;
```

**What happens:**
1. `:host` makes `<code-island>` a grid container
2. `::slotted(*)` targets the `<div slot="content">` wrapper
3. `display: contents` makes the wrapper transparent to layout
4. The wrapper's children (buttons) participate directly in the grid

### `display: contents` - The Layout Escape Hatch

The `display: contents` CSS property is crucial for slot layouts.

**What it does:**
- The element doesn't generate a box in the layout
- Its children are laid out as if they were children of the element's parent
- The element still exists in the DOM (can have event handlers, etc.)

**Perfect for slots:**

```css
::slotted(*) {
  display: contents !important;
}
```

This makes the Webflow wrapper "invisible" to layout, allowing slotted children to participate directly in the parent's layout system (grid, flex, etc.).

---

## Common Patterns and Solutions

### Pattern 1: CSS Grid Layout (Grid Component)

**Goal:** Distribute slotted items across a multi-column grid.

**Solution:**

```tsx
export const Grid: React.FC<GridProps> = ({ columns = 3, content }) => {
  const gridStyles = `
    :host {
      display: grid !important;
      grid-template-columns: repeat(${columns}, minmax(0, 1fr)) !important;
      gap: 1rem !important;
    }
    ::slotted(*) {
      display: contents !important;
    }
  `;

  return (
    <>
      <style>{gridStyles}</style>
      {content}
    </>
  );
};
```

**How it works:**
1. `:host` applies grid to `<code-island>`
2. `::slotted(*)` makes slot wrapper transparent
3. User items become direct grid items

### Pattern 2: Intercepting Clicks on Slotted Content

**Goal:** Capture clicks on slotted elements (like buttons or links) to trigger component logic.

**Solution:**

```tsx
export const VCard = ({ Slot }) => {
  const handleDownload = () => {
    // Download logic
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDownload();
      }}
      style={{ cursor: 'pointer', display: 'inline-block' }}
    >
      <div style={{ pointerEvents: 'none' }}>
        {Slot}
      </div>
    </div>
  );
};
```

**How it works:**
1. Outer div captures clicks
2. Inner div has `pointerEvents: 'none'` to disable clicks on slotted content
3. Clicks bubble up to the outer div handler

### Pattern 3: Styling Slotted Items

**Goal:** Apply consistent styles to all slotted children.

**Solution:**

```tsx
const styles = `
  ::slotted(*) {
    margin-bottom: 1rem;
    padding: 12px;
    border-radius: 4px;
  }
`;

return (
  <>
    <style>{styles}</style>
    <div>{content}</div>
  </>
);
```

**Limitations:**
- Can only style the **direct slotted elements**
- Cannot target descendants (e.g., `::slotted(* > p)` won't work)
- Cannot use complex selectors beyond simple element/class matching

### Pattern 4: Conditional Slot Rendering

**Goal:** Handle empty slots or show placeholder content.

**Solution:**

```tsx
export const Container = ({ content }) => {
  // Note: You cannot check if slot is "empty" from React
  // The slot always exists, even if no content is provided

  return (
    <>
      {content}
      {/* Fallback must be in the slot itself */}
      <div slot-fallback>No content provided</div>
    </>
  );
};
```

**Better approach - Use a wrapper prop:**

```tsx
export const Container = ({ content, showPlaceholder = false }) => {
  return (
    <>
      {content}
      {showPlaceholder && <div>Default content</div>}
    </>
  );
};
```

---

## Limitations and Workarounds

### Limitation 1: Cannot Access Individual Slot Children

**Problem:** You cannot iterate over or count slotted children from React.

```tsx
// ❌ THIS DOESN'T WORK
const slotItems = React.Children.toArray(content);
console.log(slotItems.length); // Always 1 (the slot element itself)
```

**Workaround:** Use CSS to handle layout instead of React logic.

```tsx
// ✅ USE CSS GRID/FLEX INSTEAD
const styles = `
  :host {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  ::slotted(*) {
    display: contents;
  }
`;
```

### Limitation 2: Cannot Style Descendants of Slotted Elements

**Problem:** `::slotted()` only targets direct children of the slot.

```css
/* ❌ DOESN'T WORK */
::slotted(div p) {
  color: red;
}

/* ❌ DOESN'T WORK */
::slotted(*) > p {
  color: blue;
}
```

**Workaround:** Use CSS custom properties (CSS variables) that inherit.

```tsx
const styles = `
  :host {
    --slot-text-color: #333;
    --slot-spacing: 1rem;
  }
  ::slotted(*) {
    color: var(--slot-text-color);
    padding: var(--slot-spacing);
  }
`;

return (
  <>
    <style>{styles}</style>
    {content}
  </>
);
```

Users can then use these variables in their slotted content:

```html
<div slot="content">
  <p style="color: var(--slot-text-color)">
    This text inherits the component's color
  </p>
</div>
```

### Limitation 3: Slot Wrapper Always Exists

**Problem:** Webflow always creates `<div slot="content">`, even if empty.

**Workaround:** Cannot detect empty slots reliably. Instead:

1. Use visibility props to control display
2. Design components to handle empty states gracefully
3. Use `display: contents` so empty wrapper doesn't affect layout

### Limitation 4: Cannot Prevent Default Link/Button Behavior in Slotted Content

**Problem:** Users might add links or buttons to slots, and you can't easily prevent their default behavior.

**Workaround:** Use `pointerEvents: 'none'` on slotted content wrapper.

```tsx
<div onClick={handleClick}>
  <div style={{ pointerEvents: 'none' }}>
    {content}  // Slotted links/buttons can't be clicked
  </div>
</div>
```

**Side effect:** All interaction is disabled on slotted content, including text selection.

### Limitation 5: Cannot Conditionally Show Different Slots

**Problem:** React can't conditionally render different slot elements.

```tsx
// ❌ THIS WON'T WORK AS EXPECTED
return condition ? <slot name="slotA"></slot> : <slot name="slotB"></slot>;
```

**Workaround:** Use CSS to show/hide slots.

```tsx
const styles = `
  slot[name="slotA"] {
    display: ${condition ? 'block' : 'none'};
  }
  slot[name="slotB"] {
    display: ${condition ? 'none' : 'block'};
  }
`;
```

---

## Best Practices

### 1. Always Use `:host` for Layout Containers

When your component needs to control layout of slotted items (grid, flex, etc.), apply layout to `:host`, not an internal wrapper.

✅ **Good:**
```tsx
const styles = `
  :host {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  ::slotted(*) {
    display: contents;
  }
`;
```

❌ **Bad:**
```tsx
return (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
    {content}  // Slot wrapper becomes one grid item
  </div>
);
```

### 2. Always Pair `:host` Layout with `::slotted(*)` Using `display: contents`

This pattern ensures slotted children participate directly in the layout.

```tsx
const styles = `
  :host {
    display: grid;
    /* grid properties */
  }
  ::slotted(*) {
    display: contents !important;
  }
`;
```

### 3. Use `!important` to Override Webflow's Inline Styles

Webflow adds `style="display:contents"` to `<code-island>`. Override it:

```css
:host {
  display: grid !important;
}
```

### 4. Don't Try to Access Slot Children in React

The `content` prop is the slot element, not its children. Use CSS for layout and styling instead.

### 5. Use CSS Custom Properties for Inheritable Styles

Since you can't style descendants of slotted elements, use CSS variables that inherit:

```css
:host {
  --component-color: blue;
  --component-spacing: 1rem;
}
```

### 6. Test with Various Slot Content

Always test your component with:
- Empty slots
- Single items
- Multiple items of different types
- Nested elements in slotted content
- Interactive elements (buttons, links)

---

## Debug Checklist

When slots aren't working as expected:

1. **Inspect the DOM structure**
   - Check if slot wrapper exists: `<div slot="content">`
   - Verify slot element in shadow root: `<slot name="content">`
   - Confirm user content is inside the wrapper

2. **Check computed styles**
   - Inspect `<code-island>` computed styles
   - Verify `:host` styles are applied
   - Check if `::slotted()` styles are reaching the wrapper

3. **Verify selector specificity**
   - Use `!important` if needed to override inline styles
   - Check that selectors match the actual elements

4. **Test `display: contents`**
   - Ensure slot wrapper has `display: contents`
   - Verify children are participating in parent layout

5. **Check for conflicting styles**
   - Look for Webflow's inline styles on `<code-island>`
   - Check for site-wide CSS affecting the component

---

## Real-World Examples

### Grid Component (Full Implementation)

```tsx
import React from 'react';

export interface GridProps {
  columns?: number;
  content?: React.ReactNode;
  gap?: string;
}

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  content,
  gap = '1rem',
}) => {
  const gridStyles = `
    :host {
      display: grid !important;
      grid-template-columns: repeat(${columns}, minmax(0, 1fr)) !important;
      gap: ${gap} !important;
      align-items: start !important;
      width: 100% !important;
    }
    ::slotted(*) {
      display: contents !important;
    }
  `;

  return (
    <>
      <style>{gridStyles}</style>
      {content}
    </>
  );
};
```

### VCard with Slot Click Handling

```tsx
import React from 'react';

interface VCardProps {
  Slot?: React.ReactNode;
  vcardData: string;
}

export const VCard: React.FC<VCardProps> = ({ Slot, vcardData }) => {
  const handleDownload = () => {
    const blob = new Blob([vcardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDownload();
      }}
      style={{
        cursor: 'pointer',
        display: 'inline-block',
      }}
    >
      <div style={{ pointerEvents: 'none' }}>
        {Slot}
      </div>
    </div>
  );
};
```

---

## Summary

**Key Takeaways:**

1. Webflow wraps all slot content in `<div slot="content">`
2. You cannot access individual slotted children from React
3. Use `:host` to apply layout to the shadow host (`<code-island>`)
4. Use `::slotted(*)` with `display: contents` to make the wrapper transparent
5. `::slotted()` can only target direct children, not descendants
6. Use CSS custom properties for inheritable styles
7. Always test with various slot content scenarios

**The Golden Pattern for Slot Layouts:**

```tsx
const styles = `
  :host {
    /* Your layout system (grid, flex, etc.) */
    display: grid !important;
  }
  ::slotted(*) {
    /* Make wrapper transparent */
    display: contents !important;
  }
`;

return (
  <>
    <style>{styles}</style>
    {content}
  </>
);
```

This pattern solves 90% of slot layout problems in Webflow code components.
