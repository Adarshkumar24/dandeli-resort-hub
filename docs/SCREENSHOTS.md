# 📸 Screenshot Guidelines

## Taking Professional Screenshots

To create professional screenshots for the README, follow these guidelines:

### 1. Browser Setup
- Use Chrome or Firefox for consistent rendering
- Set browser window to 1920x1080 resolution
- Hide bookmarks bar and dev tools
- Use clean browser profile without extensions

### 2. Screenshot Dimensions
- **Desktop**: 1920x1080 (Full HD)
- **Mobile**: 375x812 (iPhone X equivalent)
- **Tablet**: 768x1024 (iPad equivalent)

### 3. Required Screenshots

#### Homepage (`homepage.png`) ✅
- Navigate to: `http://localhost:8081/`
- Capture: Full page including hero section with camping theme
- Ensure: All images are loaded and animations are complete

#### Accommodation Page (`accommodation.png`) ✅
- Navigate to: `http://localhost:8081/accommodation`
- Capture: Room listings with pricing and features
- Show: Multiple room options with clear pricing

#### Activities Page (`activities.png`) ✅
- Navigate to: `http://localhost:8081/activities`
- Capture: Activity cards with booking options and ratings
- Include: River rafting, wildlife safari, and other activities

### 4. Image Optimization
- Save as PNG for clarity
- Compress images to reduce file size
- Use descriptive filenames
- Maximum file size: 1MB per image

### 5. Tools for Screenshots
- **macOS**: Cmd+Shift+4 (area selection)
- **Windows**: Windows+Shift+S
- **Browser**: Developer tools device emulation
- **Third-party**: CleanShot X, Snagit, or similar

### 6. Editing Guidelines
- Add subtle shadows or borders if needed
- Crop unnecessary browser chrome
- Maintain original aspect ratios
- Use consistent styling across all images

## Screenshot Checklist

Before uploading screenshots, ensure:

- [ ] All images are high quality (1920x1080 for desktop)
- [ ] Text is clearly readable
- [ ] All UI elements are properly loaded
- [ ] Colors are accurate and vibrant
- [ ] No personal information is visible
- [ ] File sizes are optimized
- [ ] Filenames match README references

## Example Screenshot Script

You can use this script to capture screenshots automatically:

```bash
# Install puppeteer for automated screenshots
npm install --save-dev puppeteer

# Run screenshot script
node scripts/capture-screenshots.js
```

## After Taking Screenshots

1. Save all images in `docs/screenshots/` directory
2. Update README.md image paths if needed
3. Test that all images load correctly in GitHub
4. Commit screenshots with descriptive messages
