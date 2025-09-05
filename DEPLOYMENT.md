# Mentor Meet - Deployment Guide

## Render Deployment Configuration

### Issue Fixed

The deployment was failing because Render was looking for the compiled JavaScript file at the wrong path:

- **Expected by Render**: `/opt/render/project/src/server/dist/index.js`
- **Actual location**: `/opt/render/project/server/dist/index.js`

### Solution

1. **Root package.json**: Created a root package.json to manage the monorepo structure
2. **Render configuration**: Added render.yaml for proper deployment configuration
3. **Build script**: Created build.sh for consistent builds

### Render Service Configuration

When setting up your Render service, use these settings:

#### Build Command

```bash
cd server && npm install && npm run build
```

#### Start Command

```bash
cd server && npm start
```

#### Root Directory

Leave empty (default) or set to project root

#### Environment Variables

- `NODE_ENV`: `production`
- `NODE_OPTIONS`: `--max-old-space-size=512`
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Will be set automatically by Render

### Alternative: Using render.yaml

If you prefer to use the render.yaml configuration file, make sure to:

1. Upload the render.yaml file to your repository root
2. Select "Infrastructure as Code" when creating the service
3. The configuration will be automatically applied

### Project Structure

```
mentor-meet/
├── client/          # Next.js frontend
├── server/          # Express.js backend
│   ├── dist/        # Compiled JavaScript (generated)
│   ├── src/         # TypeScript source files
│   └── package.json # Server dependencies
├── package.json     # Root package.json (monorepo management)
├── render.yaml      # Render deployment configuration
└── build.sh         # Build script
```

### Build Process

1. Install server dependencies: `cd server && npm install`
2. Compile TypeScript: `npm run build`
3. Start server: `npm start`

The compiled JavaScript files will be in `server/dist/` directory.

### Troubleshooting

If you still encounter issues:

1. **Check build logs**: Ensure the build command completes successfully
2. **Verify file paths**: Make sure the start command points to the correct dist/index.js
3. **Environment variables**: Ensure all required environment variables are set
4. **Memory limits**: The configuration includes memory optimization for Render's free tier

### Local Testing

To test the build process locally:

```bash
# From project root
cd server
npm install
npm run build
npm start
```

The server should start on port 8000 (or the PORT environment variable).
