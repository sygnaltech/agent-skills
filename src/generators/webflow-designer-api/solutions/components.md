**Distinguishing Native vs Code Components**

- Context: The Webflow Designer API doesn't provide a direct `isCodeComponent` flag in the public typings. Extensions that need to distinguish between native Webflow components and custom Code Components must use runtime detection.

**Detection Pattern**

- Retrieve the component's root element via `component.getRootElement()`.
- Examine the root element's `type` property:
  - Empty string (`""`) → Code Component
  - Concrete type (e.g., `"DOM"`, `"Section"`, etc.) → Native Component
  - Call fails or returns `null` → Unknown/Invalid

Rationale: Code Components expose a root element with an empty `type` string, while native Webflow components have concrete element types. This is an observed runtime behavior rather than a documented API contract.

**Reliability & Caveats**

- This pattern is based on current Designer runtime characteristics and may change with future API updates.
- If Webflow introduces a formal component classification API, prefer that over this heuristic.
- Always handle the "Unknown" case gracefully (failed calls, null results).
- Consider logging component metadata (element structure, attributes, styles) when debugging classification issues.

**Alternative Approaches**

- Check for Code Component-specific properties if accessing the component definition directly.
- Monitor Webflow's Developer API changelog for official component type detection methods.
- Use try-catch blocks when calling `getRootElement()` to handle edge cases.