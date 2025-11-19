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

const { glob } = require('glob');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const https = require('https');

async function ensureDir(dirPath) {
  if (!dirPath) return;
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
}

async function copyPattern(srcDir, pattern, destDir) {
  const files = await glob(pattern, { cwd: srcDir, nodir: true });
  // Determine top-level segment of the pattern (if any)
  const patternTop = (pattern || '').split(/[/\\]/)[0];
  const destHasTop = patternTop && path.basename(destDir) === patternTop;
  for (const relPath of files) {
    const src = path.join(srcDir, relPath);
    // Avoid duplicating the top-level directory when dest already includes it.
    let relToWrite = relPath;
    if (destHasTop && patternTop && (relPath === patternTop || relPath.startsWith(patternTop + path.sep))) {
      relToWrite = relPath.slice(patternTop.length + (relPath.startsWith(patternTop + path.sep) ? 1 : 0));
    }
    const dest = path.join(destDir, relToWrite);
    await copyFile(src, dest);
  }
}

async function downloadFileList(baseUrl, listFilePath, destDir, stripPrefix = '') {
  try {
    await ensureDir(destDir);
    const refsTxt = await fs.readFile(listFilePath, 'utf8');
    const urls = refsTxt.split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'));

    for (const urlPath of urls) {
      let relPath = urlPath;
      if (stripPrefix && relPath.startsWith(stripPrefix)) {
        relPath = relPath.slice(stripPrefix.length);
        if (relPath.startsWith('/')) relPath = relPath.slice(1);
      }
      const destPath = path.join(destDir, relPath);
      await ensureDir(path.dirname(destPath));
      const fullUrl = baseUrl + urlPath;

      await new Promise((resolve, reject) => {
        https.get(fullUrl, res => {
          if (res.statusCode !== 200) {
            console.warn(`Failed to download ${fullUrl}: ${res.statusCode}`);
            return resolve();
          }
          const fileStream = fsSync.createWriteStream(destPath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded: ${fullUrl} -> ${destPath}`);
            resolve();
          });
        }).on('error', err => {
          console.warn(`Error downloading ${fullUrl}: ${err.message}`);
          resolve();
        });
      });
      // Small delay to be nice to the server
      await new Promise(r => setTimeout(r, 200));
    }
  } catch (e) {
    console.warn(`Failed to process download list ${listFilePath}: ${e.message}`);
  }
}

async function runGenerator(skillName) {
  const generatorDir = path.join(__dirname, 'generators', skillName);
  const outputDir = path.resolve(process.cwd(), '.claude', 'skills', skillName);

  // Load config.json
  const configPath = path.join(generatorDir, 'config.json');
  let config;
  try {
    config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  } catch (e) {
    console.error(`Could not read config.json for ${skillName}:`, e.message);
    return;
  }

  if (!config.assets || !Array.isArray(config.assets)) {
    console.warn(`No assets array found in config.json for ${skillName}`);
    return;
  }

  for (const asset of config.assets) {
    try {
      switch (asset.type) {
        case 'copyFile':
          if (asset.src && asset.dest) {
            await copyFile(
              path.join(generatorDir, asset.src),
              path.join(outputDir, asset.dest)
            );
          }
          break;

        case 'copyFolder':
          if (asset.pattern && asset.dest) {
            await copyPattern(
              generatorDir,
              asset.pattern,
              path.join(outputDir, asset.dest)
            );
          }
          break;

        case 'downloadFileList':
          if (asset.baseUrl && asset.listFile && asset.dest) {
            await downloadFileList(
              asset.baseUrl,
              path.join(generatorDir, asset.listFile),
              path.join(outputDir, asset.dest),
              asset.stripPrefix
            );
          }
          break;

        default:
          console.warn(`Unknown asset type: ${asset.type}`);
      }
    } catch (err) {
      console.error(`Error processing asset ${asset.type}:`, err.message);
    }
  }
}

module.exports = {
  runGenerator,
};
