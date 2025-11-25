# Agent Skills

A CLI tool for generating [Claude Code](https://docs.claude.com/en/docs/claude-code) skill files from documentation sources.

This tool helps you easily create and manage `SKILL.md` files and associated documentation references for Claude Code, enabling it to understand and use external tools and APIs effectively.

## Installation

```bash
npm install -g @sygnal/agent-skills
```

## Usage

### List Available Skills

See all available documentation sources and generators:

```bash
agent-skills list
```

### Add (Learn) a Skill

Generate the skill files for a specific source. This will download documentation, create the necessary `SKILL.md` in your `.claude/skills` directory, and record the install in `.agent-skills` so you can list/update/remove it later.

```bash
agent-skills add <skill-name>
```

Example:
```bash
agent-skills add webflow-cloud
```

You can also learn multiple skills at once:
```bash
agent-skills add webflow-cloud webflow-data-api
```

> `learn` still works as an alias for `add`.

### Update Learned Skills

Re-install everything recorded in `.agent-skills`:

```bash
agent-skills update
```

### Remove a Skill

Remove skill files and drop their entry from `.agent-skills`:

```bash
agent-skills remove <skill-name>
```

## Creating New Skills

You can add your own generators by creating a new folder in `src/generators`.

See [GENERATOR.md](GENERATOR.md) for detailed instructions on:
- Generator folder structure
- `config.json` specification
- Creating `SKILL.md` templates

## License

Apache-2.0
