---
name: notion-api
description: Documentation for the Notion API. Use this skill when users ask about integrating with Notion, building Notion integrations, working with pages, databases, blocks, comments, files, or using Notion's MCP (Model Context Protocol) for AI tools.
resources:
  - references/**/*.md
  - solutions/**/*.md
---

# Notion API Documentation

This skill provides comprehensive documentation for building integrations with the Notion API. Learn how to programmatically interact with Notion workspaces, pages, databases, and content blocks.

## Core Concepts

### Architecture Overview

The Notion API is a REST API that allows you to:

- **Read and write pages** - Create, retrieve, update, and archive pages
- **Query databases** - Filter, sort, and paginate database entries
- **Manipulate blocks** - Add, update, and delete content blocks within pages
- **Search content** - Find pages and databases across workspaces
- **Manage comments** - Create and retrieve comments on pages and blocks
- **Handle files** - Upload and retrieve file attachments

**Key constraint:** Notion uses a custom JSON format for rich text, NOT Markdown. This provides precise control over formatting including colors, underlines, callouts, toggles, and equations that Markdown cannot represent.

### Object Hierarchy

```
Workspace
├── Pages (top-level content containers)
│   ├── Blocks (content units: paragraphs, headings, lists, etc.)
│   │   └── Rich Text (formatted text with annotations)
│   └── Child Pages
└── Databases (structured collections)
    ├── Properties (column definitions)
    └── Pages (database entries/rows)
```

### Key Objects

| Object | Description |
|--------|-------------|
| **Page** | Container for content, can exist standalone or in a database |
| **Database** | Structured collection with typed properties (columns) |
| **Block** | Unit of content (paragraph, heading, list item, toggle, etc.) |
| **Rich Text** | Formatted text with annotations (bold, italic, color, links) |
| **Property** | Database column definition with type and configuration |
| **User** | Workspace member with profile information |

## Authentication

### Integration Types

1. **Internal Integrations** - For your own workspace, uses a single API token
2. **Public Integrations** - For distribution, uses OAuth 2.0 flow

### Quick Start (Internal Integration)

1. Go to [notion.so/my-integrations](https://notion.so/my-integrations)
2. Create a new integration for your workspace
3. Copy the "Internal Integration Secret"
4. Share pages/databases with your integration (required for access)

### API Headers

```
Authorization: Bearer {integration_token}
Notion-Version: 2022-06-28
Content-Type: application/json
```

**For detailed OAuth flows and token management, refer to `references/docs/authorization.md`.**

## Important Constraints

### Rich Text is JSON, Not Markdown

Notion chose custom JSON over Markdown because:

- Markdown lacks support for underlines, colored text, callouts, toggles, equations
- JSON enables pagination for large pages
- More precise control over complex document structures

**Example rich text structure:**
```json
{
  "rich_text": [
    {
      "type": "text",
      "text": { "content": "Hello ", "link": null },
      "annotations": { "bold": false, "italic": false, "color": "default" }
    },
    {
      "type": "text",
      "text": { "content": "World", "link": null },
      "annotations": { "bold": true, "italic": false, "color": "red" }
    }
  ]
}
```

### Rate Limits

- **3 requests per second** per integration (average)
- Respect `Retry-After` headers on 429 responses
- Use pagination for large datasets (`start_cursor`, `page_size`)

### Access Control

- Integrations can only access pages/databases explicitly shared with them
- Parent pages must be shared to access child content
- Workspace-level access requires admin authorization

### Block Types

Not all block types are fully supported via API. Check `references/reference/block.md` for:
- Supported block types for reading
- Supported block types for creation
- Read-only block types

## Common Operations Quick Reference

### Create a Page

```http
POST https://api.notion.com/v1/pages

{
  "parent": { "database_id": "..." },
  "properties": {
    "Name": { "title": [{ "text": { "content": "New Page" } }] }
  }
}
```

### Query a Database

```http
POST https://api.notion.com/v1/databases/{database_id}/query

{
  "filter": {
    "property": "Status",
    "select": { "equals": "Done" }
  },
  "sorts": [
    { "property": "Created", "direction": "descending" }
  ]
}
```

### Append Blocks to Page

```http
PATCH https://api.notion.com/v1/blocks/{page_id}/children

{
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "type": "text", "text": { "content": "Hello World" } }]
      }
    }
  ]
}
```

### Search

```http
POST https://api.notion.com/v1/search

{
  "query": "meeting notes",
  "filter": { "property": "object", "value": "page" }
}
```

**For complete API reference, see `references/reference/` directory.**

## MCP Integration (Model Context Protocol)

Notion provides official MCP support for AI tools like Claude, ChatGPT, and Cursor.

### What MCP Enables

- Read pages and databases from your workspace
- Create and update content programmatically
- Search across your Notion workspace
- Manage comments and discussions

### Supported Tools

Key MCP tools include:
- `notion_search` - Search pages and databases
- `notion_retrieve_page` - Get page content
- `notion_query_database` - Query database entries
- `notion_create_page` - Create new pages
- `notion_append_block_children` - Add content to pages
- `notion_create_comment` - Add comments

### Security Best Practices

- Use read-only tokens when write access isn't needed
- Limit integration access to specific pages/databases
- Review MCP client permissions before authorizing
- Audit integration activity regularly

**For MCP setup and configuration, refer to:**
- `references/docs/mcp.md`
- `references/docs/get-started-with-mcp.md`
- `references/docs/mcp-supported-tools.md`

## Document Structure Map

### Guides

#### [getting-started](references/docs/getting-started.md)
- API overview and first steps

#### [create-a-notion-integration](references/docs/create-a-notion-integration.md)
- Creating your first integration

#### [authorization](references/docs/authorization.md)
- OAuth flows and token management

#### [working-with-page-content](references/docs/working-with-page-content.md)
- Reading and writing page blocks

#### [working-with-databases](references/docs/working-with-databases.md)
- Database queries, filters, and sorts

#### [working-with-files-and-media](references/docs/working-with-files-and-media.md)
- File uploads and retrieval

### MCP Documentation

#### [mcp](references/docs/mcp.md)
- MCP overview for AI integrations

#### [get-started-with-mcp](references/docs/get-started-with-mcp.md)
- Setup guide for MCP clients

#### [mcp-supported-tools](references/docs/mcp-supported-tools.md)
- Available MCP tools reference

#### [mcp-security-best-practices](references/docs/mcp-security-best-practices.md)
- Security recommendations

### API Reference - Objects

#### [block](references/reference/block.md)
- Block types and structure

#### [rich-text](references/reference/rich-text.md)
- Rich text format specification

#### [page](references/reference/page.md)
- Page object structure

#### [database](references/reference/database.md)
- Database object and properties

#### [property-object](references/reference/property-object.md)
- Property type definitions

### API Reference - Operations

#### [post-page](references/reference/post-page.md)
- Create a page

#### [retrieve-a-page](references/reference/retrieve-a-page.md)
- Get page by ID

#### [patch-page](references/reference/patch-page.md)
- Update page properties

#### [post-database-query](references/reference/post-database-query.md)
- Query database entries

#### [patch-block-children](references/reference/patch-block-children.md)
- Append blocks to page

#### [post-search](references/reference/post-search.md)
- Search workspace content

### API Reference - Core

#### [authentication](references/reference/authentication.md)
- Auth methods and headers

#### [request-limits](references/reference/request-limits.md)
- Rate limiting details

#### [status-codes](references/reference/status-codes.md)
- Error codes and handling

#### [versioning](references/reference/versioning.md)
- API version management

## When to Use This Skill

Activate this skill when users ask about:

- "How do I create a Notion integration?"
- "Query a Notion database with filters"
- "Add content to a Notion page via API"
- "Set up Notion MCP for Claude/ChatGPT"
- "Notion API authentication and OAuth"
- "Upload files to Notion"
- "Search across Notion workspace"
- "Notion webhooks and event handling"
- "Rich text formatting in Notion API"
- Any Notion API or integration development questions

## Best Practices Summary

### API Usage

- Always include `Notion-Version` header
- Handle pagination for large result sets
- Implement exponential backoff for rate limits
- Cache frequently accessed data

### Content Handling

- Use the rich text JSON format correctly
- Validate block types before creation
- Handle nested blocks appropriately
- Preserve formatting when updating content

### Security

- Store API tokens securely (never in code)
- Use minimum required permissions
- Share only necessary pages with integrations
- Audit integration access regularly

### Performance

- Batch operations where possible
- Use database queries with filters vs. fetching all
- Implement cursor-based pagination
- Cache page/database metadata
