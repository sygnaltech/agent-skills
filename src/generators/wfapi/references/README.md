# Webflow API CLI


[![WFAPI Docs](https://img.shields.io/badge/Docs-WFAPI-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://wfapi.sygnal.com/)
[![Webflow Data API](https://img.shields.io/badge/Webflow_Data_API-v2.0.0-4353FF?style=for-the-badge&logo=webflow&logoColor=white)](https://developers.webflow.com/data/v2.0.0)


A command-line interface tool for interacting with the Webflow Data API, designed especially for developers and integrators. 

- Find site ID's easily, by site name 
- Find collection ID's 
- Find collection items and examine their data 
- Examine collection structure for Name to internal field name mappings 
- Supports both global and local (folder-specific) configurations 
- Supports DEV, TEST, and PROD configurations to easily jump between multiple environments 

> WFAPI is primarily designed for humans, but has proven incredibly useful for LLM use and for automated unit / integration testing as part of a CI/CD pipeline. 

## Installation

Install globally (recommended for end users):

```bash
npm install -g @sygnal/wfapi
```

This installs the `wfapi` command on your PATH.

## Configuration

You can configure your Webflow API token in multiple ways. The CLI checks for configuration in this priority order:

1. Local `.wfapi` file (ancestor directory search) — highest priority
2. Environment variable `WEBFLOW_API_TOKEN`
3. Global `.wfapi` file (home directory) — lowest priority

### Configuration File Format

The `.wfapi` configuration file supports multiple environments using section-based configuration:

```ini
# Webflow API Configuration
# This is the PROD section (default)
API_TOKEN=your_production_token
SITE_ID=your_prod_site_id
COLLECTION_ID=your_prod_collection_id

[DEV]
API_TOKEN=your_dev_token
SITE_ID=your_dev_site_id
COLLECTION_ID=your_dev_collection_id

[TEST]
API_TOKEN=your_test_token
SITE_ID=your_test_site_id
COLLECTION_ID=your_test_collection_id
```

### Environments

The CLI supports multiple environments (PROD, DEV, TEST) within a single configuration file:

```bash
wfapi env                # Show current environment
wfapi env dev            # Switch to dev environment
wfapi env test           # Switch to test environment
wfapi env prod           # Switch back to production
```

When an environment is active:
- Configuration values from `[DEV]` or `[TEST]` sections override the PROD section
- A colored badge displays at the top and bottom of command output:
  - **DEV**: Yellow background
  - **TEST**: Cyan background
  - **PROD**: No badge (default)
- The current environment is stored in the config file as `ENV=<name>`
- Both local and global configs support environments

Example workflow:
```bash
# Create a local config with multiple environments
cat > .wfapi << EOF
API_TOKEN=prod_token_here
SITE_ID=prod_site_id

[DEV]
API_TOKEN=dev_token_here
SITE_ID=dev_site_id
EOF

# Switch to dev environment
wfapi env dev

# All commands now use DEV section values
wfapi sites              # Shows DEV badge with yellow background

# Switch back to production
wfapi env prod
```

#### Temporary override

> In some cases, you may need to compare different environments side-by-side in your IDE. To do this, you can override the current wfapi project-level environment setting on the command line. 

Use `--env <name>` on core commands (`sites`, `cms`, `items`, `schema`, `use`) to run against a specific environment for a single call without changing the saved ENV setting.

```bash
wfapi items --raw --env test     # same as --env=test
wfapi sites --recent --env=dev
```

### Configuration Management Commands

#### Set Global Token

Use the config command to set a global token:

```bash
wfapi config set your_api_token_here
```

#### Create Local Config

Copy your global config to the current directory for project-specific configuration:

```bash
wfapi config local
```

This command:
- Copies `~/.wfapi` to `./.wfapi`
- Errors if `.wfapi` already exists in the current directory
- Allows you to customize the local config for your project

#### View Current Configuration

```bash
wfapi config get         # Show current token and source
wfapi config show        # Alias of get
```

#### Delete Global Configuration

```bash
wfapi config delete
```

### Option 2: Environment Variable

Set the `WEBFLOW_API_TOKEN` environment variable:

PowerShell:

```powershell
$env:WEBFLOW_API_TOKEN="your_api_token_here"
```

Command Prompt:

```cmd
set WEBFLOW_API_TOKEN=your_api_token_here
```

Bash/Linux/Mac:

```bash
export WEBFLOW_API_TOKEN=your_api_token_here
```

### Option 3: Local Config File

Create a `.wfapi` file in your project directory:

```ini
# Webflow API Configuration
API_TOKEN=your_actual_api_token_here
```

The CLI will search up the directory tree to find the nearest `.wfapi` file, making it easy to have project-specific configurations.

You can get your API token from Webflow Dashboard > Account > Integrations. Give it readonly Site and CMS permissions only.

### Comments in Configuration Files

Configuration files support inline comments using `#`:

```ini
API_TOKEN=your_token_here  # Your Webflow API token
SITE_ID=abc123def456       # My Site Name (my-site-slug)
```

When using the `use` command to set context, the CLI automatically adds helpful comments:

```bash
wfapi use site my-site
wfapi use cms blog-posts
```

Results in:
```ini
SITE_ID=abc123def456 # My Site Name (my-site-slug)
COLLECTION_ID=xyz789abc123 # Blog Posts (blog-posts)
```

## Usage

### Commands Overview

**Core Commands:**
- `wfapi sites [filter]` — List sites; optional text `filter` matches display name or short name
  - Options: `--recent` (past week, newest first), `--raw` (JSON output)
- `wfapi cms [filter]` — List collections for the selected site
- One-off overrides (no persistence): `--site <id|slug>` for site, `--cms <id|slug>` for collection on supported commands
- `wfapi items [filter]` — List items for selected collection; supports item ID lookup or text filter
  - Options: `--recent` (past week, newest first), `--raw` (JSON output)
  - Item ID format: 24 hex characters (e.g., `68f96ae125de65a9b3e59f95`)
- `wfapi schema` — Show schema/fields for the selected collection
- Most commands accept `--env <name>` to override the saved environment for a single call
- `wfapi use` — Show current context (site and collection, if set)
  - `use site <siteId|shortName>` — Set site context
  - `use cms <collectionId|slug>` — Set collection context for current site

**Configuration Commands:**
- `wfapi config <subcommand>` — Manage auth token configuration
  - `set <token>` — Set global API token
  - `get` — Show current token and source
  - `show` — Alias of get
  - `delete` — Delete global configuration file
  - `local` — Copy global config to current directory

**Environment Commands:**
- `wfapi env [name]` — Set or show current environment
  - No argument: show current environment
  - With name: switch to that environment (prod, dev, test)

**Authentication Commands:**
- `wfapi login [scope]` — Authenticate via OAuth (when available)
- `wfapi logout` — Remove stored OAuth tokens
- `wfapi auth show` — Show authentication status and token expiry

Run `wfapi --help` or `wfapi <command> --help` for inline help.

### Login (OAuth)

> **IMPORTANT: The login feature is currently unavailable, until the Webflow App is approved.**
> For now, create your tokens manually.

Scope: local vs global

- `wfapi login local` saves OAuth tokens to `./.wfapi` (project-local).
- `wfapi login` (or `wfapi login global`) saves tokens to `~/.wfapi` (user-global).
- Precedence when reading tokens: `./.wfapi` > `~/.wfapi` > legacy `~/.webflow-api`.
- Tip: add `.wfapi` to your project's `.gitignore`.

### List Sites

```bash
wfapi sites              # all sites
wfapi sites "partial"    # text filter on name/short name
wfapi sites --recent     # only sites from past week
wfapi sites --raw        # JSON output
wfapi sites "partial" --recent --raw
```

Displays: display name, short name, site ID, and a primary custom URL.

### Context: Site and Collection

Show current context:

```bash
wfapi use
```

Set site context by ID or short name:

```bash
wfapi use site 68f81168c2a32ba4ce25cfc3
# or by short name
wfapi use site my-site-name
```

Set collection context by ID or slug (requires site context):

```bash
wfapi use cms blog-posts
wfapi use cms 6611b3f9f3b1f1e2c0a12345
```

- If using a local `.wfapi` in the current directory or ancestor, values are saved there.
- Otherwise they are saved to your global `.wfapi` in your home directory.
- The CLI automatically adds helpful comments with names and slugs.

### List CMS Collections

Requires site context:

```bash
wfapi cms              # all collections
wfapi cms blog         # filter by name/slug
```

Lists each collection's name, slug, and ID.

### List Items

Requires both site and collection context:

```bash
wfapi items                        # all items
wfapi items partial                # text filter on name/slug
wfapi items "partial text"         # text filter on name/slug
wfapi items 68f96ae125de65a9b3e59f95  # direct item ID lookup
wfapi items --recent               # only items from past week
wfapi items --raw                  # JSON output
wfapi items "partial" --recent --raw
```

**Item ID Lookup:**
When you provide a 24-character hex string (e.g., `68f96ae125de65a9b3e59f95`), the CLI recognizes it as an item ID and performs a direct lookup instead of filtering all items. This is faster and more precise.

### View Collection Schema

Requires collection context:

```bash
wfapi schema
```

Displays:
- Collection name, slug, and field count
- For each field:
  - **Name** — Display name as seen in Webflow Designer
  - **Slug** — API field name
  - **Type** — Field type (PlainText, RichText, Image, Reference, etc.)
  - **Constraints** — Validation rules including:
    - `required` — Field is required
    - `min: N` / `max: N` — String length or numeric value limits
    - `precision: N` — Decimal precision for numbers
    - `format: X` — Format type (e.g., integer, email)
    - `pattern: X` — Regex pattern validation
    - `ref: ID` — Reference to another collection
    - `refs: ID1, ID2` — Multi-reference collection IDs

Example output:
```
Collection: Blog Posts
Slug: blog-posts
Fields: 15

Name                           Slug                      Type                 Constraints
------------------------------ ------------------------- -------------------- --------------------------------------------------
Title                          name                      PlainText            max: 256
Slug                           slug                      PlainText            max: 256, pattern: [a-z0-9-]+
Published Date                 published-date            DateTime             required
Category                       blog-category             Reference            ref: 5be38bc78a520b5be72380ca
Content                        post-body                 RichText             required
Featured                       featured                  Switch
```

## API Reference

This CLI uses the Webflow Data API v2: https://developers.webflow.com/reference

## License

ISC
