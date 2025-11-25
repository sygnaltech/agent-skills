# Agent Notes: wfapi Project

## Project Overview
**wfapi** is a Node.js CLI tool for interacting with the Webflow API. It supports both Personal Access Tokens (PAT) and OAuth authentication, with multi-environment support.

## Key Architecture Components

### 1. Configuration System (`src/config.js`)

Configuration is stored in a file named `.wfapi` 

      
#### Global v. Local Modes 

When the CLI is being used, it is being operated either "locally" or "globally". 

- Local context is used if a `.wfapi` configuration file is found;
   - In the current directory, or any ancestor directory, where the CLI is being executed 
   - In this case the "closest" configuration file is used, even if it's empty 
- Global context is used when no such configuration file exists. 
   - Global context is stored at `~/.wfapi` 

Use local mode whenever it's available. 
If the `.wfapi` file is empty, clone the settings from the global `~/.wfapi` file so the user can edit them. 

#### Environments 

Further, there are three environments a user can select;

- PROD is the default environment, and settings at the top of the config files related to PROD 
- DEV is the secttings group in the `[DEV]` section 
- TEST is the secttings group in the `[TEST]` section 

The current environment is stored in the ENV setting within the local or global config file. 


#### Configuration Data 

There are two fundamental parts to configuration;

1. Authentication - used to connect to the Webflow API 
   - Can be an API_TOKEN (given priority)
   - Or OAuth generated OAUTH_ACCESS_TOKEN, OAUTH_REFRESH_TOKEN, and OAUTH_EXPIRES_AT
2. Context - determines the context in which API requests are executed 
   - Environment DEV, TEST, PROD (defaults to PROD)
      - Identifies what section of the config file to read
         - PROD context is at the top automatically 
         - TEST environment settings are read from the [TEST] section 
         - DEV environment settings are read from the [DEV] section
         - The currently-selected environment is stored in the top section as ENV

#### Authentication 

Tokens may exist;

- In a local config file's default PROD environment section 
- In a local config file's DEV or TEST environment sections 
- In a global config file's default PROD environment section 
- In a global config file's DEV or TEST environment sections 

The configuration system has a specific **priority order** for loading API tokens:

- Prefer local config tokens over global config tokens
- When an environment is selected, prefer that DEV or TEST environment section's tokens

In some cases, tokens may not exist, so the fallback order is;

1. Local DEV or TEST section tokens, only when an environment is selected 
2. Local PROD section tokens, whether or not an environment is selected 
3. Global DEV or TEST section tokens, only when an environment is selected 
4. Global PROD section tokens, whether or not an environment is selected 



#### Config File Format:

- Lines beginning with # are comments, and are ignored 
- Blank lines are ignored 
- May be CRLF or LF terminated lines 
- 

```
# Simple KEY=VALUE format
# Lines starting with # are comments
On each line, text that begins with (whitespace)# are comments, to the end of that line 
ENV=current_selected_environment
# Other settings at the top are in the PROD environment context 
API_TOKEN=your_token_here
SITE_ID=site_id_here
COLLECTION_ID=collection_id_here
OAUTH_ACCESS_TOKEN=token
OAUTH_REFRESH_TOKEN=token
OAUTH_EXPIRES_AT=timestamp
[DEV] indicates dev environment settings section
[TEST] indicates test environment settings section
```

#### Important `loadConfig()` Behavior:
- Returns config object with `API_TOKEN` if PAT is found
- Returns minimal config (SITE_ID/COLLECTION_ID only) if using OAuth-only
- Throws error if neither PAT nor OAuth tokens are available

### 2. Authentication System (`src/webflow-client.js`)

The `WebflowClient` class handles authentication via axios interceptor (lines 20-27).

#### Token Resolution Order (`_resolveAuthToken()`, lines 30-48):
1. **OAuth tokens FIRST** (priority)
   - Checks `getOAuthTokens()` from token-store
   - Auto-refreshes if expired
   - Returns OAuth access token if valid
2. **Personal Access Token SECOND** (fallback)
   - Uses `getToken()` from config module
   - Returns `API_TOKEN` from config
3. **Constructor parameter THIRD** (legacy)
   - Falls back to `this.apiToken` passed to constructor

**CRITICAL**: OAuth tokens take precedence over Personal Access Tokens during actual API calls, even if both are present.

### 3. OAuth Token Management (`src/token-store.js`)

- Stores OAuth tokens in config files (local or global `.wfapi[.env]`)
- Tokens include: `OAUTH_ACCESS_TOKEN`, `OAUTH_REFRESH_TOKEN`, `OAUTH_EXPIRES_AT`
- Auto-refresh happens in `webflow-client.js` when token expires
- Refresh endpoint: `https://wfapi.sygnal.com/api/v1/auth/refresh`

#### CRITICAL FIX (lines 66-111):
**Local PAT Precedence Fix**: When a local `.wfapi` (or `.wfapi.<env>`) file contains `API_TOKEN`, the `getOAuthTokens()` function now returns `null` instead of checking global OAuth tokens. This ensures local configuration takes full precedence and prevents global OAuth tokens from overriding local PAT authentication.

#### Environment Support:
- `localConfigPath()` respects current environment (lines 35-39)
- Uses lazy loading to avoid circular dependency with `config.js` (lines 5-13)
- When environment is set, returns `.wfapi.<env>` path

### 4. Environment Display System (`src/utils/env-display.js`)

**NEW**: Visual environment indicators for query commands.

- `displayEnvBadge()` - Shows colored badge if environment is active
- `getEnvBadge()` - Returns badge string for inline display
- Color mapping:
  - DEV/DEVELOPMENT: Yellow background (`\x1b[43m`)
  - STAGING/STAGE: Blue background (`\x1b[44m`)
  - PROD/PRODUCTION: Red background (`\x1b[41m`)
  - TEST: Cyan background (`\x1b[46m`)
  - QA: Magenta background (`\x1b[45m`)
  - Other: Green background (`\x1b[42m`)
- Badge format: `[bg_color][black] ENV_NAME [reset]`
- Only displays when environment is NOT default

### 5. Command Structure

All commands follow this pattern:
```javascript
displayEnvBadge();  // Show environment badge if active (NEW)
const config = loadConfig();  // Get configuration
const client = new WebflowClient(config.API_TOKEN);  // Create client (may be undefined if OAuth-only)
// Client automatically resolves best available token per request
```

Commands with environment badges:
- `sites.js` - List sites
- `cms.js` - List collections
- `items.js` - List items

### 6. Environment Commands (`src/commands/env.js`)

**NEW**: Environment management system.

Functions:
- `envShow()` - Display current environment setting
- `envSet(envName)` - Switch to specified environment
  - Validates environment config file exists (local or global)
  - Special case: `default` clears environment setting
  - Stores current environment in global `~/.wfapi` as `ENVIRONMENT=<name>`
- `getCurrentEnv()` - Get current environment from global config
- `setCurrentEnv(env)` - Set environment in global config
- `clearCurrentEnv()` - Remove environment setting (back to default)

Error handling:
- If `.wfapi.<env>` doesn't exist (local or global), shows helpful error with paths

### 7. Known Issues

#### Bug in `src/commands/config.js` (line 38):
```javascript
const maskedToken = token.substring(0, 8) + '...' + token.substring(token.length - 4);
```
This crashes when `token` is `null`/`undefined` (OAuth-only mode), causing:
```
Error: Cannot read properties of undefined (reading 'substring')
```

**Status**: Still present, not yet fixed

## Common Scenarios

### Scenario 1: Using Personal Access Token
**.wfapi file:**
```
API_TOKEN=your_pat_token_here
```
- Config loads PAT
- Client uses PAT for authentication

### Scenario 2: Using OAuth Only
**.wfapi file:**
```
OAUTH_ACCESS_TOKEN=token
OAUTH_REFRESH_TOKEN=token
OAUTH_EXPIRES_AT=timestamp
```
- Config loads with NO `API_TOKEN` property
- Client uses OAuth tokens for authentication
- OAuth tokens auto-refresh when expired

### Scenario 3: Both PAT and OAuth Present
**.wfapi file:**
```
API_TOKEN=your_pat_token_here
OAUTH_ACCESS_TOKEN=token
OAUTH_REFRESH_TOKEN=token
OAUTH_EXPIRES_AT=timestamp
```
- Config loads with `API_TOKEN` property
- **OAuth tokens take precedence** during actual API calls
- PAT is available as fallback

### Scenario 4: Local vs Global Config
- **Local `.wfapi`** overrides **global `~/.wfapi`** for token source
- If local file exists but has no `API_TOKEN`, falls through to env var → global → OAuth
- `SITE_ID`/`COLLECTION_ID` can be stored separately from token source

### Scenario 5: Using Environments (NEW)
**.wfapi (global):**
```
ENVIRONMENT=dev
```

**.wfapi.dev (local):**
```
API_TOKEN=dev_token_here
SITE_ID=dev_site_id
```

**.wfapi.prod (local):**
```
API_TOKEN=prod_token_here
SITE_ID=prod_site_id
```

Workflow:
```bash
wfapi env dev        # Switch to dev environment
wfapi sites          # Uses .wfapi.dev, shows DEV badge (yellow)

wfapi env prod       # Switch to prod environment
wfapi sites          # Uses .wfapi.prod, shows PROD badge (red)

wfapi env default    # Back to standard .wfapi
wfapi sites          # Uses .wfapi, no badge
```

- Environment setting is global (stored in `~/.wfapi`)
- Environment config files can be local or global
- Badge displays on all query commands when environment is active

## File Locations

### Configuration Files (checked in order):
1. `{cwd}/.wfapi[.env]` - Local config (environment-aware)
2. `{cwd}/.webflow-api[.env]` - Legacy local (environment-aware)
3. `~/.wfapi[.env]` - Global config (environment-aware)
4. `~/.webflow-api[.env]` - Legacy global (environment-aware)

Note: `[.env]` = `.dev`, `.staging`, `.prod`, etc. when environment is set

### Example Config:
- `.wfapi.example` - Template config file

### Key Source Files:
- `src/config.js` - Configuration loading/parsing (environment-aware)
- `src/webflow-client.js` - API client with authentication
- `src/token-store.js` - OAuth token storage (environment-aware, local PAT precedence fix)
- `src/oauth.js` - OAuth login flow
- `src/commands/config.js` - Config management commands
- `src/commands/env.js` - Environment switching (NEW)
- `src/commands/auth.js` - OAuth authentication
- `src/commands/sites.js` - List sites (with env badge)
- `src/commands/cms.js` - List collections (with env badge)
- `src/commands/items.js` - List items (with env badge)
- `src/commands/use.js` - Context management
- `src/utils/env-display.js` - Environment badge display (NEW)
- `bin/wfapi.js` - CLI entry point

## Testing Commands

```bash
# Environment management
node bin/wfapi.js env                    # Show current environment
node bin/wfapi.js env dev                # Switch to dev environment
node bin/wfapi.js env default            # Back to default

# Show current config (has a bug with OAuth-only mode)
node bin/wfapi.js config get

# Set global token
node bin/wfapi.js config set <token>

# List sites (tests authentication, shows env badge if active)
node bin/wfapi.js sites list

# Check files
cat .wfapi           # Local config (default)
cat .wfapi.dev       # Local dev config
cat ~/.wfapi         # Global config (stores ENVIRONMENT setting)
cat ~/.wfapi.dev     # Global dev config
```

## Important Notes for Debugging Token Issues

1. **Check current environment**: Run `wfapi env` - if environment is set, CLI uses `.wfapi.<env>` files
2. **Check file existence**: Local `.wfapi[.env]` takes priority even if it only has OAuth tokens
3. **Check file contents**: `API_TOKEN=` must be present for PAT mode
4. **Local PAT precedence (FIXED)**: If local config has `API_TOKEN`, global OAuth tokens are now ignored
5. **OAuth vs PAT**: OAuth tokens take precedence during actual API calls (within same config scope)
6. **Config source vs Auth source**: Different concepts
   - Config source: Where `loadConfig()` got the config from
   - Auth source: Which token type the client actually uses (OAuth > PAT within scope)
7. **Empty refresh token**: `OAUTH_REFRESH_TOKEN=` (empty) may indicate OAuth token can't be refreshed
8. **Wrong workspace**: If seeing unexpected sites/data, check:
   - Current environment setting (`wfapi env`)
   - Which config file is being used
   - Whether global OAuth tokens are overriding local PAT (should be fixed now)

## Recent Changes Summary

### Session 1: Critical Bug Fix
**Problem**: Local `.wfapi` with `API_TOKEN` was being ignored when global `~/.wfapi` had OAuth tokens, causing wrong workspace/account to be used (530 sites instead of expected sites).

**Fix**: Modified `getOAuthTokens()` in `src/token-store.js` to return `null` when local config file contains `API_TOKEN`, ensuring local PAT configuration takes full precedence over global OAuth tokens.

**Files Modified**:
- `src/token-store.js` - Added local PAT precedence check (lines 66-85)

### Session 2: Environment Support
**Feature**: Added multi-environment support for managing dev/staging/prod configurations.

**Implementation**:
- Created environment switching system (`wfapi env <name>`)
- Environment-aware config file loading (`.wfapi.<env>`)
- Visual environment badges with colored backgrounds on query commands
- Environment setting stored globally, config files can be local or global

**Files Created**:
- `src/commands/env.js` - Environment management commands
- `src/utils/env-display.js` - Colored badge display

**Files Modified**:
- `src/config.js` - Added `getCurrentEnvironment()` and environment-aware config loading
- `src/token-store.js` - Added environment awareness to `localConfigPath()`
- `src/commands/sites.js` - Added environment badge display
- `src/commands/cms.js` - Added environment badge display
- `src/commands/items.js` - Added environment badge display
- `bin/wfapi.js` - Registered env command
- `README.md` - Documented environment feature

## Recent Git History

```
af0989b Docs updates
ec02336 Added auto-column wrapping
8d516f7 Docs
2459d13 Version
8d90f24 Fixed use reports
```

Current branch: `main`
Working directory: Modified (uncommitted changes from this session)
