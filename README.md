# Agent Skills

Generates Claude AI skill files, reference materials & solutions for your project from current online documentation.  We intend to support other agent types similarly in the future. 

## Available Skills

| Skill | Description | Use When |
|-------|-------------|----------|
| **webflow-data-api** | Comprehensive documentation for the Webflow Data API (v2.0.0) covering REST API operations including sites, CMS collections, items, pages, forms, ecommerce, webhooks, users, assets, custom code, and enterprise features | Working with Webflow's REST API, managing CMS content, handling webhooks, or building integrations |
| **webflow-designer-api** | Webflow Designer Extension API documentation for building apps that extend the Webflow Designer, programmatically manipulating elements, styles, components, variables, pages, and assets | Creating Designer Extensions, building custom Designer tools, or automating design workflows |
| **webflow-code-components** | Documentation for building and deploying React code components to Webflow via DevLink, including component props, slots, styling Shadow DOM components, and bundling | Developing React components for Webflow, working with DevLink, or creating reusable interactive components |
| **webflow-cloud** | Expert guidance for developing React apps for Webflow Cloud platform, covering deployment, environment configuration, data storage (SQLite, key-value, object storage), and troubleshooting | Deploying apps to Webflow Cloud, setting up databases, or configuring cloud environments |
| **testing** | Testing tools and tips for setting up testing frameworks, including strategies for generating test data and valid test image URLs for unit and integration testing | Setting up test frameworks, generating test data, or improving test coverage |

### Under R&D

| Skill | Description | Use When |
|-------|-------------|----------|
| **github-debug** | Tools for investigating open GitHub issues related to specific package errors and bugs using GitHub API integration | Debugging dependency errors, investigating build failures, or researching known issues in packages | 

## Installation

From your project directory;

### From NPM

```bash
npm install -g @sygnal/agent-skills
```


## Usage

### CLI

Then install the individual skills you need for your project;

```bash
# List available sources
npx agent-skills list

# Generate Webflow Code Components skill & documentation
npx agent-skills generate webflow-code-components

# Generate Webflow Data API skill & documentation
npx agent-skills generate webflow-data-api

# Generate Webflow Designer API skill & documentation
npx agent-skills generate webflow-designer-api

# Generate Webflow Cloud skill & documentation
npx agent-skills generate webflow-cloud
```

### Why Skills? 

- Token efficient, using progressive 
- Automatically invoked 



### Programmatic API

```javascript
const { generate } = require('@sygnal/agent-skills');

// Generate with default output directory
await generate('webflow-cloud');

```

### NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "skills:update": "webflow-skills generate webflow-cloud"
  }
}
```

Then run:

```bash
npm run skills:update
```

## Available Documentation Sources

- `webflow-cloud` - Webflow Cloud platform documentation
- `webflow-code-components` - Webflow Code Components documentation
- `webflow-data-api` - Webflow Data API (v2.0.0) documentation
- `webflow-designer-api` - Webflow Designer Extension API documentation

## Claude Code Performance Optimization

This project includes a bash validation hook to prevent Claude Code from wasting tokens on unnecessary file reads in `node_modules`, `.git`, and other large directories.

Based on the following [Reddit post](https://www.reddit.com/r/ClaudeAI/comments/1oh95lh/claude_code_usage_limit_hack/). 

### The Problem

Claude Code has two separate permission systems that don't interact:
- **Read() rules** - Block direct file reads (e.g., `"deny": ["Read(node_modules/)"]`)
- **Bash commands** - Bypass Read() rules entirely

Every `grep -r`, `find .`, or similar command scans the entire project tree, including dependencies. This can consume 85% of your context window on build artifacts and dependency code.

### The Solution

A pre-execution hook validates bash commands before they run, blocking patterns that would scan blocked directories.

**What gets installed:**
- `.claude/scripts/validate-bash.sh` - Validation script that checks commands
- `.claude/settings.local.json` - Bash hook configuration (merged with existing settings)

**Blocked patterns:**
- `node_modules/`
- `.env` files
- `__pycache__/`
- `.git/`
- `dist/`
- `build/`

**Installation:**

The optimization is automatically set up when you run any generator for the first time:

```bash
npx agent-skills generate webflow-cloud
```

This will:
1. Copy `validate-bash.sh` to `.claude/scripts/`
2. Add the bash validation hook to your `.claude/settings.local.json` (without overwriting existing settings)

If you already have a `settings.local.json` file, the hook will be merged into your existing configuration. The setup is idempotent - running it multiple times won't create duplicate hooks.

The hook stops ~99% of accidental token waste from bash commands.

**Reference:** [Claude Code Best Practices Setup](https://github.com/PaschalisDim/Claude-Code-Example-Best-Practice-Setup)

## Notes

We download current documentation into a references directory beneath each skill. 

There is a ToC structure in the SKILL.md which is based on Claude's own documentation hierarchy. 

https://docs.claude.com/en/docs/claude-code/claude_code_docs_map.md

## License

Apache 2.0 - See [LICENSE.md](LICENSE.md) for details
