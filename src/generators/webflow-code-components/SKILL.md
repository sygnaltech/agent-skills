---
name: webflow-code-components
description: Documentation for Webflow Code Components via DevLink. Use this skill when users ask about creating React components for Webflow, DevLink integration, component props, slots, styling Shadow DOM components, bundling, or importing custom components into Webflow Designer.
resources:
  - references/**/*.md
---

# Webflow Code Components Documentation

This skill provides comprehensive documentation for building and deploying React code components to Webflow via DevLink. Learn how to create interactive, reusable components in your codebase and use them directly in the Webflow Designer.

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

## Related Skills

For other Webflow capabilities, see:
- `webflow-cloud` - Webflow Cloud platform and hosting
- `webflow-data-api` - Data API v2.0 for CMS operations
- `webflow-designer-api` - Designer extension development APIs
