const { execSync } = require("child_process");
const fs = require("fs");

(async () => {
  const profilePath = process.env.CHROME_USER_PROFILE;
  console.log("🧼 OKTA-Prod-Login-Finish — cleaning up Chrome session...");

  try {
    execSync("docker exec selenium pkill -f chrome");
    console.log("✅ Chrome process terminated inside selenium container.");
  } catch (err) {
    console.warn("⚠️ Failed to kill Chrome (maybe already closed):", err.message);
  }

  // Optional: cleanup profile directory if needed
  if (fs.existsSync(profilePath)) {
    try {
      fs.rmSync(profilePath, { recursive: true, force: true });
      console.log("🧹 Deleted Chrome user profile at:", profilePath);
    } catch (err) {
      console.warn("⚠️ Could not delete profile directory:", err.message);
    }
  }

  console.log("✅ OKTA session cleanup complete.");
  process.exit(0);
})();
