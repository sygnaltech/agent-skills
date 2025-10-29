---
name: webflow-data-api
description: Comprehensive documentation for the Webflow Data API (v2.0.0). Use this skill for REST API operations including sites, CMS collections, items, pages, forms, ecommerce, webhooks, users, assets, custom code, and enterprise features. Covers authentication, OAuth, rate limits, publishing workflows, and API structure.
version: 0.1.0
last-updated: 2025-10-28
resources:
  - references/**/*.md
---

# Webflow Data API Documentation

This skill provides comprehensive documentation for the Webflow Data API v2.0.0 - a RESTful API for managing sites, CMS content, pages, forms, ecommerce, and more.

## Document Structure
* **##** marks documentation topic areas
* **###** marks individual documentation pages with clickable links
* Nested bullets show the main sections within each page

## Getting Started

### [quick-start](references/reference/rest-introduction/quick-start.md)
* Before you start
* Quick Start (5 minutes)
* Clone the starter app
* Add credentials
* Start the server

### [structure-1](references/reference/structure-1.md)
* API structure and response objects

### [oauth-app](references/reference/oauth-app.md)
* Creating OAuth applications

## Authentication & Authorization

### [authentication](references/reference/authentication.md)
* Authentication methods and flows

### [site-token](references/reference/authentication/site-token.md)
* Site-specific access tokens

### [workspace-token](references/reference/authentication/workspace-token.md)
* Workspace-level access tokens

### [scopes](references/reference/scopes.md)
* OAuth scopes and permissions

### [authorized-by](references/reference/token/authorized-by.md)
* Check token authorization

### [introspect](references/reference/token/introspect.md)
* Token introspection

## Core Concepts

### [rate-limits](references/reference/rate-limits.md)
* API rate limiting

### [error-handling](references/reference/error-handling.md)
* Error codes and handling

### [versioning](references/reference/versioning.md)
* API versioning strategy

## Migration & Deprecation

### [migrating-to-v2](references/docs/migrating-to-v2.md)
* Migrating from v1 to v2

### [webflow-v1-api-deprecation-notice](references/docs/webflow-v1-api-deprecation-notice.md)
* V1 API deprecation timeline

## Sites

### [list](references/reference/sites/list.md)
* List all sites

### [get](references/reference/sites/get.md)
* Get site details

### [get-custom-domain](references/reference/sites/get-custom-domain.md)
* Get custom domain info

### [publish](references/reference/sites/publish.md)
* Publish site

## Pages & Components

### Pages
* [list](references/reference/pages-and-components/pages/list.md) - List pages
* [get-metadata](references/reference/pages-and-components/pages/get-metadata.md) - Get page metadata
* [update-page-settings](references/reference/pages-and-components/pages/update-page-settings.md) - Update page settings
* [get-content](references/reference/pages-and-components/pages/get-content.md) - Get page content
* [update-static-content](references/reference/pages-and-components/pages/update-static-content.md) - Update static content

### Components
* [list](references/reference/pages-and-components/components/list.md) - List components
* [get-content](references/reference/pages-and-components/components/get-content.md) - Get component content
* [update-content](references/reference/pages-and-components/components/update-content.md) - Update component content
* [get-properties](references/reference/pages-and-components/components/get-properties.md) - Get component properties
* [update-properties](references/reference/pages-and-components/components/update-properties.md) - Update component properties

## CMS

### [cms](references/reference/cms.md)
* Overview
* Workflows
* Key concepts
  * Collections
  * Collection fields
  * Collection items
* Bulk operations
* Webhooks

### Collections
* [list](references/reference/cms/collections/list.md) - List collections
* [get](references/reference/cms/collections/get.md) - Get collection
* [create](references/reference/cms/collections/create.md) - Create collection
* [delete](references/reference/cms/collections/delete.md) - Delete collection

### Collection Fields
* [create](references/reference/cms/collection-fields/create.md) - Create field
* [update](references/reference/cms/collection-fields/update.md) - Update field
* [delete](references/reference/cms/collection-fields/delete.md) - Delete field

### [field-types-item-values](references/reference/field-types-item-values.md)
* Field types and item values reference

### Staged Items
* [list-items](references/reference/cms/collection-items/staged-items/list-items.md) - List staged items
* [get-item](references/reference/cms/collection-items/staged-items/get-item.md) - Get staged item
* [create-items](references/reference/cms/collection-items/staged-items/create-items.md) - Create items
* [update-items](references/reference/cms/collection-items/staged-items/update-items.md) - Update items
* [delete-items](references/reference/cms/collection-items/staged-items/delete-items.md) - Delete items
* [publish-item](references/reference/cms/collection-items/staged-items/publish-item.md) - Publish item

### Live Items
* [list-items-live](references/reference/cms/collection-items/live-items/list-items-live.md) - List live items
* [get-item-live](references/reference/cms/collection-items/live-items/get-item-live.md) - Get live item
* [create-item-live](references/reference/cms/collection-items/live-items/create-item-live.md) - Create live item
* [update-items-live](references/reference/cms/collection-items/live-items/update-items-live.md) - Update live items
* [delete-items-live](references/reference/cms/collection-items/live-items/delete-items-live.md) - Delete/unpublish live items

## Forms

### Forms
* [list](references/reference/forms/forms/list.md) - List forms
* [get](references/reference/forms/forms/get.md) - Get form

### Form Submissions
* [list-submissions](references/reference/forms/form-submissions/list-submissions.md) - List submissions
* [get-submission](references/reference/forms/form-submissions/get-submission.md) - Get submission
* [list-submissions-by-site](references/reference/forms/form-submissions/list-submissions-by-site.md) - List by site
* [update-submission](references/reference/forms/form-submissions/update-submission.md) - Update submission
* [delete-submission](references/reference/forms/form-submissions/delete-submission.md) - Delete submission

## Custom Code

### Custom Code Blocks
* [list](references/reference/custom-code/custom-code/list.md) - List custom code
* [register-hosted](references/reference/custom-code/custom-code/register-hosted.md) - Register hosted code
* [register-inline](references/reference/custom-code/custom-code/register-inline.md) - Register inline code
* [list-custom-code-blocks](references/reference/custom-code/custom-code/list-custom-code-blocks.md) - List code blocks

### Site-Level Custom Code
* [get-custom-code](references/reference/custom-code/custom-code-sites/get-custom-code.md) - Get site custom code
* [upsert-custom-code](references/reference/custom-code/custom-code-sites/upsert-custom-code.md) - Upsert site custom code
* [delete-custom-code](references/reference/custom-code/custom-code-sites/delete-custom-code.md) - Delete site custom code

### Page-Level Custom Code
* [get-custom-code](references/reference/custom-code/custom-code-pages/get-custom-code.md) - Get page custom code
* [delete-custom-code](references/reference/custom-code/custom-code-pages/delete-custom-code.md) - Delete page custom code

## Assets

### Assets
* [list](references/reference/assets/assets/list.md) - List assets
* [get](references/reference/assets/assets/get.md) - Get asset
* [create](references/reference/assets/assets/create.md) - Create asset
* [update](references/reference/assets/assets/update.md) - Update asset
* [delete](references/reference/assets/assets/delete.md) - Delete asset

### Asset Folders
* [list-folders](references/reference/assets/asset-folders/list-folders.md) - List folders
* [get-folder](references/reference/assets/asset-folders/get-folder.md) - Get folder
* [create-folder](references/reference/assets/asset-folders/create-folder.md) - Create folder

## Comments

* [list-comment-threads](references/reference/comments/list-comment-threads.md) - List comment threads
* [get-comment-thread](references/reference/comments/get-comment-thread.md) - Get comment thread
* [list-comment-replies](references/reference/comments/list-comment-replies.md) - List comment replies

## Users

### Users
* [list](references/reference/users/users/list.md) - List users
* [get](references/reference/users/users/get.md) - Get user
* [delete](references/reference/users/users/delete.md) - Delete user
* [update](references/reference/users/users/update.md) - Update user
* [invite](references/reference/users/users/invite.md) - Invite user

### Access Groups
* [list](references/reference/users/access-groups/list.md) - List access groups

## Ecommerce

### Products
* [list](references/reference/ecommerce/products/list.md) - List products
* [create](references/reference/ecommerce/products/create.md) - Create product
* [get](references/reference/ecommerce/products/get.md) - Get product
* [update](references/reference/ecommerce/products/update.md) - Update product
* [create-sku](references/reference/ecommerce/products/create-sku.md) - Create SKU
* [update-sku](references/reference/ecommerce/products/update-sku.md) - Update SKU

### Orders
* [list](references/reference/ecommerce/orders/list.md) - List orders
* [get](references/reference/ecommerce/orders/get.md) - Get order
* [update](references/reference/ecommerce/orders/update.md) - Update order
* [update-fulfill](references/reference/ecommerce/orders/update-fulfill.md) - Fulfill order
* [update-unfulfill](references/reference/ecommerce/orders/update-unfulfill.md) - Unfulfill order
* [refund](references/reference/ecommerce/orders/refund.md) - Refund order

### Inventory
* [update](references/reference/ecommerce/inventory/update.md) - Update inventory

### Settings
* [get-settings](references/reference/ecommerce/settings/get-settings.md) - Get ecommerce settings

## Webhooks

### Webhook Management
* [list](references/reference/webhooks/list.md) - List webhooks
* [get](references/reference/webhooks/get.md) - Get webhook
* [create](references/reference/webhooks/create.md) - Create webhook
* [delete](references/reference/webhooks/delete.md) - Delete webhook

### Webhook Events
* [form-submission](references/reference/webhooks/events/form-submission.md) - Form submission event
* [site-publish](references/reference/webhooks/events/site-publish.md) - Site publish event
* [page-created](references/reference/webhooks/events/page-created.md) - Page created event
* [page-metadata-updated](references/reference/webhooks/events/page-metadata-updated.md) - Page metadata updated
* [page-deleted](references/reference/webhooks/events/page-deleted.md) - Page deleted event
* [collection-item-created](references/reference/webhooks/events/collection-item-created.md) - Item created event
* [collection-item-changed](references/reference/webhooks/events/collection-item-changed.md) - Item changed event
* [collection-item-deleted](references/reference/webhooks/events/collection-item-deleted.md) - Item deleted event
* [collection-item-published](references/reference/webhooks/events/collection-item-published.md) - Item published event
* [collection-item-unpublished](references/reference/webhooks/events/collection-item-unpublished.md) - Item unpublished event
* [user-account-added](references/reference/webhooks/events/user-account-added.md) - User account added event
* [user-account-updated](references/reference/webhooks/events/user-account-updated.md) - User account updated event
* [user-account-deleted](references/reference/webhooks/events/user-account-deleted.md) - User account deleted event
* [ecomm-new-order](references/reference/webhooks/events/ecomm-new-order.md) - New order event
* [ecomm-order-changed](references/reference/webhooks/events/ecomm-order-changed.md) - Order changed event
* [ecomm-inventory-changed](references/reference/webhooks/events/ecomm-inventory-changed.md) - Inventory changed event
* [comment-created](references/reference/webhooks/events/comment-created.md) - Comment created event

## Enterprise Features

### Workspace Audit Logs
* [get](references/reference/enterprise/workspace-audit-logs/get.md) - Get audit logs
* [event-types](references/reference/enterprise/workspace-audit-logs/event-types.md) - Audit log event types

### Site Activity Logs
* [list](references/reference/enterprise/site-activity-logs/list.md) - List site activity logs

### Site Configuration - 301 Redirects
* [create](references/reference/enterprise/site-configuration/301-redirects/create.md) - Create redirect
* [get](references/reference/enterprise/site-configuration/301-redirects/get.md) - Get redirect
* [patch](references/reference/enterprise/site-configuration/301-redirects/patch.md) - Update redirect
* [delete](references/reference/enterprise/site-configuration/301-redirects/delete.md) - Delete redirect

### Site Configuration - Robots.txt
* [put](references/reference/enterprise/site-configuration/robots-txt/put.md) - Create/replace robots.txt
* [get](references/reference/enterprise/site-configuration/robots-txt/get.md) - Get robots.txt
* [patch](references/reference/enterprise/site-configuration/robots-txt/patch.md) - Update robots.txt
* [delete](references/reference/enterprise/site-configuration/robots-txt/delete.md) - Delete robots.txt

### Site Configuration - Well-known Files
* [delete](references/reference/enterprise/site-configuration/well-known-files/delete.md) - Delete well-known file

### Workspace Management
* [create](references/reference/enterprise/workspace-management/create.md) - Create workspace
* [update](references/reference/enterprise/workspace-management/update.md) - Update workspace
* [delete](references/reference/enterprise/workspace-management/delete.md) - Delete workspace
* [get-site-plan](references/reference/enterprise/workspace-management/get-site-plan.md) - Get site plan
