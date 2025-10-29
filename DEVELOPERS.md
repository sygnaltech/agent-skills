
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
