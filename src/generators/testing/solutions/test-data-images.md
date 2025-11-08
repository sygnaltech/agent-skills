## Placeholder Image Generation Services

When to use each service:

- **Lorem Picsum** - Real photographs with advanced features (filters, specific IDs, seeded randomness)
- **LoremFlickr** - Real photographs organized by topic/keyword (e.g., "car", "nature", "technology")
- **Placehold.co** - Clean layout placeholders showing dimensions, best for wireframes and mockups

---

## Lorem Picsum (picsum.photos)

**Best for:** Realistic placeholder images with advanced features like filters, grayscale, blur, and predictable/seeded results.

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

---

## LoremFlickr (loremflickr.com)

**Best for:** Topic-specific or keyword-based placeholder images (e.g., "car", "nature", "office", "food").

### Basic URL Pattern

```
https://loremflickr.com/{width}/{height}/{keyword}
```

**Examples:**
```
https://loremflickr.com/1500/500/kitten
https://loremflickr.com/800/600/car
https://loremflickr.com/400/300/nature
https://loremflickr.com/1200/800/office
```

### Multiple Keywords

Use multiple keywords separated by commas:
```
https://loremflickr.com/800/600/ocean,sunset
```

### Use Cases

- **Product categories:** `loremflickr.com/500/500/laptop`
- **Lifestyle imagery:** `loremflickr.com/1200/800/coffee,morning`
- **Travel/location:** `loremflickr.com/800/600/paris`
- **Industry-specific:** `loremflickr.com/600/400/construction`

### Size Guidelines

- Maximum recommended: 1280 pixels per side (service limitation)
- Standard sizes: 400-1200 pixels
- Images are cached and may repeat

---

## Placehold.co

**Best for:** Clean, simple layout placeholders that display dimensions. Ideal for wireframes, design mockups, and when you need precise color control.

### Basic URL Patterns

**Square placeholder:**
```
https://placehold.co/{size}
```
Example: `https://placehold.co/400`

**Custom dimensions:**
```
https://placehold.co/{width}x{height}
```
Example: `https://placehold.co/600x400`

### Format Options

**Default is SVG.** Supported formats: **SVG**, **PNG**, **JPEG**, **GIF**, **WebP**, **AVIF**

```
https://placehold.co/600x400/png
https://placehold.co/600x400.png
```

### Color Customization

**Hex values (background/text):**
```
https://placehold.co/600x400/000000/FFF
```

**CSS color names:**
```
https://placehold.co/600x400/orange/white
```

**Transparent backgrounds:**
```
https://placehold.co/600x400/transparent/F00
```

Both background and text colors must be specified together.

### Custom Text

**Add custom text using query strings:**
```
https://placehold.co/600x400?text=Hello+World
```

**Multi-line text (use `\n`):**
```
https://placehold.co/600x400?text=Hello\nWorld
```

Default text is the image dimensions.

### Font Options

```
https://placehold.co/600x400?font=roboto
```

**Available fonts:** lato (default), lora, montserrat, noto-sans, open-sans, oswald, playfair-display, poppins, pt-sans, raleway, roboto, source-sans-pro

**Combined with text:**
```
https://placehold.co/800?text=Hello+World&font=roboto
```

### Retina Support

Append `@2x` or `@3x` for high-resolution images:
```
https://placehold.co/600x400@2x.png
https://placehold.co/800@3x.png
```

Only **PNG**, **JPEG**, **GIF**, **WebP**, and **AVIF** formats support retina images.

### Size Limits

- Maximum: 4000 x 4000 pixels
- Minimum: 10 x 10 pixels

---

## Quick Reference: When to Use Which Service

| Use Case | Service | Example URL |
|----------|---------|-------------|
| General photo placeholder | Lorem Picsum | `https://picsum.photos/800/600` |
| Consistent test image | Lorem Picsum | `https://picsum.photos/seed/test123/800/600` |
| Grayscale/blur effects | Lorem Picsum | `https://picsum.photos/800/600?grayscale&blur=3` |
| Topic-specific photos | LoremFlickr | `https://loremflickr.com/800/600/technology` |
| Layout placeholder with dimensions | Placehold.co | `https://placehold.co/800x600` |
| Wireframe with custom colors | Placehold.co | `https://placehold.co/800x600/EEE/333` |
| Branded mockup placeholder | Placehold.co | `https://placehold.co/800x600/FF6B35/FFF?text=Logo+Here` |
