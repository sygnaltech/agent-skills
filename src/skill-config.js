const fs = require('fs/promises');
const path = require('path');

const CONFIG_FILENAME = '.agent-skills';

function getConfigPath() {
  return path.join(process.cwd(), CONFIG_FILENAME);
}

async function loadSkillConfig() {
  const configPath = getConfigPath();
  try {
    const content = await fs.readFile(configPath, 'utf8');
    const parsed = JSON.parse(content);
    if (!parsed.skills || !Array.isArray(parsed.skills)) {
      return { skills: [] };
    }
    return parsed;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`Could not read ${CONFIG_FILENAME}, starting fresh: ${err.message}`);
    }
    return { skills: [] };
  }
}

async function saveSkillConfig(config) {
  const configPath = getConfigPath();
  const data = JSON.stringify({ skills: config.skills || [] }, null, 2);
  await fs.writeFile(configPath, data + '\n', 'utf8');
}

function upsertSkill(config, skillName, agentSkillsVersion) {
  const record = {
    name: skillName,
    addedAt: new Date().toISOString(),
    version: agentSkillsVersion,
  };

  const idx = (config.skills || []).findIndex(s => s.name === skillName);
  if (idx >= 0) {
    config.skills[idx] = { ...config.skills[idx], ...record };
  } else {
    config.skills.push(record);
  }
}

function removeSkill(config, skillName) {
  const before = config.skills?.length || 0;
  config.skills = (config.skills || []).filter(s => s.name !== skillName);
  return config.skills.length !== before;
}

function getSkillNameSet(config) {
  return new Set((config.skills || []).map(s => s.name));
}

module.exports = {
  getConfigPath,
  loadSkillConfig,
  saveSkillConfig,
  upsertSkill,
  removeSkill,
  getSkillNameSet,
};
