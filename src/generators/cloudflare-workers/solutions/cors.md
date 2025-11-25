# CORS and Chanfana Integration Issue

## Background

### What is Hono?
Hono is a lightweight, fast web framework for building HTTP servers on edge runtimes like Cloudflare Workers. It provides:
- Middleware support for cross-cutting concerns (auth, CORS, logging)
- Routing capabilities
- Context object (`c`) for request/response handling
- Built-in support for various content types (JSON, form data, multipart)

### What is Chanfana?
Chanfana is an OpenAPI framework that sits on top of Hono. It provides:
- Automatic OpenAPI schema generation from route definitions
- Request/response validation using Zod schemas
- Interactive API documentation
- Type-safe route handlers via the `OpenAPIRoute` class

In this project, we use `fromHono()` to wrap our Hono app and create an OpenAPI registry, then register routes with schema validation.

## The Problem

### Root Cause
When using Chanfana's OpenAPI route registration, CORS preflight OPTIONS requests were failing with **400 Bad Request** instead of returning the expected **204 No Content** with CORS headers.

### Why This Happened
The middleware execution order was:

1. **Authentication middleware** (`app.use("*", ...)`) - Skips OPTIONS requests ✓
2. **CORS middleware** (`app.use("/api/v1/forms/*", ...)`) - Attempts to handle OPTIONS ✓
3. **Chanfana route handler** (registered via `openapi.post(...)`) - **Validates request** ✗

The problem occurred at step 3. Even though the CORS middleware returned a proper 204 Response for OPTIONS requests, **Chanfana's request validation ran after the middleware** and saw that the OPTIONS request didn't match the POST schema (no body, wrong method). Chanfana then rejected the request with a 400 error, overriding the CORS middleware's response.

### Symptoms
- Browser showed: `Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present`
- Server logs showed: `OPTIONS /api/v1/forms/create-listing 400 Bad Request`
- Expected behavior: `OPTIONS /api/v1/forms/create-listing 204 No Content`

## The Solution

### Fix: Explicit OPTIONS Route Handler
Add an explicit OPTIONS route handler **before** calling `fromHono()` and registering OpenAPI routes:

```typescript
// Handle OPTIONS requests for form endpoints BEFORE OpenAPI routes
app.options("/api/v1/forms/*", async (c) => {
	const allowedOrigins = c.env.CORS_ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || [];
	const origin = c.req.header("Origin");

	// Check if origin is allowed
	let isAllowed = false;
	if (origin) {
		try {
			const originHostname = new URL(origin).hostname;
			isAllowed = allowedOrigins.some(allowed =>
				originHostname === allowed || origin === `https://${allowed}`
			);
		} catch (e) {
			isAllowed = false;
		}
	}

	if (isAllowed && origin) {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": origin,
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
				"Access-Control-Max-Age": "86400",
			}
		});
	}

	// Return 204 even if not allowed (standard CORS behavior)
	return new Response(null, { status: 204 });
});

// CORS middleware for form endpoints (still needed for actual POST requests)
app.use("/api/v1/forms/*", async (c, next) => {
	// ... existing CORS logic for POST requests ...
});

// Setup OpenAPI registry AFTER explicit OPTIONS handler
const openapi = fromHono(app, {
	docs_url: "/api/v1",
});

// Register routes
openapi.post("/api/v1/forms/create-listing", ListingCreate);
// ... other routes ...
```

### Why This Works
By registering the OPTIONS handler directly on the Hono app with `app.options()` **before** creating the OpenAPI registry:

1. Hono's router matches OPTIONS requests to the explicit handler first
2. The handler returns 204 with CORS headers immediately
3. Chanfana never sees the OPTIONS request, so it can't validate/reject it
4. The CORS middleware at `app.use()` still handles POST requests correctly

### Key Ordering Requirements
```
1. app.use("*", ...) → Authentication middleware (skips OPTIONS)
2. app.options("/api/v1/forms/*", ...) → Explicit OPTIONS handler
3. app.use("/api/v1/forms/*", ...) → CORS middleware (for POST)
4. fromHono(app, ...) → Create OpenAPI registry
5. openapi.post(...) → Register routes with schema validation
```

## Why CORS Kept Breaking

The recurring CORS issues stemmed from a fundamental mismatch between:
- **Middleware-based CORS handling** (which returns responses early)
- **Schema validation frameworks** (which validate requests before route handlers run)

Whenever we relied solely on middleware to handle OPTIONS, Chanfana's validation layer would intercept and reject the request before the middleware's response could be returned.

## Prevention

To prevent future CORS issues with OpenAPI frameworks:

1. **Always register explicit OPTIONS handlers** before OpenAPI route registration
2. **Test OPTIONS requests** separately from the actual HTTP methods
3. **Check server logs** for the exact status code returned for OPTIONS (should be 204, not 400/404)
4. **Remember**: Schema validation frameworks may intercept requests before middleware responses are honored

## Testing

### Verify OPTIONS works correctly:
```bash
curl -X OPTIONS http://127.0.0.1:8787/api/v1/forms/create-listing \
  -H "Origin: https://dev.gemmax.it" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v
```

Expected response:
- Status: `204 No Content`
- Headers include: `Access-Control-Allow-Origin: https://dev.gemmax.it`

### Verify POST still works:
```bash
curl -X POST http://127.0.0.1:8787/api/v1/forms/create-listing \
  -H "Origin: https://dev.gemmax.it" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Listing"}' \
  -v
```

Expected response:
- Status: `200 OK` (or appropriate status)
- Headers include: `Access-Control-Allow-Origin: https://dev.gemmax.it`
