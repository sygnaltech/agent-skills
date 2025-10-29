/**
 * Webflow Cloud documentation generator
 *
 * This generator:
 * 1. Reads URLs from references.txt companion file
 * 2. Downloads each markdown file from developers.webflow.com
 * 3. Saves them using path segments after /webflow-cloud
 * 4. Creates folders as needed for intermediate path segments
 */

// Copyright 2025 Michael Wells
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const path = require('path');
const {
  readUrlList,
  ensureDir,
  downloadMarkdownFile,
  printSummary,
  copySkillFile,
  setupClaudeOptimization,
} = require('../../generator');

const BASE_URL = 'https://developers.webflow.com';
const URL_LIST_FILE = path.join(__dirname, 'references.txt');

/**
 * Convert URL path to file system path
 * Example: /webflow-cloud/docs/getting-started.md -> docs/getting-started.md
 */
function pathToFilePath(urlPath) {
  // Remove /webflow-cloud prefix
  const relativePath = urlPath.replace(/^\/webflow-cloud\/?/, '');
  return relativePath;
}

/**
 * Main generation function
 */
async function generate() {
  const skillDir = path.join(process.cwd(), '.claude/skills/webflow-cloud');
  const outputDir = path.join(skillDir, 'references');

  console.log('Webflow Cloud Documentation Generator');
  console.log('=====================================\n');
  console.log(`Skill directory: ${skillDir}`);
  console.log(`Output directory: ${outputDir}\n`);

  try {
    // Ensure directories exist
    ensureDir(skillDir);
    ensureDir(outputDir);

    // Step 1: Setup Claude Code optimization
    console.log('Setting up Claude Code optimization...\n');
    setupClaudeOptimization();
    console.log('');

    // Step 2: Copy SKILL.md
    console.log('Copying SKILL.md...');
    copySkillFile(__dirname, skillDir);
    console.log('');

    // Step 3: Read URLs from companion file
    console.log(`Reading URLs from ${URL_LIST_FILE}...\n`);
    const paths = readUrlList(URL_LIST_FILE);
    console.log(`Found ${paths.length} URLs:\n`);
    paths.forEach(p => console.log(`  - ${p}`));
    console.log('');

    // Step 4: Download all markdown files
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
