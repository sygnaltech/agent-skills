---
name: wfapi
description: CLI tool for interacting with the Webflow Data API v2. Use this skill to manage sites, collections, and items directly from the command line.
---

# Webflow API CLI (wfapi)

A command-line interface for the Webflow Data API v2.

## Overview

This tool allows you to interact with Webflow sites, CMS collections, and items without writing code. It maintains context (current site, current collection) to make repeated commands easier.

## Core Capabilities

### Site Management
- List all sites
- Select a site context
- View site details

### CMS Management
- List collections in the current site
- Select a collection context
- View collection schema and fields

### Item Management
- List items in the current collection
- Get specific items by ID
- Create, update, and delete items
- Publish items

## When to Use This Skill

Activate this skill when users ask to:
- "List my Webflow sites"
- "Show me the schema for the Blog Posts collection"
- "Get the last 5 items from the Authors collection"
- "Update item ABC with new data"
- "Publish the changes to the site"

## Documentation Structure

The `references/` directory contains:
- `README.md`: General usage, installation, and command reference.
- `AGENTS.md`: Specific instructions for AI agents using this tool.

## Example Usage

```bash
# Set the API token (if not already set)
wfapi config token <your-token>

# List sites
wfapi sites list

# Select a site
wfapi site <site-id>

# List collections
wfapi cms list

# Select a collection
wfapi cms <collection-id>

# List items
wfapi items list
```
