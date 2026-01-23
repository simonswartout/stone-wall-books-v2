# SEO for GitHub Pages - Stone Wall Books

## ✅ What's Already Optimized for GitHub Pages

All the following work perfectly on GitHub Pages:
- ✅ Meta tags in `index.html`
- ✅ `robots.txt` in `/public`
- ✅ `sitemap.xml` in `/public`
- ✅ JSON-LD structured data
- ✅ Open Graph and Twitter Card tags

## 🚫 What to Ignore for GitHub Pages

- ❌ `.htaccess` file (GitHub Pages uses Nginx, not Apache)
- ❌ Server-side redirects (handled differently)

## 🔧 GitHub Pages Specific Configuration

### 1. Update Your URLs

Your GitHub Pages URL will be one of these formats:
- **Custom Domain:** `https://stonewallbooks.com`
- **Default GitHub Pages:** `https://[username].github.io/[repo-name]`

Update all URLs in `index.html` to match your actual GitHub Pages URL.

### 2. Configure Custom Domain (Recommended for SEO)

**Why?** Custom domains rank better than `github.io` subdomains.

**Steps:**
1. Buy a domain (e.g., `stonewallbooks.com`)
2. In your repo, go to **Settings → Pages**
3. Add your custom domain
4. Create a `CNAME` file in `/public` with your domain

**DNS Settings (at your domain registrar):**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: [username].github.io
```

### 3. Enable HTTPS in GitHub Pages

1. Go to **Settings → Pages**
2. Check **"Enforce HTTPS"** (available after custom domain is configured)
3. GitHub automatically provides SSL certificate via Let's Encrypt

### 4. Build Configuration for GitHub Pages

Update your `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Use '/' if using custom domain
  // base: '/stone-wall-books-v2/', // Use this if using github.io/repo-name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper asset handling
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})
```

### 5. GitHub Actions for Automatic Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 6. Create CNAME File (if using custom domain)

Create `/public/CNAME`:
```
stonewallbooks.com
```

This file tells GitHub Pages what custom domain to use.

### 7. Update Sitemap URLs

After you know your final URL, update `sitemap.xml`:

**If using custom domain:**
```xml
<loc>https://stonewallbooks.com/</loc>
```

**If using github.io:**
```xml
<loc>https://[username].github.io/stone-wall-books-v2/</loc>
```

### 8. GitHub Pages Specific SEO Considerations

**SPA (Single Page Application) Routing:**
GitHub Pages doesn't natively support client-side routing. For a React SPA:

**Option A: Hash Router (Easiest)**
- URLs will be: `https://stonewallbooks.com/#/catalog`
- Already works with your current setup!
- No additional configuration needed

**Option B: 404 Redirect Trick**
Create `/public/404.html` that redirects to `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Stone Wall Books</title>
    <script>
      // Redirect to index.html with the path as a query parameter
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

### 9. Performance Optimization for GitHub Pages

**Vite Build Optimization:**

Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**Image Optimization:**
- Use WebP format
- Compress images before committing
- GitHub Pages has no server-side compression, so pre-compress everything

### 10. Monitoring GitHub Pages SEO

**Google Search Console:**
1. Add your GitHub Pages URL
2. Verify using the meta tag (already in your `index.html`)
3. Submit your sitemap: `https://stonewallbooks.com/sitemap.xml`

**Check Indexing:**
- Search Google for: `site:stonewallbooks.com`
- Should show all indexed pages

### 11. GitHub Pages Limitations & Workarounds

| Limitation | Workaround |
|------------|------------|
| No server-side rendering | Use meta tags in `index.html` (✅ done) |
| No custom headers | Not needed for basic SEO |
| No server-side redirects | Use client-side redirects or hash routing |
| No .htaccess | Not needed - GitHub handles HTTPS automatically |
| 1GB size limit | Optimize images and assets |
| 100GB bandwidth/month | Usually sufficient for small sites |

### 12. Deployment Checklist for GitHub Pages

- [ ] Update `vite.config.js` with correct `base` path
- [ ] Update all URLs in `index.html` to your GitHub Pages URL
- [ ] Update `sitemap.xml` with correct URLs
- [ ] Create `CNAME` file if using custom domain
- [ ] Set up GitHub Actions workflow (`.github/workflows/deploy.yml`)
- [ ] Configure custom domain in GitHub Settings → Pages
- [ ] Update DNS records at domain registrar
- [ ] Enable "Enforce HTTPS" in GitHub Pages settings
- [ ] Build production version: `npm run build`
- [ ] Test the built site: `npm run preview`
- [ ] Push to GitHub and verify deployment
- [ ] Submit sitemap to Google Search Console
- [ ] Test with Google's Rich Results Test

### 13. Quick Deploy Commands

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview

# Deploy to GitHub Pages (if using gh-pages package)
npm install --save-dev gh-pages
npm run deploy
```

Or simply push to your main branch if using GitHub Actions.

---

## 🎯 Recommended Setup for Best SEO

1. **Use a custom domain** (e.g., `stonewallbooks.com`)
2. **Enable HTTPS** (automatic with GitHub Pages)
3. **Use GitHub Actions** for automatic deployment
4. **Keep using hash routing** (already works!)
5. **Optimize all images** before committing
6. **Submit sitemap** to Google Search Console

---

## 📊 Expected Performance on GitHub Pages

**Pros:**
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Fast CDN (GitHub's infrastructure)
- ✅ Good for static sites
- ✅ Automatic deployments

**Cons:**
- ❌ No server-side rendering (but not needed for your site)
- ❌ Limited to static files
- ❌ No custom server configuration

**SEO Impact:** GitHub Pages is perfectly fine for SEO! Many high-ranking sites use it.

---

## 🚀 Next Steps

1. Decide: Custom domain or `github.io`?
2. Update URLs in `index.html` and `sitemap.xml`
3. Set up GitHub Actions workflow
4. Deploy and test
5. Submit to Google Search Console

**Need help with any of these steps? Let me know!**
