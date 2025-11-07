
Update version in package.json

```
npm link
```

Check version from another project dir

```
agent-skills -v
```

Generate & test

```
agent-skills list
agent-skills generate webflow-designer-api
```

Before deployment, unlink from global npm

```
npm unlink -g @sygnal/agent-skills
```

Then publish

```
npm publish
```
