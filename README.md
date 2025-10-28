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

## License

MIT
