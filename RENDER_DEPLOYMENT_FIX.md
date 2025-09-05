# Render Deployment Fix - Step by Step

## The Problem

Your Render service is looking for the compiled JavaScript file at:

```
/opt/render/project/src/server/dist/index.js
```

But the actual file is located at:

```
/opt/render/project/server/dist/index.js
```

## The Solution

I've created a smart start script that automatically finds the correct path for your compiled JavaScript file. Here's how to fix your deployment:

### Step 1: Update Your Render Service Settings

1. **Go to your Render dashboard**
2. **Click on your service**
3. **Go to the "Settings" tab**
4. **Update the following fields:**

   **Build Command:**

   ```bash
   cd server && npm install && npm run build
   ```

   **Start Command:**

   ```bash
   cd server && node start.js
   ```

   **Root Directory:** Leave empty (or set to `/`)

### Step 2: Deploy the Changes

1. **Commit and push your changes** to your repository
2. **Trigger a new deployment** in Render (or it will auto-deploy if you have auto-deploy enabled)

### Step 3: Monitor the Deployment

The new start script will:

- ✅ Automatically find the correct path for `dist/index.js`
- ✅ Show detailed logging of where it's looking
- ✅ Start the server with the correct file path
- ✅ Handle different deployment scenarios

## What I've Fixed

### 1. Created Smart Start Script (`server/start.js`)

- Automatically searches for `dist/index.js` in multiple possible locations
- Provides detailed logging to help debug path issues
- Handles different deployment scenarios

### 2. Updated Package.json

- Changed start script to use the new smart start script
- Simplified the path resolution

### 3. Updated Render Configuration

- Updated `render.yaml` to use the new start script
- Ensured proper build and start commands

## Expected Output

When the deployment works, you should see logs like:

```
🚀 Starting Mentor Meet Server...
📁 Current working directory: /opt/render/project/server
🔍 Looking for index.js in the following locations:
  1. /opt/render/project/server/dist/index.js
  2. /opt/render/project/server/dist/index.js
  ...
✅ Found index.js at: /opt/render/project/server/dist/index.js
🎯 Starting server with: node --max-old-space-size=512 /opt/render/project/server/dist/index.js
```

## Alternative: Manual Render Configuration

If you prefer to set the configuration manually in Render:

1. **Build Command:** `cd server && npm install && npm run build`
2. **Start Command:** `cd server && node start.js`
3. **Root Directory:** Leave empty
4. **Node Version:** 18 or higher

## Troubleshooting

If you still get errors:

1. **Check the build logs** - make sure the build completes successfully
2. **Check the start logs** - the new script will show exactly where it's looking for files
3. **Verify environment variables** - ensure MONGODB_URI and other required vars are set
4. **Check file permissions** - ensure the start.js file is executable

## Files Modified

- `server/package.json` - Updated start script
- `server/start.js` - New smart start script
- `render.yaml` - Updated deployment configuration
- `package.json` - Root package.json for monorepo management

The deployment should now work correctly! 🎉
