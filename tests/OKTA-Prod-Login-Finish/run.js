const fs = require("fs");
const { execSync } = require("child_process");

(async () => {
  const profilePath = process.env.CHROME_USER_PROFILE;
  console.log("🧼 OKTA-Prod-Login-Finish — killing Chrome and clearing session...");

  try {
    execSync("docker exec selenium pkill -f chrome");
    console.log("✅ Chrome process killed");
  } catch (err) {
    console.warn("⚠️ Chrome may already be closed:", err.message);
  }

  if (fs.existsSync(profilePath)) {
    try {
      fs.rmSync(profilePath, { recursive: true, force: true });
      console.log("🧹 Deleted profile folder:", profilePath);
    } catch (err) {
      console.warn("⚠️ Could not clean up:", err.message);
    }
  }

  process.exit(0);
})();
