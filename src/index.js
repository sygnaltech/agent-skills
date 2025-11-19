const fs = require('fs/promises');
const path = require('path');
const { runGenerator } = require('./generator');

async function listSources() {
  const generatorsDir = path.join(__dirname, 'generators');
  const entries = await fs.readdir(generatorsDir, { withFileTypes: true });
  const sources = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const configPath = path.join(generatorsDir, entry.name, 'config.json');
      try {
        const configContent = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(configContent);
        sources.push({
          name: entry.name,
          description: config.description || ''
        });
      } catch {
        // If config is missing or invalid, still list it but without description
        // or skip it? Original logic skipped if access failed.
        // Let's keep original behavior of checking access, but now we read it.
        // If read fails, we might want to skip or list with no description.
        // Original: await fs.access(configPath); sources.push(entry.name);
        // If we can't read it, it's probably not a valid generator.
      }
    }
  }
  return sources;
}

/**
 * Generate skill files for a specific documentation source
 * @param {string} source - The documentation source (e.g., 'webflow-cloud', 'webflow-code-components', ...)
 * @returns {Promise<Object>} - Result object with success status
 */
async function generate(source) {
  const sources = await listSources();
  const sourceNames = sources.map(s => s.name);
  if (!sourceNames.includes(source)) {
    throw new Error(`Unknown documentation source: ${source}. Available: ${sourceNames.join(', ')}`);
  }
  return await runGenerator(source);
}

module.exports = {
  generate,
  listSources,
};
