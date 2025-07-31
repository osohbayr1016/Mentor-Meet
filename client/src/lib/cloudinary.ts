// Cloudinary configuration for client-side uploads
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Create form data for unsigned upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mentor-meet");
    formData.append("folder", "mentor-meet");

    // Upload to Cloudinary using your cloud name
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dip9rajob/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error?.message || `Upload failed: ${response.statusText}`;

      // Provide helpful error message
      if (
        errorMessage.includes("preset") ||
        errorMessage.includes("not found")
      ) {
        throw new Error(
          "Upload preset 'mentor-meet' not found. Please create it in your Cloudinary dashboard with 'Unsigned' mode."
        );
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Helper function to validate image file
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "Please select a valid image file" };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: "Image size should be less than 5MB" };
  }

  // Check file extension
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: "Please select a valid image file (JPG, PNG, GIF, WebP)",
    };
  }

  return { isValid: true };
};

// Test function to check Cloudinary connectivity
export const testCloudinaryConnection = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Create a simple test image (1x1 pixel PNG)
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 1, 1);
    }

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, "image/png");
    });

    const file = new File([blob], "test.png", { type: "image/png" });

    // Try to upload the test image
    const result = await uploadImageToCloudinary(file);

    return {
      success: true,
      message: `Cloudinary connection successful. Test image uploaded: ${result}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Cloudinary connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
