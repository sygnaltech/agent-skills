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
}

async function copyPattern(srcDir, pattern, destDir) {
  const files = await glob(pattern, { cwd: srcDir, nodir: true });
  for (const relPath of files) {
    const src = path.join(srcDir, relPath);
    const dest = path.join(destDir, relPath);
    await copyFile(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
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

  // Download references using config.source
  if (config.source && config.source.baseUrl && config.source.referencesFile) {
    const referencesTxtPath = path.join(generatorDir, config.source.referencesFile);
    const referencesOutDir = path.join(outputDir, 'references');
    const pathPrefixToRemove = config.source.pathPrefixToRemove || '';
    try {
      await ensureDir(referencesOutDir);
      const refsTxt = await fs.readFile(referencesTxtPath, 'utf8');
      const urls = refsTxt.split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'));
      for (const urlPath of urls) {
        let relPath = urlPath;
        if (pathPrefixToRemove && relPath.startsWith(pathPrefixToRemove)) {
          relPath = relPath.slice(pathPrefixToRemove.length);
          if (relPath.startsWith('/')) relPath = relPath.slice(1);
        }
        const destPath = path.join(referencesOutDir, relPath);
        await ensureDir(path.dirname(destPath));
        const fullUrl = config.source.baseUrl + urlPath;
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
      // No references.txt, skip
    }
  }

  // (removed duplicate configPath/config)

  // Copy SKILL.md if specified
  if (config.assets && config.assets.skillFile) {
    const src = path.join(generatorDir, config.assets.skillFile);
    const dest = path.join(outputDir, 'SKILL.md');
    try {
      await copyFile(src, dest);
      console.log(`Copied SKILL.md for ${skillName}`);
    } catch (e) {
      console.warn(`SKILL.md not found for ${skillName}`);
    }
  }

  // Copy solution files if specified
  if (config.assets && Array.isArray(config.assets.solutions)) {
    for (const pattern of config.assets.solutions) {
      await copyPattern(generatorDir, pattern, path.join(outputDir, 'solutions'));
    }
  }

  // Copy references if specified
  if (config.assets && Array.isArray(config.assets.references)) {
    for (const pattern of config.assets.references) {
      await copyPattern(generatorDir, pattern, path.join(outputDir, 'references'));
    }
  }

  // Add more logic here for other asset types if needed
}

module.exports = {
  runGenerator,
};

