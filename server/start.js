#!/usr/bin/env node

// Start script that handles different deployment scenarios
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🚀 Starting Mentor Meet Server...");
console.log("📁 Current working directory:", process.cwd());
console.log("📁 __dirname:", __dirname);

// Possible paths for the compiled index.js
const possiblePaths = [
  path.join(__dirname, "dist", "index.js"),
  path.join(process.cwd(), "dist", "index.js"),
  path.join(process.cwd(), "server", "dist", "index.js"),
  path.join(process.cwd(), "src", "server", "dist", "index.js"),
  "./dist/index.js",
  "dist/index.js",
];

console.log("🔍 Looking for index.js in the following locations:");
possiblePaths.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p}`);
});

// Find the first existing path
let indexPath = null;
for (const possiblePath of possiblePaths) {
  try {
    if (fs.existsSync(possiblePath)) {
      indexPath = possiblePath;
      console.log(`✅ Found index.js at: ${indexPath}`);
      break;
    }
  } catch (error) {
    // Continue to next path
  }
}

if (!indexPath) {
  console.error("❌ Could not find dist/index.js in any expected location");
  console.error("📁 Directory contents:");
  try {
    const contents = fs.readdirSync(process.cwd());
    console.error(contents);
  } catch (error) {
    console.error("Could not read directory contents");
  }
  process.exit(1);
}

// Start the server
console.log(
  `🎯 Starting server with: node --max-old-space-size=512 ${indexPath}`
);

const child = spawn("node", ["--max-old-space-size=512", indexPath], {
  stdio: "inherit",
  cwd: process.cwd(),
});

child.on("error", (error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

child.on("exit", (code) => {
  console.log(`🛑 Server exited with code ${code}`);
  process.exit(code);
});
