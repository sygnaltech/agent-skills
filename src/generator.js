/**
 * Shared generator utilities
 *
 * This module provides common functionality used by all documentation generators
 */

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

module.exports = {
  fetchUrl,
  readUrlList,
  ensureDir,
  downloadMarkdownFile,
  printSummary,
};
