# Nudggg Deployment Guide

This document explains how to deploy Nudggg to Hostinger using automated GitHub Actions.

## Overview

Nudggg uses a **static deployment** strategy for Hostinger:
- The Vite/React frontend is built into static files (`dist/public/`)
- GitHub Actions automatically builds and deploys to Hostinger on every push to `main`
- The backend (Express/tRPC) is NOT deployed to Hostinger (static hosting only)

## Prerequisites

1. **Hostinger Account** with FTP/SFTP access
2. **GitHub Repository** with push access
3. **Domain** pointed to Hostinger (nudggg.com)

## Setup Instructions

### 1. Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `HOSTINGER_FTP_SERVER` | Your Hostinger FTP server address | `ftp.nudggg.com` or IP address |
| `HOSTINGER_FTP_USERNAME` | Your FTP username | `u123456789` |
| `HOSTINGER_FTP_PASSWORD` | Your FTP password | Your Hostinger password |

**How to find these values:**
1. Log in to Hostinger control panel (hPanel)
2. Go to **Files → FTP Accounts**
3. Use the credentials shown there

### 2. Verify Deployment Workflow

The deployment workflow is located at `.github/workflows/deploy-hostinger.yml`.

It automatically:
1. ✅ Checks out the code
2. ✅ Installs Node.js and dependencies
3. ✅ Builds the Vite app (`pnpm run build:client`)
4. ✅ Verifies `index.html` exists in build output
5. ✅ Deploys `dist/public/` contents to Hostinger's `public_html/`
6. ✅ Cleans old files before uploading (prevents stale assets)

### 3. Deploy

**Automatic deployment:**
- Push to `main` branch → GitHub Actions automatically builds and deploys

**Manual deployment:**
- Go to GitHub → Actions → "Deploy to Hostinger" → Run workflow

### 4. Verify Deployment

After deployment completes:
1. Visit https://nudggg.com
2. Check that the site loads without 403 errors
3. Test navigation (all routes should work due to `.htaccess`)

## Local Build & Test

To test the build locally before pushing:

```bash
# Install dependencies
pnpm install

# Build the client-side app
pnpm run build:client

# Check the output
ls -la dist/public/

# You should see:
# - index.html
# - assets/ (CSS, JS files)
# - .htaccess
# - favicon.ico
```

## File Structure

```
nudggg/
├── .github/
│   └── workflows/
│       └── deploy-hostinger.yml   # Deployment workflow
├── client/
│   ├── public/
│   │   ├── .htaccess              # SPA routing config
│   │   └── favicon.ico
│   ├── src/                       # React app source
│   └── index.html
├── dist/
│   └── public/                    # Build output (deployed to Hostinger)
│       ├── index.html
│       ├── assets/
│       └── .htaccess
└── package.json
```

## Common Issues & Solutions

### 403 Forbidden Error

**Cause:** No `index.html` in the root of `public_html/`

**Solution:**
1. Check GitHub Actions logs to see if build succeeded
2. Verify `dist/public/index.html` exists after build
3. Ensure FTP credentials are correct in GitHub Secrets

### Blank Page / White Screen

**Cause:** JavaScript files not loading (incorrect base path)

**Solution:**
1. Check browser console for 404 errors
2. Verify `vite.config.ts` has correct `base` setting (should be `/`)
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Routes Don't Work (404 on /dashboard, /goals, etc.)

**Cause:** `.htaccess` not working or missing

**Solution:**
1. Verify `.htaccess` exists in `client/public/`
2. Check that Hostinger has `mod_rewrite` enabled (it should by default)
3. Contact Hostinger support if issue persists

### Deployment Fails with "Permission Denied"

**Cause:** Incorrect FTP credentials or permissions

**Solution:**
1. Verify FTP credentials in Hostinger hPanel
2. Test FTP connection using FileZilla or similar
3. Ensure `public_html/` folder has write permissions

### Old Files Not Deleted

**Cause:** `dangerous-clean-slate: true` not working

**Solution:**
1. Manually delete files in `public_html/` via Hostinger File Manager
2. Re-run deployment
3. Check GitHub Actions logs for errors

## Advanced: Staging Environment

To set up a staging environment (e.g., `staging.nudggg.com`):

1. Create a `staging` branch
2. Point `staging.nudggg.com` to a different folder (e.g., `/public_html/staging/`)
3. Duplicate `.github/workflows/deploy-hostinger.yml` as `deploy-staging.yml`
4. Change:
   - Trigger branch to `staging`
   - `server-dir` to `/public_html/staging/`
   - Add separate secrets for staging FTP if needed

## Deployment Checklist

Before deploying:
- [ ] All tests passing (`pnpm test`)
- [ ] Build succeeds locally (`pnpm run build:client`)
- [ ] GitHub Secrets configured
- [ ] Domain DNS pointed to Hostinger
- [ ] `.htaccess` exists in `client/public/`

After deploying:
- [ ] Site loads at https://nudggg.com
- [ ] No 403 errors
- [ ] All routes work (/, /dashboard, /goals, etc.)
- [ ] Assets load correctly (CSS, JS, images)
- [ ] No console errors in browser

## Support

- **GitHub Actions Logs:** Check for build/deployment errors
- **Hostinger Support:** For FTP/hosting issues
- **Browser Console:** For frontend errors

## Notes

- **This is a static deployment** - no Node.js server runs on Hostinger
- **Backend features won't work** - tRPC, database, auth require a separate backend deployment
- **For full-stack deployment**, consider Vercel, Netlify, or Railway instead
