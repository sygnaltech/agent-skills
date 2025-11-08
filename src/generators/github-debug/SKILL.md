---
name: github-debug
description: Use to investigate open issues relating to specific github package issues. 
resources:
  - solutions/**/*.md
---



## How to Search Issues

Use the Bash tool to run Node.js scripts that call the GitHub API:

### Search all public GitHub issues:
```bash
node -e "
const { searchIssues } = require('./src/generators/github-debug/github-api.js');
searchIssues('your search query', { limit: 10 })
  .then(issues => console.log(JSON.stringify(issues, null, 2)))
  .catch(err => console.error(err.message));
"
```

### Search in a specific repository:
```bash
node -e "
const { searchIssues } = require('./src/generators/github-debug/github-api.js');
searchIssues('error message', { repo: 'owner/repo', limit: 10 })
  .then(issues => console.log(JSON.stringify(issues, null, 2)))
  .catch(err => console.error(err.message));
"
```

### Search with filters:
```bash
node -e "
const { searchIssues } = require('./src/generators/github-debug/github-api.js');
searchIssues('TypeError', {
  language: 'javascript',
  state: 'all',
  limit: 10
})
  .then(issues => console.log(JSON.stringify(issues, null, 2)))
  .catch(err => console.error(err.message));
"
```

### Get specific issue details:
```bash
node -e "
const { getIssue } = require('./src/generators/github-debug/github-api.js');
getIssue('owner/repo', 123)
  .then(issue => console.log(JSON.stringify(issue, null, 2)))
  .catch(err => console.error(err.message));
"
```

### Extract error pattern from stack trace:
```bash
node -e "
const { extractErrorPattern } = require('./src/generators/github-debug/github-api.js');
const errorText = \`YOUR_ERROR_TEXT_HERE\`;
console.log(extractErrorPattern(errorText));
"
```

## Workflow

When a user reports an error or bug:

1. **Extract the error signature**: Identify the key error message or type
2. **Search GitHub issues**: Use searchIssues() with relevant keywords
3. **Analyze results**: Look for:
   - Similar error messages
   - Same package/library versions
   - Matched stack traces
   - Resolution status (open vs closed)
4. **Report findings**: Present:
   - Issue title and URL
   - Current state (open/closed)
   - Key comments or workarounds
   - Version information if available
5. **Provide recommendations**: Suggest fixes, upgrades, or workarounds

## Search Tips

- **Be specific**: Use exact error messages when possible
- **Try variations**: Search multiple ways (error type, function name, symptom)
- **Filter by repo**: If you know which library is causing the issue
- **Check state**: Search closed issues for fixes, open for active problems
- **Language filter**: Narrow results to specific programming languages

## Output Format

When presenting results, format them clearly:

```
Found X relevant issues:

1. [OPEN] Issue Title (#123)
   URL: https://github.com/owner/repo/issues/123
   Summary: Brief description of the issue
   Status: Open since 2024-01-15 | 45 comments

2. [CLOSED] Similar Issue (#456)
   URL: https://github.com/owner/repo/issues/456
   Summary: Same error, fixed in v2.1.0
   Status: Closed | Fixed by PR #457
```

## Authentication (Optional)

For higher rate limits (5,000 requests/hour instead of 60), users can set:
```bash
export GITHUB_TOKEN=your_personal_access_token
```

Without authentication, searches still work but with lower rate limits.

## Common Use Cases

1. **Debugging dependency errors**: Search the package's repo for the error
2. **Build failures**: Search CI/CD related issues
3. **API errors**: Find known API bugs or breaking changes
4. **Performance issues**: Search for performance-related discussions
5. **Feature requests**: Check if a feature is already requested

## Example Interaction

User: "I'm getting 'TypeError: Cannot read property 'map' of undefined' in React"



## When to Use This Skill

Trigger this skill when users are:

- Debugging dependency errors 
- Debugging build failures 
- Dealing with unexplained behavior in specific systems 

