# Creating Generator SKILL.md Files

This document explains how to create `SKILL.md` files for each generator to make them functional Claude Code skills.

To generate a SKILLS.md file for a generator; 

- Run the generator to retrieve the files, they will be in the references directory beneath .claude directory. 
- READ the files to create the content bullet points needed to support the ToC 
- Links will be project-relative links to each of those reference files 
- The purpose is for Claude to easily identify what each file contains and decide where to find what it needs BEFORE opening any files. 

## Generator Folder Structure

Each generator in `src/generators/` must have the following structure:

```
src/generators/<generator-name>/
├── config.json        # ← Required: Generator configuration
├── SKILL.md           # ← Required: Skill definition template
├── references.txt     # ← Optional: List of URLs to download
├── solutions/         # ← Optional: Solution templates to copy
│   └── *.md
└── references/        # ← Optional: Static reference files to copy
    └── *.md
```

## Config.json Specification

The `config.json` file defines how the generator behaves.

```json
{
  "name": "generator-name",
  "description": "Brief description shown in CLI list command",
  "assets": [
    {
      "type": "copyFile",
      "src": "SKILL.md",
      "dest": "SKILL.md"
    },
    {
      "type": "copyFolder",
      "pattern": "solutions/**/*.md",
      "dest": "solutions"
    },
    {
      "type": "downloadFileList",
      "baseUrl": "https://docs.example.com",
      "listFile": "references.txt",
      "stripPrefix": "/docs",
      "dest": "references"
    }
  ]
}
```

### Fields

- **name** (Required): The unique name of the generator. Should match the folder name.
- **description** (Required): A short description of what the generator does. This is displayed when users run `agent-skills list`.
- **assets** (Required): An array of asset operations to perform.
  - **copyFile**: Copies a single file.
    - `src`: Source path relative to generator folder.
    - `dest`: Destination path relative to skill folder.
  - **copyFolder**: Copies files matching a glob pattern.
    - `pattern`: Glob pattern to match files.
    - `dest`: Destination directory.
  - **downloadFileList**: Downloads files listed in a text file.
    - `baseUrl`: Base URL for downloads.
    - `listFile`: File containing list of relative paths.
    - `stripPrefix`: (Optional) Prefix to remove from downloaded paths.
    - `dest`: Destination directory.

## Overview

Each generator downloads documentation to `.claude/skills/<generator-name>/references/`, but Claude needs a `SKILL.md` file in the skill folder to understand what the documentation covers and when to activate the skill.

## File Structure

```
.claude/skills/
├── <generator-name>/
│   ├── SKILL.md           # ← Required: Skill definition
│   └── references/        # ← Generated: Downloaded docs
│       └── *.md
```

## SKILL.md Format

Every `SKILL.md` file must follow this structure:

```markdown
---
name: skill-name-lowercase
description: Brief description of what this skill covers and when to use it. Include key topics, API names, and trigger keywords users might mention.
---

# Skill Title

Brief introduction explaining what this skill provides.

## Overview

High-level description of the documentation coverage.

## Core Documentation Areas

### Topic Area 1
Brief description of what's covered.

### Topic Area 2
- Sub-topic A
- Sub-topic B
- Sub-topic C

### Topic Area 3
More organized topics...

## When to Use This Skill

Activate this skill when users ask about:
- "Specific example question 1"
- "Specific example question 2"
- "Keyword or API name"
- Any other trigger phrases

## Documentation Structure

The `references/` directory contains markdown files organized by [describe organization]. Claude will automatically discover and load relevant documentation based on your specific question.

## Best Practices

- Best practice 1
- Best practice 2
- Best practice 3

## Related Skills

For related capabilities, see:
- `other-skill-name` - Description
- `another-skill-name` - Description
```

## Key Components Explained

### 1. YAML Frontmatter (Required)

```yaml
---
name: skill-name-lowercase
description: Brief description...
---
```

**Purpose**:
- `name`: Unique identifier for the skill (must match folder name)
- `description`: Critical for Claude's discovery - should include:
  - What the skill covers
  - Key topics and APIs
  - Trigger keywords users might say
  - When to use this vs other skills

**Example**:
```yaml
description: Comprehensive documentation for the Webflow Cloud platform. Use this skill when users ask about Webflow authentication, site management, pages, CMS collections, forms, assets, webhooks, publishing, or any Webflow Cloud API operations.
```

### 2. Core Documentation Areas

**Purpose**: Provide a semantic map of what's available (like the [Claude Code docs map](https://docs.claude.com/en/docs/claude-code/claude_code_docs_map.md))

**Structure**:
- Organize by **topic/concept**, not file paths
- Use hierarchical grouping (main topics with sub-topics)
- Brief descriptions for each area
- Helps Claude understand what documentation exists

**DO NOT** list individual file paths - Claude discovers files automatically.

**Example**:
```markdown
### Authentication & Authorization
- API key generation and management
- OAuth 2.0 flows
- Token-based authentication
- Scopes and permissions

### Sites & Workspaces
- Site creation and configuration
- Workspace management
- Domain and hosting settings
```

### 3. When to Use This Skill

**Purpose**: Provide explicit examples of user queries that should trigger this skill

**Guidelines**:
- Include actual example questions in quotes
- Use keywords and terminology users would naturally say
- Cover common use cases
- Help Claude distinguish between related skills

**Example**:
```markdown
## When to Use This Skill

Activate this skill when users ask about:
- "How do I authenticate with Webflow?"
- "Create a new page in Webflow"
- "Add CMS items programmatically"
- Any Webflow Cloud platform API operations
```

### 4. Related Skills

**Purpose**: Help users discover related capabilities

**Format**: List other skills with brief descriptions of how they differ

**Example**:
```markdown
## Related Skills

For other Webflow capabilities, see:
- `webflow-code-components` - Custom component development
- `webflow-data-api` - Data API v2.0 operations
- `webflow-designer-api` - Designer extension development
```

## Process for Creating SKILL.md

### Step 1: Research the Documentation

1. Review the `references.txt` file for the generator
2. Browse the actual documentation on developers.webflow.com
3. Identify the main topic areas and concepts
4. Note common terminology and keywords

### Step 2: Define the Skill

1. Choose a clear, descriptive name (lowercase, hyphenated)
2. Write a comprehensive description that includes:
   - What the documentation covers
   - Key APIs, features, or concepts
   - Trigger keywords users might mention
   - How it differs from related skills

### Step 3: Create the Topic Map

1. Organize documentation into logical topic areas
2. Use a hierarchical structure (main topics → sub-topics)
3. Provide brief descriptions for each area
4. Think about how users would conceptually organize this information
5. **Do NOT list file paths** - describe concepts instead

### Step 4: Define Trigger Examples

1. Write 5-10 example questions users might ask
2. Use natural language (how real users would phrase it)
3. Include key terminology and API names
4. Cover different types of queries (how-to, what-is, troubleshooting)

### Step 5: Add Context

1. Document any best practices
2. Note prerequisites or common gotchas
3. Link to related skills
4. Provide any other helpful context

### Step 6: Test the Skill

1. Commit `.claude/skills/<generator-name>/SKILL.md` to git
2. Ask Claude questions that should trigger this skill
3. Verify Claude discovers and uses the documentation
4. Refine the description and trigger examples if needed

## Example: Webflow Cloud

See [.claude/skills/webflow-cloud/SKILL.md](.claude/skills/webflow-cloud/SKILL.md) for a complete working example.

### What Makes It Effective

1. **Comprehensive description** in frontmatter mentioning all major topics
2. **Organized topic areas** grouped semantically (Auth, Sites, CMS, etc.)
3. **Clear trigger examples** with quoted phrases users might say
4. **Related skills** listed with descriptions
5. **No file paths** - focuses on concepts, not implementation details

## Tips for Success

### ✅ DO:
- Write descriptions from the user's perspective
- Include synonyms and variations of terminology
- Organize topics conceptually, not by file structure
- Provide concrete example questions
- Keep the topic map high-level (not exhaustive)
- Think about what makes this skill unique

### ❌ DON'T:
- List every file in references/
- Use only technical jargon
- Assume users know internal terminology
- Make the description too generic
- Forget to update when adding new documentation

## Updating Existing Skills

When you add new URLs to `references.txt`:

1. Run the generator to download new documentation
2. Review the new content
3. Update the `SKILL.md` if needed:
   - Add new topic areas if major new concepts were added
   - Update the description if the scope changed
   - Add new trigger examples for the new content
4. Commit changes to git

## Related Documentation

- [WEBFLOW.md](WEBFLOW.md) - Generator architecture and usage
- [Claude Code Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills) - Official Claude Code skills guide
- [.claude/skills/webflow-cloud/SKILL.md](.claude/skills/webflow-cloud/SKILL.md) - Working example
