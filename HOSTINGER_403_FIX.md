# Fixing 403 Forbidden Error on Hostinger

If you're seeing a 403 error after deploying to Hostinger, follow these steps in order.

## Quick Diagnosis

**403 means:** The web server found files but refused to serve them. This is usually a **permissions or ownership issue**, not a missing file problem.

## Step 1: Fix File Ownership (Most Common Fix)

Hostinger requires files to be owned by the correct user. FTP uploads often create files with wrong ownership.

**How to fix:**

1. Log in to **Hostinger hPanel**
2. Go to **Files → File Manager**
3. Navigate to `public_html/`
4. Right-click on the `public_html` folder
5. Select **"Fix Ownership"** or **"Fix Permissions"**
6. Wait for the process to complete
7. Visit your site again

**This fixes 90% of 403 errors on Hostinger.**

## Step 2: Verify File Structure

Make sure `index.html` is in the ROOT of `public_html/`, not nested in a subfolder.

**Correct structure:**
```
/public_html/
├── index.html          ← Must be here!
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
├── .htaccess
└── favicon.ico
```

**Wrong structure (causes 403):**
```
/public_html/
└── dist/               ← index.html is nested!
    └── public/
        └── index.html
```

**How to check:**
1. File Manager → `public_html/`
2. You should see `index.html` directly in the list
3. If you see a `dist/` or `build/` folder instead, the deployment path is wrong

## Step 3: Check File Permissions

Files need correct permissions to be readable by the web server.

**Correct permissions:**
- **Files** (index.html, .htaccess, etc.): `644` (rw-r--r--)
- **Directories** (public_html, assets, etc.): `755` (rwxr-xr-x)

**How to fix:**

1. File Manager → `public_html/`
2. Select all files and folders
3. Right-click → **Change Permissions**
4. Set:
   - Files: `644`
   - Folders: `755`
5. Check "Apply to subdirectories"
6. Click **Change**

## Step 4: Test .htaccess

Your `.htaccess` file might have an error that's blocking access.

**How to test:**

1. File Manager → `public_html/`
2. Find `.htaccess` (enable "Show hidden files" if needed)
3. Right-click → **Rename** to `.htaccess.bak`
4. Visit your site
   - **If it works now:** Your `.htaccess` has an error
   - **If still 403:** It's a permissions/ownership issue (go back to Step 1)

**Common .htaccess issues:**
- Syntax errors
- Incompatible directives
- Missing `RewriteEngine On`

## Step 5: Check Apache Error Logs

Hostinger provides detailed error logs that show the exact cause.

**How to access:**

1. Hostinger hPanel → **Advanced**
2. Click **Error Logs**
3. Look for recent entries with your domain
4. Common errors:
   - `Permission denied` → Fix ownership (Step 1)
   - `File does not exist` → Wrong deployment path (Step 2)
   - `Invalid command` → .htaccess error (Step 4)

## Step 6: Verify Domain Configuration

Make sure your domain is pointing to the correct directory.

**How to check:**

1. Hostinger hPanel → **Domains**
2. Find your domain (nudggg.com)
3. Check **Document Root** → Should be `/public_html`
4. If it's different, click **Manage** → Change document root

## Step 7: Clear Browser Cache

Sometimes your browser caches the 403 error.

**How to clear:**
- **Chrome:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Firefox:** Ctrl+F5
- **Safari:** Cmd+Option+R

## Step 8: Contact Hostinger Support

If none of the above works, Hostinger support can check server-side issues.

**Before contacting support, have ready:**
- Your domain name
- Screenshot of the 403 error
- Confirmation you've tried Steps 1-5
- Recent error log entries (from Step 5)

## Prevention: Automated Fix

To avoid 403 errors in the future, you can add a post-deployment script:

**Option 1: SSH Command (if you have SSH access)**
```bash
find /home/your_username/public_html -type d -exec chmod 755 {} \;
find /home/your_username/public_html -type f -exec chmod 644 {} \;
```

**Option 2: Add to GitHub Actions workflow**
```yaml
- name: Fix permissions via FTP
  run: |
    # This would require an FTP client in the workflow
    # Not recommended - use Hostinger's "Fix Ownership" instead
```

## Common Mistakes

❌ **Deploying the entire repo** → Uploads `node_modules`, `src`, etc.
✅ **Deploy only `dist/public/` contents**

❌ **Deploying to `/public_html/dist/`** → Creates nested structure
✅ **Deploy to `/public_html/` directly**

❌ **Using wrong FTP credentials** → Files owned by wrong user
✅ **Use credentials from Hostinger hPanel → FTP Accounts**

❌ **Forgetting to run "Fix Ownership"** → Files not readable
✅ **Always run "Fix Ownership" after FTP upload**

## Summary Checklist

After each deployment:

- [ ] Run "Fix Ownership" in Hostinger File Manager
- [ ] Verify `index.html` is in `/public_html/` root
- [ ] Check file permissions (644 for files, 755 for folders)
- [ ] Test `.htaccess` by temporarily disabling it
- [ ] Check Apache error logs for specific errors
- [ ] Clear browser cache and test again

**Most 403 errors on Hostinger are fixed by Step 1 (Fix Ownership).**
