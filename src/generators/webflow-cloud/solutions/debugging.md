
# Debugging Cloud Apps

Webflow Cloud has specific logging capabilities and limitations that affect how you troubleshoot issues.

## Logging Capabilities

Webflow currently logs:

- Build process output
- Runtime errors (server-side)

Webflow does NOT log:

- Deployment errors (the step between successful build and live deployment)
- Client-side console output
- Detailed request/response data

## Troubleshooting Deployments

When a deployment fails:

1. Ask the user to copy-paste the build log for the failed build from the dashboard
2. Check for common issues:
   - D1 Drizzle migration script errors (most common)
   - Missing dependencies in package.json
   - Build script failures
   - Environment variable references that don't exist

> Note: If the build succeeds but deployment fails silently, there are no logs available. This typically indicates a Drizzle migration issue.

## Troubleshooting Application Errors

### Server-Side Errors

For server-side errors:

1. Ask the user to copy-paste the recent portion of the runtime log from the dashboard
2. Look for:
   - Unhandled exceptions
   - Database connection errors
   - Missing environment variables
   - API endpoint failures

### Client-Side Errors

For client-side errors:

1. Ask the user to copy-paste error messages from the browser console log
2. Check for:
   - Network request failures
   - JavaScript runtime errors
   - Missing client-side environment variables
   - CORS issues

## Debugging Strategies

### When Logs Are Insufficient

Since Webflow Cloud has limited logging, consider these workarounds:

1. **Add custom logging to your code**
   - Use console.log/console.error liberally during development
   - Server logs will appear in the runtime log
   - Client logs require browser console access

2. **Build a debug endpoint**
   - Create a secure API endpoint that returns diagnostic info
   - Use an ADMIN_KEY secret to protect it
   - Return environment status, database connectivity, etc.

3. **Test locally first**
   - Run your app locally with the same environment setup
   - Use local D1/KV/R2 equivalents when possible
   - Catch errors before deploying

4. **Use incremental deployments**
   - Deploy small changes frequently
   - Makes it easier to identify which change caused an issue
   - Reduces the scope of troubleshooting

### Common Error Patterns

**Build succeeds, deployment fails silently**
- Almost always a Drizzle migration issue
- Check your migration scripts for syntax errors
- Verify schema changes are compatible with existing data

**"Environment variable not defined" at runtime**
- Variable may be server-side only (not accessible to client)
- Client-side secrets may not be available during initial app start
- Check variable is properly set in dashboard

**Errors only in production, not TEST**
- Different environment variables
- Different data in D1 database
- Timing/race conditions with cloud infrastructure
