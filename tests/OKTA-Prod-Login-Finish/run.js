const fs = require("fs");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
function log(msg) { process.stdout.write(`${msg}\n`); }

(async function closeSession() {
  console.log("🧼 OKTA-Prod-Login-Finish — closing session...");

  const seleniumUrl = process.env.SELENIUM_REMOTE_URL || "http://localhost:4444/wd/hub";
  const profilePath = process.env.CHROME_USER_PROFILE;
  if (!profilePath) {
    console.error("❌ CHROME_USER_PROFILE not set. Cannot close session.");
    process.exit(1);
  }

  const visual = process.env.VISUAL_BROWSER === "true";

  // Check if the profile directory exists
  if (!fs.existsSync(profilePath)) {
    console.log(`⚠️  No profile at ${profilePath}. Nothing to close.`);
    process.exit(0);
  }

  console.log(`🔑 Found Chrome profile/session at ${profilePath}. Attempting to close browser...`);
  let driver;
  try {
    const options = new chrome.Options().addArguments(`--user-data-dir=${profilePath}`);

    if (!visual) {
      options.addArguments(
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=1920,1080"
      );
    }

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer(seleniumUrl)
      .build();

    // ⏳ Force Chrome to load something very light
    await driver.get("about:blank");

    // ⏱ Optional wait (especially useful in visual mode to let profile stabilize)
    if (visual) {
      await driver.sleep(1000);
    }

    await driver.quit();
    console.log("✅ Browser session closed by OKTA-Prod-Login-Finish.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing browser session:", err.message);
    if (driver) {
      try {
        await driver.quit();
      } catch (e2) {
        console.error("⚠️ Failed to force quit driver:", e2.message);
      }
    }
    process.exit(1);
  }
})();
