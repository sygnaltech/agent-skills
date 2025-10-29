# Agent Skills

Generate Claude AI skill files from documentation.

## Installation

### Local Development

```bash
# From your project
npm install file:../agent-skills

# Or use npm link
cd ../agent-skills
npm link

cd ../your-project
npm link @sygnal/agent-skills
```

### From NPM (if published)

```bash
npm install @sygnal/agent-skills
```

## Usage

### CLI

```bash
# Generate Webflow Cloud documentation
npx agent-skills generate webflow-cloud

# List available sources
npx agent-skills list
```

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

### The Problem

Claude Code has two separate permission systems that don't interact:
- **Read() rules** - Block direct file reads (e.g., `"deny": ["Read(node_modules/)"]`)
- **Bash commands** - Bypass Read() rules entirely

Every `grep -r`, `find .`, or similar command scans the entire project tree, including dependencies. This can consume 85% of your context window on build artifacts and dependency code.

### The Solution

A pre-execution hook validates bash commands before they run, blocking patterns that would scan blocked directories.

**Files included:**
- `.claude/scripts/validate-bash.sh` - Validation script
- `.claude/settings.local.json` - Hook configuration

**Blocked patterns:**
- `node_modules/`
- `.env` files
- `__pycache__/`
- `.git/`
- `dist/`
- `build/`

This setup is automatically included when you install this package. The hook stops ~99% of accidental token waste from bash commands.

**Reference:** [Claude Code Best Practices Setup](https://github.com/PaschalisDim/Claude-Code-Example-Best-Practice-Setup)

## Development

### Adding New Documentation Sources

1. Create a new generator in `src/generators/<source>.js`
2. Export a `generate(options)` function
3. Add to `src/index.js` generators map

Example generator structure:

```javascript
async function generate(options = {}) {
  const outputDir = options.outputDir || './default/path';

  // Your generation logic here

  return { success: true, totalFiles: 10 };
}

module.exports = { generate };
```

## Notes

https://docs.claude.com/en/docs/claude-code/claude_code_docs_map.md

## License

MIT
