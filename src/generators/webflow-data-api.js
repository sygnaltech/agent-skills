/**
 * Webflow Data API documentation generator
 *
 * This generator:
 * 1. Reads URLs from webflow-data-api.txt companion file
 * 2. Downloads each markdown file from developers.webflow.com
 * 3. Saves them using path segments after /data/v2.0.0/
 * 4. Creates folders as needed for intermediate path segments
 */

const path = require('path');
const {
  readUrlList,
  ensureDir,
  downloadMarkdownFile,
  printSummary,
} = require('../generator');

const BASE_URL = 'https://developers.webflow.com';
const URL_LIST_FILE = path.join(__dirname, 'webflow-data-api.txt');

/**
 * Convert URL path to file system path
 * Example: /data/v2.0.0/reference/rest-introduction.md -> reference/rest-introduction.md
 */
function pathToFilePath(urlPath) {
  // Remove /data/v2.0.0/ prefix
  const relativePath = urlPath.replace(/^\/data\/v2\.0\.0\/?/, '');
  return relativePath;
}

/**
 * Main generation function
 */
async function generate() {
  const outputDir = path.join(process.cwd(), '.claude/skills/webflow-data-api/references');

  console.log('Webflow Data API Documentation Generator');
  console.log('=========================================\n');
  console.log(`Output directory: ${outputDir}\n`);

  try {
    // Ensure output directory exists
    ensureDir(outputDir);

    // Step 1: Read URLs from companion file
    console.log(`Reading URLs from ${URL_LIST_FILE}...\n`);
    const paths = readUrlList(URL_LIST_FILE);
    console.log(`Found ${paths.length} URLs:\n`);
    paths.forEach(p => console.log(`  - ${p}`));
    console.log('');

    // Step 2: Download all markdown files
    console.log('Downloading markdown files...\n');
    const results = [];

    for (const urlPath of paths) {
      const result = await downloadMarkdownFile(urlPath, BASE_URL, outputDir, pathToFilePath);
      results.push(result);

      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Summary
    printSummary(results);

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    return { success: true, totalFiles: successful, failed };

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

module.exports = { generate };
