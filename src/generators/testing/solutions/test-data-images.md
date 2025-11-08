


## Placeholder Image Generation

Use Lorem Picsum (picsum.photos) for generating placeholder images during testing and development.

### Basic URL Patterns

**Random square image:**
```
https://picsum.photos/{size}
```
Example: `https://picsum.photos/500`

**Random sized image:**
```
https://picsum.photos/{width}/{height}
```
Example: `https://picsum.photos/800/600`

**Specific image (predictable):**
```
https://picsum.photos/id/{id}/{width}/{height}
```
- `{id}` is an integer identifier (1-1000+)
- Example: `https://picsum.photos/id/237/500/500`

**Seeded random (consistent results):**
```
https://picsum.photos/seed/{seed}/{width}/{height}
```
- `{seed}` can be any string value
- Same seed always returns same image
- Example: `https://picsum.photos/seed/mytest/400/300`

### Image Effects & Filters

Apply effects using query parameters:

**Grayscale:**
```
https://picsum.photos/600/400?grayscale
```

**Blur (amount 1-10):**
```
https://picsum.photos/600/400?blur=5
```

**Combined effects:**
```
https://picsum.photos/id/870/600/400?grayscale&blur=2
```

### File Formats

**JPEG (default):**
```
https://picsum.photos/500/500.jpg
```

**WebP:**
```
https://picsum.photos/500/500.webp
```

### Size Guidelines

- Standard test images: 500-1000 pixels
- Large images: up to 5000 pixels work reliably
- Thumbnail sizes: 100-300 pixels

### API Endpoints (Advanced)

**List available images:**
```
https://picsum.photos/v2/list?page=2&limit=30
```

**Get image metadata:**
```
https://picsum.photos/id/{id}/info
https://picsum.photos/seed/{seed}/info
```
Returns JSON with author, dimensions, and download URL.