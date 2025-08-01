export const API_BASE_URL = "https://mentor-meet-ferb.onrender.com";

// Environment-based configuration
export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
};
