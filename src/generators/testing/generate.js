/**
 * Testing tools generator
 *
 * This generator:
 * 1. Copies the SKILL.md file to the user's .claude/skills/testing directory
 * 2. Copies solution files to the skill directory
 * 3. Sets up Claude Code optimization
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
  ensureDir,
  copySkillFile,
  copySolutionFiles,
  setupClaudeOptimization,
} = require('../../generator');

/**
 * Main generation function
 */
async function generate() {
  const skillDir = path.join(process.cwd(), '.claude/skills/testing');

  console.log('Testing Tools Generator');
  console.log('=======================\n');
  console.log(`Skill directory: ${skillDir}\n`);

  try {
    // Ensure directory exists
    ensureDir(skillDir);

    // Step 1: Setup Claude Code optimization
    console.log('Setting up Claude Code optimization...\n');
    setupClaudeOptimization();
    console.log('');

    // Step 2: Copy SKILL.md
    console.log('Copying SKILL.md...');
    copySkillFile(__dirname, skillDir);
    console.log('');

    // Step 3: Copy solution files from package to user's project
    console.log('Copying solution files to skill directory...\n');
    copySolutionFiles(__dirname, skillDir);
    console.log('');

    console.log('Testing skill setup complete!\n');
    return { success: true, totalFiles: 2 };

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

module.exports = { generate };
