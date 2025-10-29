/**
 * Shared generator utilities
 *
 * This module provides common functionality used by all documentation generators
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

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Fetch content from a URL
 * Automatically follows redirects
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirects
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusCode} ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Read URL paths from a companion .txt file
 * @param {string} urlListFile - Path to the .txt file containing URLs
 * @returns {string[]} Array of URL paths
 */
function readUrlList(urlListFile) {
  if (!fs.existsSync(urlListFile)) {
    throw new Error(`URL list file not found: ${urlListFile}`);
  }

  const content = fs.readFileSync(urlListFile, 'utf8');
  const lines = content.split('\n');

  const paths = [];
  for (let line of lines) {
    // Trim whitespace
    line = line.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) {
      continue;
    }

    // Ensure path starts with /
    if (!line.startsWith('/')) {
      console.warn(`Warning: Skipping invalid path (must start with /): ${line}`);
      continue;
    }

    // Ensure path ends with .md
    if (!line.endsWith('.md')) {
      line += '.md';
    }

    paths.push(line);
  }

  return paths;
}

/**
 * Ensure directory exists, creating it if necessary
 * @param {string} dirPath - Directory path to ensure exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Download and save a markdown file
 * @param {string} urlPath - URL path to download (e.g., /webflow-cloud/intro.md)
 * @param {string} baseUrl - Base URL (e.g., https://developers.webflow.com)
 * @param {string} outputDir - Output directory for saving files
 * @param {Function} pathTransform - Function to transform URL path to file path
 * @returns {Promise<{success: boolean, path: string, error?: string}>}
 */
async function downloadMarkdownFile(urlPath, baseUrl, outputDir, pathTransform) {
  const fullUrl = `${baseUrl}${urlPath}`;
  const filePath = pathTransform(urlPath);
  const fullFilePath = path.join(outputDir, filePath);

  console.log(`Fetching: ${fullUrl}`);

  try {
    const content = await fetchUrl(fullUrl);

    // Ensure directory exists
    const dir = path.dirname(fullFilePath);
    ensureDir(dir);

    // Save file
    fs.writeFileSync(fullFilePath, content, 'utf8');
    console.log(`✓ Saved: ${filePath}`);

    return { success: true, path: urlPath };
  } catch (err) {
    console.error(`✗ Failed: ${urlPath} - ${err.message}`);
    return { success: false, path: urlPath, error: err.message };
  }
}

/**
 * Print a summary of download results
 * @param {Array<{success: boolean, path: string, error?: string}>} results
 */
function printSummary(results) {
  console.log('\n=====================================');
  console.log('Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`✓ Successfully downloaded: ${successful} files`);
  if (failed > 0) {
    console.log(`✗ Failed: ${failed} files`);
    console.log('\nFailed files:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.path}: ${r.error}`);
    });
  }
}

/**
 * Copy SKILL.md from generator directory to skill output directory
 * Adds version and last-updated metadata to frontmatter
 * @param {string} sourceDir - Generator directory containing SKILL.md
 * @param {string} outputDir - Skill output directory (parent of references/)
 * @returns {boolean} - Success status
 */
function copySkillFile(sourceDir, outputDir) {
  const sourcePath = path.join(sourceDir, 'SKILL.md');
  const destPath = path.join(outputDir, 'SKILL.md');

  try {
    if (!fs.existsSync(sourcePath)) {
      console.warn(`Warning: SKILL.md not found at ${sourcePath}`);
      return false;
    }

    let content = fs.readFileSync(sourcePath, 'utf8');

    // Get package version
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    let version = '0.1.0'; // fallback
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      version = packageJson.version || version;
    } catch (e) {
      console.warn('⚠ Could not read package version, using default');
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Add version and last-updated to frontmatter
    // Match the frontmatter block (---\r?\n...---\r?\n) allowing for different line endings
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

    if (frontmatterMatch) {
      const existingFrontmatter = frontmatterMatch[1];

      // Check if version/last-updated already exist
      const hasVersion = /^version:/m.test(existingFrontmatter);
      const hasLastUpdated = /^last-updated:/m.test(existingFrontmatter);

      let newFrontmatter = existingFrontmatter;

      // Add version if not present
      if (!hasVersion) {
        newFrontmatter += `\nversion: ${version}`;
      }

      // Add last-updated if not present
      if (!hasLastUpdated) {
        newFrontmatter += `\nlast-updated: ${today}`;
      }

      // Replace frontmatter (preserve original line endings)
      content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, `---\n${newFrontmatter}\n---\n`);

      console.log(`  Added version: ${version}, last-updated: ${today}`);
    } else {
      console.warn('⚠ Could not find frontmatter in SKILL.md');
    }

    fs.writeFileSync(destPath, content, 'utf8');
    console.log('✓ Copied SKILL.md');
    return true;
  } catch (err) {
    console.error(`✗ Failed to copy SKILL.md: ${err.message}`);
    return false;
  }
}

/**
 * Setup Claude Code optimization scripts in user's project
 * Copies bash validation hook and merges hook config into settings.local.json
 * @returns {boolean} - Success status
 */
function setupClaudeOptimization() {
  const projectRoot = process.cwd();
  const claudeDir = path.join(projectRoot, '.claude');
  const scriptsDir = path.join(claudeDir, 'scripts');

  try {
    // Ensure directories exist
    ensureDir(claudeDir);
    ensureDir(scriptsDir);

    // Copy validate-bash.sh script
    const validateBashSource = path.join(__dirname, 'scripts', 'validate-bash.sh');
    const validateBashDest = path.join(scriptsDir, 'validate-bash.sh');

    if (fs.existsSync(validateBashSource)) {
      fs.copyFileSync(validateBashSource, validateBashDest);
      // Make executable (Unix systems)
      try {
        fs.chmodSync(validateBashDest, 0o755);
      } catch (e) {
        // Ignore chmod errors on Windows
      }
      console.log('✓ Copied validate-bash.sh');
    }

    // Merge hook configuration into settings.local.json
    const settingsDest = path.join(claudeDir, 'settings.local.json');
    const hookConfig = {
      hooks: {
        PreToolUse: [
          {
            matcher: "Bash",
            hooks: [
              {
                command: "bash .claude/scripts/validate-bash.sh"
              }
            ]
          }
        ]
      }
    };

    let settings = {};

    // Read existing settings if they exist
    if (fs.existsSync(settingsDest)) {
      try {
        const existingContent = fs.readFileSync(settingsDest, 'utf8');
        settings = JSON.parse(existingContent);
      } catch (e) {
        console.warn('⚠ Could not parse existing settings.local.json, will merge carefully');
      }
    }

    // Merge hooks configuration
    if (!settings.hooks) {
      settings.hooks = {};
    }
    if (!settings.hooks.PreToolUse) {
      settings.hooks.PreToolUse = [];
    }

    // Check if bash hook already exists
    const bashHookExists = settings.hooks.PreToolUse.some(
      hook => hook.matcher === "Bash" &&
      hook.hooks?.some(h => h.command?.includes('validate-bash.sh'))
    );

    if (!bashHookExists) {
      settings.hooks.PreToolUse.push(hookConfig.hooks.PreToolUse[0]);
      fs.writeFileSync(settingsDest, JSON.stringify(settings, null, 2), 'utf8');
      console.log('✓ Added bash validation hook to settings.local.json');
    } else {
      console.log('ℹ Bash validation hook already exists in settings.local.json');
    }

    return true;
  } catch (err) {
    console.error(`✗ Failed to setup Claude optimization: ${err.message}`);
    return false;
  }
}

module.exports = {
  fetchUrl,
  readUrlList,
  ensureDir,
  downloadMarkdownFile,
  printSummary,
  copySkillFile,
  setupClaudeOptimization,
};
