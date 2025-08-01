# Deployment Guide

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# Email Configuration (for nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Cloudinary Configuration (if using)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Deployment Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build the Project:**
   ```bash
   npm run build
   ```

3. **Start the Server:**
   ```bash
   npm start
   ```

   Or use the deploy script that builds and starts:
   ```bash
   npm run deploy
   ```

## Development

For development with auto-reload:
```bash
npm run dev
```

## TypeScript Compilation

The project uses TypeScript. All TypeScript errors have been resolved:

- ✅ Missing type definitions installed
- ✅ TypeScript configuration updated
- ✅ Implicit any types fixed
- ✅ Module resolution configured

## Common Issues Fixed

1. **Missing Type Definitions:** All required `@types/*` packages are installed
2. **TypeScript Configuration:** Updated to support ES2017+ features
3. **Implicit Any Types:** Added explicit type annotations where needed
4. **Module Resolution:** Configured for Node.js environment
5. **Environment Variables:** Properly configured for deployment

## Build Output

The TypeScript compiler will generate JavaScript files in the same directory structure. The server will run the compiled JavaScript files. 