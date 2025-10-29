---
name: webflow-designer-api
description: Webflow Designer Extension API documentation for building apps that extend the Webflow Designer. Use this skill when users ask about Designer Extensions, programmatically manipulating elements, styles, components, variables, pages, assets, or building custom Designer functionality.
resources:
  - references/**/*.md
---

# Webflow Designer API Documentation

This skill provides comprehensive reference documentation for the Webflow Designer Extension API. Learn how to build apps that extend the Webflow Designer with custom functionality, programmatically manipulate design elements, manage styles and components, and create powerful design tools.

## Document Structure

This map uses a hierarchical structure:

* **##** marks documentation topic areas
* **###** marks individual API references with clickable links
* **Nested bullets** show key methods and features
* Each reference links to the full documentation in the references/ directory

## Getting Started

### [designer-api/getting-started](references/reference/designer-api/getting-started.md)

* Create your first Designer Extension
* Prerequisites
* Set up development environment
* Install Webflow CLI
* Create extension project
* Run extension locally
* Update elements programmatically

### [webflow-cli](references/reference/webflow-cli.md)

* Webflow CLI overview
* Installation
* Commands
* Extension management
* Development workflow

### [error-handling](references/reference/error-handling.md)

* Error handling patterns
* API error responses
* Best practices

### [app-modes](references/reference/app-modes.md)

* Extension lifecycle
* App states
* Mode management

## Elements

### Creating & Retrieving Elements

* [creating-retrieving-elements](references/reference/creating-retrieving-elements.md)
* [get-selected-element](references/reference/get-selected-element.md)
* [set-selected-element](references/reference/set-selected-element.md)
* [get-all-elements](references/reference/get-all-elements.md)

### Inserting Elements

* [insert-element-before](references/reference/insert-element-before.md)
* [insert-element-after](references/reference/insert-element-after.md)
* [prepend](references/reference/prepend.md)
* [append](references/reference/append.md)
* [bulk-add-elements](references/reference/bulk-add-elements.md)

### Managing Elements

* [remove-element](references/reference/remove-element.md)
* [element-properties-methods](references/reference/element-properties-methods.md)
* [element-types-methods](references/reference/element-types-methods.md)
* [element-presets](references/reference/element-presets.md)

### Element Children

* [elements/children](references/reference/elements/children.md)
* [element-children/append](references/reference/element-children/append.md)
* [element-children/prepend](references/reference/element-children/prepend.md)

### Custom Attributes

* [elements/custom-attributes](references/reference/elements/custom-attributes.md)
* [custom-attributes/setCustomAttribute](references/reference/custom-attributes/setCustomAttribute.md)
* [custom-attributes/removeCustomAttribute](references/reference/custom-attributes/removeCustomAttribute.md)
* [custom-attributes/getAllCustomAttributes](references/reference/custom-attributes/getAllCustomAttributes.md)
* [custom-attributes/getCustomAttribute](references/reference/custom-attributes/getCustomAttribute.md)

### Element Styles

* [elements/styles](references/reference/elements/styles.md)
* [element-styles/getStyles](references/reference/element-styles/getStyles.md)
* [element-styles/setStyles](references/reference/element-styles/setStyles.md)

### Text Content

* [elements/text-content](references/reference/elements/text-content.md)
* [set-text-content](references/reference/set-text-content.md)
* [get-text-content](references/reference/get-text-content.md)

## Element Types

### DOM Element

* [dom-element](references/reference/dom-element.md)
* [dom-element/getTag](references/reference/dom-element/getTag.md)
* [dom-element/setTag](references/reference/dom-element/setTag.md)
* [dom-element/getAllAttributes](references/reference/dom-element/getAllAttributes.md)
* [dom-element/getAttribute](references/reference/dom-element/getAttribute.md)
* [dom-element/setAttribute](references/reference/dom-element/setAttribute.md)
* [dom-element/removeAttribute](references/reference/dom-element/removeAttribute.md)

### String Element

* [string-element](references/reference/string-element.md)
* [string-element/getText](references/reference/string-element/getText.md)
* [string-element/setText](references/reference/string-element/setText.md)

### Component Element

* [component-element](references/reference/component-element.md)
* [component-element/getComponent](references/reference/component-element/getComponent.md)

### Heading Element

* [heading-element](references/reference/heading-element.md)
* [heading-element/getHeadingLevel](references/reference/heading-element/getHeadingLevel.md)
* [heading-element/setHeadingLevel](references/reference/heading-element/setHeadingLevel.md)

### Image Element

* [image-element](references/reference/image-element.md)
* [image-element/getAsset](references/reference/image-element/getAsset.md)
* [image-element/setAsset](references/reference/image-element/setAsset.md)
* [image-element/getAltText](references/reference/image-element/getAltText.md)
* [image-element/setAltText](references/reference/image-element/setAltText.md)

### Link Element

* [link-element](references/reference/link-element.md)
* [link-element/setSettings](references/reference/link-element/setSettings.md)
* [link-element/getTarget](references/reference/link-element/getTarget.md)

## Forms

### Form Element

* [forms](references/reference/forms.md)
* [form-element/set-form-name](references/reference/form-element/set-form-name.md)
* [form-element/get-form-settings](references/reference/form-element/get-form-settings.md)
* [form-element/set-form-settings](references/reference/form-element/set-form-settings.md)

### Form Inputs

* [form-inputs](references/reference/form-inputs.md)
* [form-element/get-required-status](references/reference/form-element/get-required-status.md)
* [form-element/set-required-status](references/reference/form-element/set-required-status.md)
* [form-element/get-name-input-field](references/reference/form-element/get-name-input-field.md)
* [form-element/set-name-input-field](references/reference/form-element/set-name-input-field.md)
* [form-element/get-type-input-field](references/reference/form-element/get-type-input-field.md)
* [form-element/set-type-input-field](references/reference/form-element/set-type-input-field.md)

## Styles

### Managing Styles

* [get-all-styles](references/reference/get-all-styles.md)
* [get-style-by-name](references/reference/get-style-by-name.md)
* [create-style](references/reference/create-style.md)
* [remove-style](references/reference/remove-style.md)
* [style/is-combo-class](references/reference/style/is-combo-class.md)

### Style Properties

* [style-properties](references/reference/style-properties.md)
* [set-style-properties](references/reference/set-style-properties.md)
* [get-style-property](references/reference/get-style-property.md)
* [set-style-property](references/reference/set-style-property.md)
* [remove-a-style-property](references/reference/remove-a-style-property.md)
* [remove-style-properties](references/reference/remove-style-properties.md)
* [clear-all-style-properties](references/reference/clear-all-style-properties.md)

### Variable Modes (Styles)

* [managing-variable-modes-style](references/reference/managing-variable-modes-style.md)
* [get-variable-mode-style](references/reference/get-variable-mode-style.md)
* [get-variable-modes-style](references/reference/get-variable-modes-style.md)
* [set-variable-mode-style](references/reference/set-variable-mode-style.md)
* [set-variable-modes-style](references/reference/set-variable-modes-style.md)
* [remove-variable-mode-style](references/reference/remove-variable-mode-style.md)
* [remove-variable-modes-style](references/reference/remove-variable-modes-style.md)
* [remove-all-variable-modes](references/reference/remove-all-variable-modes.md)

## Components

### Component Management

* [get-components](references/reference/get-components.md)
* [create-component-definition](references/reference/create-component-definition.md)
* [delete-component-definition](references/reference/delete-component-definition.md)
* [create-component-instance](references/reference/create-component-instance.md)
* [enter-component](references/reference/enter-component.md)
* [exit-component](references/reference/exit-component.md)

### Component Properties

* [get-root-element](references/reference/get-root-element.md)
* [get-component-name](references/reference/get-component-name.md)
* [get-component](references/reference/get-component.md)
* [set-component-name](references/reference/set-component-name.md)

## Variables

### Variable Collections

* [variable-collections-overview](references/reference/variable-collections-overview.md)
* [create-variable-collection](references/reference/create-variable-collection.md)
* [get-all-variable-collections](references/reference/get-all-variable-collections.md)
* [get-default-variable-collection](references/reference/get-default-variable-collection.md)
* [get-variable-collection-by-id](references/reference/get-variable-collection-by-id.md)
* [remove-variable-collection](references/reference/remove-variable-collection.md)
* [get-collection-name](references/reference/get-collection-name.md)
* [set-variable-collection-name](references/reference/set-variable-collection-name.md)

### Variables

* [variables-detail-overview](references/reference/variables-detail-overview.md)
* [create-number-variable](references/reference/create-number-variable.md)
* [create-color-variable](references/reference/create-color-variable.md)
* [create-font-family-variable](references/reference/create-font-family-variable.md)
* [create-size-variable](references/reference/create-size-variable.md)
* [create-percentage-variable](references/reference/create-percentage-variable.md)
* [get-all-variables](references/reference/get-all-variables.md)
* [get-variable-by-name](references/reference/get-variable-by-name.md)
* [get-variable](references/reference/get-variable.md)
* [get-variable-name](references/reference/get-variable-name.md)
* [get-variable-value](references/reference/get-variable-value.md)
* [get-variable-binding](references/reference/get-variable-binding.md)
* [get-variable-css-name](references/reference/get-variable-css-name.md)
* [set-variable-name](references/reference/set-variable-name.md)
* [set-variable-value](references/reference/set-variable-value.md)
* [remove-variable](references/reference/remove-variable.md)

### Variable Modes

* [variable-modes](references/reference/variable-modes.md)
* [get-all-variable-modes](references/reference/get-all-variable-modes.md)
* [get-variable-mode-by-name](references/reference/get-variable-mode-by-name.md)
* [get-variable-mode-by-id](references/reference/get-variable-mode-by-id.md)
* [create-variable-mode](references/reference/create-variable-mode.md)
* [remove-variable-mode](references/reference/remove-variable-mode.md)
* [get-variable-mode-name](references/reference/get-variable-mode-name.md)
* [set-variable-mode-name](references/reference/set-variable-mode-name.md)

## Assets

### Asset Management

* [create-an-asset](references/reference/create-an-asset.md)
* [get-all-assets](references/reference/get-all-assets.md)
* [get-asset-by-id](references/reference/get-asset-by-id.md)
* [get-asset-name](references/reference/get-asset-name.md)
* [set-asset-name](references/reference/set-asset-name.md)
* [get-alt-text](references/reference/get-alt-text.md)
* [set-alt-text](references/reference/set-alt-text.md)
* [set-asset-file](references/reference/set-asset-file.md)
* [get-asset-mime-type](references/reference/get-asset-mime-type.md)
* [get-asset-url](references/reference/get-asset-url.md)

### Asset Folders

* [get-asset-folder-parent](references/reference/get-asset-folder-parent.md)
* [set-asset-folder-parent](references/reference/set-asset-folder-parent.md)
* [get-all-asset-folders](references/reference/get-all-asset-folders.md)
* [create-asset-folder](references/reference/create-asset-folder.md)
* [get-asset-folder-name](references/reference/get-asset-folder-name.md)

## Pages

### Page Management

* [create-folder](references/reference/create-folder.md)
* [create-page](references/reference/create-page.md)
* [get-all-pages-and-folders](references/reference/get-all-pages-and-folders.md)
* [get-current-page](references/reference/get-current-page.md)
* [switch-page](references/reference/switch-page.md)

### Page Properties

* [set-page-name](references/reference/set-page-name.md)
* [get-page-title](references/reference/get-page-title.md)
* [set-page-title](references/reference/set-page-title.md)
* [get-page-slug](references/reference/get-page-slug.md)
* [set-page-slug](references/reference/set-page-slug.md)
* [get-page-description](references/reference/get-page-description.md)
* [set-page-description](references/reference/set-page-description.md)
* [get-page-publish-path](references/reference/get-page-publish-path.md)
* [get-page-category](references/reference/get-page-category.md)
* [get-utility-page-key](references/reference/get-utility-page-key.md)
* [get-collection-id-from-cms-page](references/reference/get-collection-id-from-cms-page.md)
* [get-collection-name-from-cms-page](references/reference/get-collection-name-from-cms-page.md)
* [set-page-metadata](references/set-page-metadata.md)
* [check-if-page-is-draft](references/reference/check-if-page-is-draft.md)
* [set-draft](references/reference/set-draft.md)
* [check-if-page-is-homepage](references/reference/check-if-page-is-homepage.md)
* [check-if-page-is-password-protected](references/reference/check-if-page-is-password-protected.md)

### SEO & Search

* [get-search-title](references/reference/get-search-title.md)
* [set-search-title](references/reference/set-search-title.md)
* [check-if-page-uses-title-as-search-title](references/reference/check-if-page-uses-title-as-search-title.md)
* [use-page-title-as-search-title](references/reference/use-page-title-as-search-title.md)
* [get-search-description](references/reference/get-search-description.md)
* [set-search-description](references/reference/set-search-description.md)
* [check-description-is-used-as-search-description](references/reference/check-description-is-used-as-search-description.md)
* [use-page-description-as-search-description](references/reference/use-page-description-as-search-description.md)
* [get-search-image](references/reference/get-search-image.md)
* [set-search-image](references/reference/set-search-image.md)
* [use-open-graph-image-as-search-image](references/reference/use-open-graph-image-as-search-image.md)
* [check-if-page-is-excluded-from-search](references/reference/check-if-page-is-excluded-from-search.md)
* [exclude-page-from-search](references/reference/exclude-page-from-search.md)

### Open Graph

* [get-open-graph-title](references/reference/get-open-graph-title.md)
* [set-open-graph-title](references/reference/set-open-graph-title.md)
* [uses-title-as-open-graph-title](references/reference/uses-title-as-open-graph-title.md)
* [set-page-to-use-title-as-open-graph-title](references/reference/set-page-to-use-title-as-open-graph-title.md)
* [get-open-graph-description](references/reference/get-open-graph-description.md)
* [set-open-graph-description](references/reference/set-open-graph-description.md)
* [uses-description-as-open-graph-description](references/reference/uses-description-as-open-graph-description.md)
* [use-description-as-open-graph-description](references/reference/use-description-as-open-graph-description.md)
* [get-open-graph-image](references/reference/get-open-graph-image.md)
* [set-open-graph-image-url](references/reference/set-open-graph-image-url.md)

### Folders

* [get-folder-name](references/reference/get-folder-name.md)
* [get-folder-slug](references/reference/get-folder-slug.md)
* [get-parent-folder](references/reference/get-parent-folder.md)
* [set-folder-name](references/reference/set-folder-name.md)
* [set-folder-slug](references/reference/set-folder-slug.md)
* [set-parent-folder](references/reference/set-parent-folder.md)

## Extension Lifecycle

### Site & Extension Info

* [get-site-info](references/reference/get-site-info.md)
* [resize-extension](references/reference/resize-extension.md)
* [close-extension](references/reference/close-extension.md)
* [get-breakpoint](references/reference/get-breakpoint.md)
* [get-user-id-token](references/reference/get-user-id-token.md)
* [get-users-designer-capabilities](references/reference/get-users-designer-capabilities.md)
* [get-pseudo-mode](references/reference/get-pseudo-mode.md)
* [get-launch-context](references/reference/get-launch-context.md)

### Events

* [events](references/reference/events.md)
* [notify-user](references/reference/notify-user.md)
* [user-selects-element](references/reference/user-selects-element.md)
* [user-changes-breakpoint](references/reference/user-changes-breakpoint.md)
* [user-changes-current-page](references/reference/user-changes-current-page.md)
* [user-changes-cms-page](references/reference/user-changes-cms-page.md)
* [user-changes-mode](references/reference/user-changes-mode.md)
* [user-changes-pseudo-mode](references/reference/user-changes-pseudo-mode.md)

### App Connections

* [app-intents-and-connections](references/reference/app-intents-and-connections.md)
* [set-app-connection](references/reference/set-app-connection.md)
* [get-app-connections](references/reference/get-app-connections.md)
* [remove-app-connection](references/reference/remove-app-connection.md)
* [get-current-app-connection](references/reference/get-current-app-connection.md)
* [get-current-app-connection-resource](references/reference/get-current-app-connection-resource.md)

## When to Use This Skill

Activate this skill when users ask about:
- "How do I create a Designer Extension?"
- "Programmatically add elements in Webflow Designer"
- "Manipulate styles via Designer API"
- "Create components programmatically"
- "Manage design variables in extensions"
- "Handle page SEO metadata"
- "Build custom Designer tools"
- "Listen to Designer events"
- Any Webflow Designer Extension API questions

## Related Skills

For other Webflow capabilities, see:
- `webflow-cloud` - Webflow Cloud platform and hosting
- `webflow-code-components` - React code components via DevLink
- `webflow-data-api` - Data API v2.0 for CMS operations
