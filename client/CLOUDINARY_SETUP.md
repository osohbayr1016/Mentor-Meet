# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in the Mentor Meet application.

## Prerequisites

1. A Cloudinary account (sign up at https://cloudinary.com/)
2. Your Cloudinary cloud name: `dip9rajob`

## Setup Steps

### 1. Create Upload Preset (REQUIRED)

**This step is essential to fix the "Upload preset not found" error.**

1. **Go to your Cloudinary Dashboard**: https://cloudinary.com/console
2. **Navigate to**: Settings > Upload
3. **Scroll down to**: "Upload presets" section
4. **Click**: "Add upload preset"
5. **Configure the preset with these exact settings**:
   - **Preset name**: `mentor-meet` (exactly as shown)
   - **Signing Mode**: `Unsigned` (this is important!)
   - **Folder**: `mentor-meet`
   - **Allowed formats**: `image/*`
   - **Resource type**: `Image`
6. **Click**: "Save" to create the preset

### 2. Enable the Upload Preset

After creating the preset:

1. Make sure the preset is **enabled** (toggle should be green)
2. The preset should appear in your list of upload presets

### 3. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the profile creation page
3. Try uploading an image
4. Check the browser console for any errors

## How It Works

The application uses Cloudinary's direct upload API for client-side image uploads:

- ✅ **URL**: `https://api.cloudinary.com/v1_1/dip9rajob/image/upload`
- ✅ **Upload Preset**: `mentor-meet`
- ✅ **Folder**: `mentor-meet`
- ✅ **Security**: Unsigned uploads (no API secrets exposed)

## Troubleshooting

### Common Issues

1. **"Upload preset not found" error**

   - Make sure the upload preset "mentor-meet" exists in your Cloudinary account
   - Ensure the preset is set to "Unsigned" mode
   - Check that the preset name is exactly "mentor-meet" (case-sensitive)
   - Verify the preset is enabled

2. **CORS errors**

   - This should not happen with unsigned uploads, but if it does, check your Cloudinary settings

3. **"Invalid file" error**
   - Check that the file is an image (JPG, PNG, GIF, WebP)
   - Ensure the file size is under 5MB

### File Size Limits

- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- Images are automatically optimized by Cloudinary

## Security Notes

- The upload preset is set to "unsigned" for client-side uploads
- All uploads are validated for file type and size before being sent to Cloudinary
- No API keys are exposed to the client

## Additional Configuration

The image upload function includes:

- Automatic file validation
- File size checking
- File type validation
- Error handling with user-friendly messages
- Loading states during upload

For more information, visit the [Cloudinary documentation](https://cloudinary.com/documentation).
