/**
 * Webflow Code Components documentation generator
 *
 * This generator:
 * 1. Reads https://developers.webflow.com/code-components/introduction.md
 * 2. Extracts all paths beginning with /code-components
 * 3. Constructs full URLs ending in .md
 * 4. Downloads each markdown file
 * 5. Saves them using path segments after /code-components
 * 6. Creates folders as needed for intermediate path segments
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://developers.webflow.com';
const INTRO_PATH = '/code-components/introduction.md';

/**
 * Fetch content from a URL
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
 * Extract all /code-components paths from markdown content
 */
function extractCodeComponentsPaths(content) {
  // Match markdown links and href attributes containing /code-components
  const patterns = [
    /\[.*?\]\((\/code-components\/[^\)]+)\)/g,  // [text](/code-components/path)
    /href=["'](\/code-components\/[^"']+)["']/g, // href="/code-components/path"
    /(?:^|\s)(\/code-components\/\S+)/gm,        // standalone paths
  ];

  const paths = new Set();

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let foundPath = match[1];

      // Remove any anchor links
      foundPath = foundPath.split('#')[0];

      // Remove query parameters
      foundPath = foundPath.split('?')[0];

      // Ensure it ends with .md
      if (!foundPath.endsWith('.md')) {
        foundPath += '.md';
      }

      paths.add(foundPath);
    }
  });

  return Array.from(paths);
}

/**
 * Convert URL path to file system path
 * Example: /code-components/getting-started.md -> getting-started.md
 */
function pathToFilePath(urlPath) {
  // Remove /code-components prefix
  const relativePath = urlPath.replace(/^\/code-components\/?/, '');
  return relativePath;
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Download and save a markdown file
 */
async function downloadMarkdownFile(urlPath, outputDir) {
  const fullUrl = `${BASE_URL}${urlPath}`;
  const filePath = pathToFilePath(urlPath);
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
 * Main generation function
 */
async function generate() {
  const outputDir = path.join(process.cwd(), '.claude/skills/webflow-code-components/references');

  console.log('Webflow Code Components Documentation Generator');
  console.log('================================================\n');
  console.log(`Output directory: ${outputDir}\n`);

  try {
    // Ensure output directory exists
    ensureDir(outputDir);

    // Step 1: Fetch introduction.md
    console.log(`Fetching introduction.md from ${BASE_URL}${INTRO_PATH}...\n`);
    const introContent = await fetchUrl(`${BASE_URL}${INTRO_PATH}`);

    // Save introduction.md
    const introFilePath = path.join(outputDir, 'introduction.md');
    fs.writeFileSync(introFilePath, introContent, 'utf8');
    console.log('✓ Saved: introduction.md\n');

    // Step 2: Extract all /code-components paths
    console.log('Extracting paths from introduction.md...');
    const paths = extractCodeComponentsPaths(introContent);
    console.log(`Found ${paths.length} paths:\n`);
    paths.forEach(p => console.log(`  - ${p}`));
    console.log('');

    // Step 3: Download all markdown files
    console.log('Downloading markdown files...\n');
    const results = [];

    for (const urlPath of paths) {
      // Skip introduction.md since we already have it
      if (urlPath === '/code-components/introduction.md') {
        continue;
      }

      const result = await downloadMarkdownFile(urlPath, outputDir);
      results.push(result);

      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Summary
    console.log('\n================================================');
    console.log('Summary:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`✓ Successfully downloaded: ${successful + 1} files (including introduction.md)`);
    if (failed > 0) {
      console.log(`✗ Failed: ${failed} files`);
      console.log('\nFailed files:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.path}: ${r.error}`);
      });
    }

    return { success: true, totalFiles: successful + 1, failed };

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

module.exports = { generate, extractCodeComponentsPaths, fetchUrl };
