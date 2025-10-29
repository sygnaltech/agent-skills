/**
 * Webflow Designer API documentation generator
 *
 * This generator:
 * 1. Reads URLs from references.txt companion file
 * 2. Downloads each markdown file from developers.webflow.com
 * 3. Creates folders as needed for intermediate path segments
 */

const path = require('path');
const {
  readUrlList,
  ensureDir,
  downloadMarkdownFile,
  printSummary,
  copySkillFile,
} = require('../../generator');

const BASE_URL = 'https://developers.webflow.com';
const URL_LIST_FILE = path.join(__dirname, 'references.txt');

/**
 * Convert URL path to file system path
 * Example: /designer/reference/getting-started.md -> reference/getting-started.md
 */
function pathToFilePath(urlPath) {
  // Remove /designer/ prefix
  const relativePath = urlPath.replace(/^\/designer\/?/, '');
  return relativePath;
}

/**
 * Main generation function
 */
async function generate() {
  const skillDir = path.join(process.cwd(), '.claude/skills/webflow-designer-api');
  const outputDir = path.join(skillDir, 'references');

  console.log('Webflow Designer API Documentation Generator');
  console.log('=============================================\n');
  console.log(`Skill directory: ${skillDir}`);
  console.log(`Output directory: ${outputDir}\n`);

  try {
    // Ensure directories exist
    ensureDir(skillDir);
    ensureDir(outputDir);

    // Step 1: Copy SKILL.md from package to user's project
    console.log('Copying SKILL.md to skill directory...\n');
    copySkillFile(__dirname, skillDir);

    // Step 2: Read URLs from companion file
    console.log(`Reading URLs from ${URL_LIST_FILE}...\n`);
    const paths = readUrlList(URL_LIST_FILE);
    console.log(`Found ${paths.length} URLs:\n`);
    paths.forEach(p => console.log(`  - ${p}`));
    console.log('');

    // Step 3: Download all markdown files
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
