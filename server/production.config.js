// Production optimizations for Render deployment
module.exports = {
  // Memory optimization
  node: {
    max_old_space_size: 512, // Limit memory to 512MB
    max_semi_space_size: 64, // Limit semi-space to 64MB
  },

  // Environment optimizations
  env: {
    NODE_ENV: "production",
    NODE_OPTIONS: "--max-old-space-size=512 --max-semi-space-size=64",
    // Disable source maps in production
    GENERATE_SOURCEMAP: false,
  },

  // MongoDB connection optimizations
  mongodb: {
    maxPoolSize: 5, // Reduce connection pool
    serverSelectionTimeoutMS: 3000, // Faster timeout
    socketTimeoutMS: 30000,
    bufferCommands: false,
    bufferMaxEntries: 0,
  },
};
