# 🚀 Deployment Guide

## Git Repository Setup

### 1. Initial Git Setup
```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial commit - Dandeli Resort Hub

- Complete React/TypeScript e-commerce booking platform
- Clerk authentication with smart routing
- Payment integration with UPI and QR codes
- Booking management with modification workflow
- WhatsApp and Email support integration
- Responsive design with Tailwind CSS
- Professional README with comprehensive documentation"
```

### 2. GitHub Repository Creation

#### Option A: Using GitHub CLI
```bash
# Install GitHub CLI (if not already installed)
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Login to GitHub
gh auth login

# Create repository
gh repo create dandeli-resort-hub --public --description "Complete e-commerce booking platform for adventure tourism and resort accommodation"

# Add remote origin
git remote add origin https://github.com/your-username/dandeli-resort-hub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Option B: Manual GitHub Setup
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Repository name: `dandeli-resort-hub`
4. Description: "Complete e-commerce booking platform for adventure tourism and resort accommodation"
5. Select "Public" repository
6. Don't initialize with README (we already have one)
7. Click "Create Repository"

```bash
# Add remote origin (replace with your username)
git remote add origin https://github.com/your-username/dandeli-resort-hub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Environment Variables Setup

### Development (.env.local)
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Application Configuration
VITE_APP_NAME="Dandeli Resort Hub"
VITE_APP_URL=http://localhost:8081

# Contact Information
VITE_SUPPORT_EMAIL=pradhanadarsh727@gmail.com
VITE_WHATSAPP_NUMBER=918260230183
VITE_UPI_ID=8260230183@ibl

# API Configuration (for future backend integration)
VITE_API_BASE_URL=http://localhost:3000
```

### Production Environment Variables
For deployment platforms, set these environment variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key
VITE_APP_URL=https://your-domain.com
VITE_SUPPORT_EMAIL=pradhanadarsh727@gmail.com
VITE_WHATSAPP_NUMBER=918260230183
VITE_UPI_ID=8260230183@ibl
```

## Deployment Options

### 1. Vercel Deployment (Recommended)

#### Quick Deploy Button
Add this to your README for one-click deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dandeli-resort-hub)

#### Manual Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your personal account
# Link to existing project? No
# Project name: dandeli-resort-hub
# In which directory is your code located? ./
# Want to override settings? No

# For production deployment
vercel --prod
```

#### Vercel Configuration (vercel.json)
```json
{
  "name": "dandeli-resort-hub",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. Netlify Deployment

#### Option A: Git Integration
1. Go to [Netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy site

#### Option B: Manual Upload
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages Deployment

#### Add Deploy Action (.github/workflows/deploy.yml)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}
        VITE_SUPPORT_EMAIL: ${{ secrets.VITE_SUPPORT_EMAIL }}
        VITE_WHATSAPP_NUMBER: ${{ secrets.VITE_WHATSAPP_NUMBER }}
        VITE_UPI_ID: ${{ secrets.VITE_UPI_ID }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Source: Deploy from a branch
4. Branch: gh-pages
5. Folder: / (root)

## Post-Deployment Checklist

### 1. Functionality Testing
- [ ] Authentication (login/signup) works
- [ ] Cart functionality is working
- [ ] Payment flow completes successfully
- [ ] Booking creation and management works
- [ ] Email notifications are sent
- [ ] WhatsApp integration opens correctly
- [ ] All pages load without errors
- [ ] Mobile responsiveness is maintained

### 2. Performance Optimization
- [ ] Lighthouse score > 90
- [ ] Images are optimized
- [ ] Bundle size is reasonable
- [ ] Page load times are fast

### 3. SEO & Meta Tags
- [ ] Page titles are descriptive
- [ ] Meta descriptions are set
- [ ] Open Graph tags for social sharing
- [ ] Favicon is properly configured

### 4. Security & Best Practices
- [ ] Environment variables are secure
- [ ] No sensitive data in client-side code
- [ ] HTTPS is enabled
- [ ] CORS is properly configured

## Custom Domain Setup

### 1. Purchase Domain
- Recommended: Namecheap, GoDaddy, or Google Domains
- Suggested domains: `dandeliresorthub.com`, `adventuredandeli.com`

### 2. Configure DNS
For Vercel:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 3. SSL Certificate
Most deployment platforms (Vercel, Netlify) provide automatic SSL certificates.

## Monitoring & Analytics

### 1. Add Google Analytics
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Monitoring
Consider adding Sentry for error tracking:
```bash
npm install @sentry/react
```

## Backup Strategy

### 1. Database Backup
- Export booking data regularly
- Store in secure cloud storage

### 2. Code Backup
- GitHub provides automatic backup
- Consider additional git remotes for redundancy

## Update Workflow

### 1. Development Process
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# Merge after review
# Deploy automatically via CI/CD
```

### 2. Hotfix Process
```bash
# For urgent fixes
git checkout main
git checkout -b hotfix/urgent-fix
# Make fix and deploy immediately
git push origin hotfix/urgent-fix
# Create PR and merge
```

---

## Need Help?

- 📧 Email: pradhanadarsh727@gmail.com
- 📱 WhatsApp: [+91 8260230183](https://wa.me/918260230183)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/dandeli-resort-hub/issues)
