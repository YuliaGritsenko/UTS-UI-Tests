const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

(async function finishLoginSession() {
  console.log("🧼 OKTA-Prod-Login-Finish — cleaning up session...");

  const profilePath = process.env.CHROME_USER_PROFILE;
  if (!profilePath) {
    console.error("❌ CHROME_USER_PROFILE not set");
    process.exit(1);
  }

  if (!fs.existsSync(profilePath)) {
    console.log(`⚠️  No session profile at ${profilePath}. Nothing to clean.`);
    process.exit(0);
  }

  try {
    console.log("🔍 Looking for Chrome processes with this profile...");
    // Kill all chrome processes using this profile (rough match)
    execSync(`pkill -f "chrome.*user-data-dir=${profilePath}"`);
    console.log("✅ Chrome processes terminated.");
  } catch (err) {
    console.warn("⚠️ No matching chrome processes found or pkill failed:", err.message);
  }

  try {
    // Optional: Remove session folder
    fs.rmSync(profilePath, { recursive: true, force: true });
    console.log(`🧹 Deleted profile directory: ${profilePath}`);
  } catch (err) {
    console.warn("⚠️ Failed to delete profile folder:", err.message);
  }

  console.log("✅ OKTA session cleanup complete.");
  process.exit(0);
})();
