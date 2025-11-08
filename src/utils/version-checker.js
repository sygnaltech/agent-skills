/**
 * Check if a newer version is available and prompt for update
 */

const https = require('https');
const { execSync } = require('child_process');
const readline = require('readline');

/**
 * Fetch the latest version from npm registry
 * @param {string} packageName - The package name (e.g., '@sygnal/agent-skills')
 * @returns {Promise<string>} - The latest version
 */
function fetchLatestVersion(packageName) {
  return new Promise((resolve, reject) => {
    const url = `https://registry.npmjs.org/${packageName.replace('/', '%2F')}/latest`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version);
        } catch (err) {
          reject(new Error('Failed to parse npm registry response'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Compare two semver version strings
 * @param {string} current - Current version (e.g., '0.1.7')
 * @param {string} latest - Latest version (e.g., '0.2.0')
 * @returns {boolean} - True if latest is newer than current
 */
function isNewerVersion(current, latest) {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (latestParts[i] > currentParts[i]) return true;
    if (latestParts[i] < currentParts[i]) return false;
  }

  return false;
}

/**
 * Prompt user for input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} - The user's response
 */
function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Update the package globally using npm
 * @param {string} packageName - The package name
 */
function updatePackage(packageName) {
  try {
    console.log(`\nUpdating ${packageName}...`);
    execSync(`npm install -g ${packageName}@latest`, { stdio: 'inherit' });
    console.log('\n✓ Update completed successfully!\n');
    return true;
  } catch (err) {
    console.error('\n✗ Update failed:', err.message);
    console.error('You can manually update with: npm install -g', packageName);
    return false;
  }
}

/**
 * Check for updates and prompt user to update if available
 * @param {string} packageName - The package name
 * @param {string} currentVersion - The current version
 * @param {Object} options - Options object
 * @param {boolean} options.silent - If true, don't show messages when up to date
 * @returns {Promise<boolean>} - True if updated, false otherwise
 */
async function checkAndUpdate(packageName, currentVersion, options = {}) {
  try {
    const latestVersion = await fetchLatestVersion(packageName);

    if (isNewerVersion(currentVersion, latestVersion)) {
      console.log(`\n⚠️  A newer version of ${packageName} is available!`);
      console.log(`   Current: v${currentVersion}`);
      console.log(`   Latest:  v${latestVersion}\n`);

      const answer = await promptUser('Would you like to update now? (Y/n): ');

      if (answer === 'y' || answer === 'yes' || answer === '') {
        const success = updatePackage(packageName);
        if (success) {
          console.log('Please run your command again to use the updated version.');
          process.exit(0);
        }
        return success;
      } else {
        console.log(`\nSkipping update. Run 'npm install -g ${packageName}' to update later.\n`);
        return false;
      }
    } else {
      if (!options.silent) {
        console.log(`✓ You're running the latest version (v${currentVersion})\n`);
      }
      return false;
    }
  } catch (err) {
    // Silently fail - don't block the user if version check fails
    // (e.g., no internet connection, npm registry down)
    return false;
  }
}

module.exports = {
  checkAndUpdate,
  fetchLatestVersion,
  isNewerVersion,
};
