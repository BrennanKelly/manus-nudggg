# Quick Setup Instructions for Hostinger Deployment

## Framework Detected: **Vite** ✓
- Build command: `pnpm run build:client`
- Output directory: `dist/public/`

## Step 1: Add GitHub Secrets

Go to your GitHub repository and add these secrets:

**Settings → Secrets and variables → Actions → New repository secret**

Add these **4 secrets**:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `FTP_SERVER` | Your Hostinger FTP server address | `ftp.nudggg.com` or `123.45.67.89` |
| `FTP_USERNAME` | Your FTP username | `u123456789` or `your_username` |
| `FTP_PASSWORD` | Your FTP password | `your_secure_password` |
| `FTP_PORT` | FTP port (optional, defaults to 21) | `21` |

**Optional secrets:**

| Secret Name | Description | Default Value |
|-------------|-------------|---------------|
| `FTP_REMOTE_DIR` | Remote directory path | `/public_html/` |
| `FTP_STAGING_DIR` | Staging directory path | `/public_html/staging/` |

### Where to Find FTP Credentials:

1. Log in to **Hostinger hPanel**
2. Go to **Files → FTP Accounts**
3. Copy the server, username, and password shown there

## Step 2: Push Workflow Files to GitHub

The workflow files are ready but need to be pushed from your local machine:

```bash
# Pull latest code
git pull origin main

# Verify workflow files exist
ls -la .github/workflows/

# You should see:
# - deploy-hostinger.yml
# - deploy-staging.yml

# Push to GitHub
git push origin main
```

## Step 3: Trigger Deployment

Once secrets are configured and workflows are pushed:

**Automatic deployment:**
- Push any code to `main` branch → Deploys to production
- Push to `staging` branch → Deploys to staging environment

**Manual deployment:**
1. Go to GitHub → **Actions** tab
2. Select "Deploy to Hostinger"
3. Click "**Run workflow**"
4. Select branch and click "Run workflow"

## Step 4: Verify Deployment

After deployment completes (2-3 minutes):

✅ Visit https://nudggg.com
✅ Check that site loads without 403 errors
✅ Test navigation (/, /dashboard, /goals, etc.)
✅ Open browser console to check for errors

## What the Workflow Does

1. ✅ Checks out code from GitHub
2. ✅ Installs Node.js 22 and pnpm
3. ✅ Runs `pnpm install --frozen-lockfile`
4. ✅ Builds with `pnpm run build:client`
5. ✅ Verifies `index.html` exists in `dist/public/`
6. ✅ **Cleans remote directory** (removes old files)
7. ✅ Uploads `dist/public/` contents to Hostinger via FTP
8. ✅ **Preserves `.htaccess`** for SPA routing

## Troubleshooting

### Deployment fails with "Connection refused"
- ✅ Verify `FTP_SERVER` is correct (check Hostinger hPanel)
- ✅ Ensure FTP port is 21 (or set `FTP_PORT` secret)
- ✅ Test FTP connection with FileZilla

### Deployment fails with "Login incorrect"
- ✅ Double-check `FTP_USERNAME` and `FTP_PASSWORD`
- ✅ Ensure no extra spaces in secret values
- ✅ Reset FTP password in Hostinger if needed

### Site still shows 403 after deployment
- ✅ Check GitHub Actions logs for errors
- ✅ Verify `FTP_REMOTE_DIR` points to correct folder
- ✅ Ensure `public_html/` has write permissions
- ✅ Check that `index.html` exists in remote directory

### Routes don't work (404 on /dashboard)
- ✅ Verify `.htaccess` was uploaded
- ✅ Check that `mod_rewrite` is enabled on Hostinger
- ✅ See `DEPLOYMENT.md` for `.htaccess` troubleshooting

## Files Deployed

The workflow uploads these files from `dist/public/`:

```
public_html/
├── index.html          # Main HTML file
├── assets/             # JS, CSS, fonts
│   ├── index-*.js
│   ├── index-*.css
│   └── ...
├── .htaccess           # SPA routing config
└── favicon.ico         # Site icon
```

## Security Notes

- ✅ **Never commit FTP credentials** to the repository
- ✅ Always use GitHub Secrets for sensitive data
- ✅ Workflow files are safe to commit (they reference secrets, not actual values)
- ✅ `dangerous-clean-slate: true` removes old files but preserves `.htaccess`

## Next Steps

1. ✅ Configure GitHub Secrets (see Step 1)
2. ✅ Push workflow files to GitHub
3. ✅ Trigger deployment (push to main or manual)
4. ✅ Verify site loads at nudggg.com
5. 🎉 Celebrate! Your site auto-deploys on every push!

For detailed documentation, see `DEPLOYMENT.md`.
