/**
 * Main entry point for @sygnal/webflow-agent-skills
 */

const generators = {
  'webflow-cloud': require('./generators/webflow-cloud'),
  'webflow-code-components': require('./generators/webflow-code-components'),
  'webflow-data-api': require('./generators/webflow-data-api'),
  'webflow-designer-api': require('./generators/webflow-designer-api'),
};

/**
 * Generate skill files for a specific documentation source
 * @param {string} source - The documentation source (e.g., 'webflow-cloud', 'webflow-code-components', 'webflow-data-api')
 * @returns {Promise<Object>} - Result object with success status
 */
async function generate(source) {
  if (!generators[source]) {
    throw new Error(`Unknown documentation source: ${source}. Available: ${Object.keys(generators).join(', ')}`);
  }

  const generator = generators[source];
  return await generator.generate();
}

/**
 * List available documentation sources
 * @returns {string[]} - Array of available source names
 */
function listSources() {
  return Object.keys(generators);
}

module.exports = {
  generate,
  listSources,
  generators,
};
