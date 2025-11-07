# Developer Notes: Component Classification

This extension distinguishes “Native” vs “Code” components when showing component info.

## Detection Logic

- Fetch the component’s root element via `component.getRootElement()`.
- If the call resolves:
  - If `root.type === ""` → classify as `Code` component.
  - Else → classify as `Native` component.
- If the call fails or returns `null` → classify as `Unknown`.

Rationale: In practice, Webflow Code Components expose a root element whose `type` is an empty string, whereas Native components expose a concrete element type (e.g., `DOM`, `Section`, etc.). This behavior comes from current Designer runtime characteristics; there isn’t a dedicated "isCodeComponent" flag in the public typings.

## Implementation

- Function: `classifyComponent(component)` in `src/index.tsx` returns `'Native' | 'Code' | 'Unknown'` based on the rule above.
- The Info action includes `componentType` in the JSON alongside the serialized `root` tree for verification.

## Notes and Caveats

- This is an observed-runtime rule and may evolve with Designer updates.
- If future APIs expose a formal component kind, prefer that over heuristics.
- The serializer also includes `plugin`, `tag`, native `attributes`, `customAttributes`, `styles`, and `children` to help debugging and validation.