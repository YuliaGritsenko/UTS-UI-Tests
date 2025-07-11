const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

(async function runLoginTest() {
  const profilePath = process.env.CHROME_USER_PROFILE || '/shared/browser-sessions/okta-session';
  const visual = process.env.VISUAL_BROWSER === "true";

  log("🧪 OKTA-Prod-Login starting...");
  log(`CHROME_USER_PROFILE: ${profilePath}`);
  log(`VISUAL_BROWSER: ${visual}`);
  try {
    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${profilePath}`);
    if (!visual) {
      options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1920,1080");
    }

    // 🧠 Connect to the long-running Chrome instance
    options.options_["debuggerAddress"] = "selenium:9222";

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    // Optional: log UA
    try {
      const chromeVersion = await driver.executeScript('return navigator.userAgent;');
      log(`Chrome version/UA: ${chromeVersion}`);
    } catch (err) {
      log(`(Could not get chrome version: ${err.message})`);
    }

    // Load login page
    log("🌐 Navigating to https://login.uts.edu.au...");
    await driver.get("https://login.uts.edu.au");

    // Wait for successful login (detect UTS logo)
    const timeoutMs = 60000;
    const pollInterval = 2000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      log("⏳ Waiting for user login...");
      try {
        const logoElements = await driver.findElements(By.css('img.logo[alt="University of Technology Sydney logo"]'));
        if (logoElements.length > 0) {
          log("✅ Login successful: UTS logo detected.");
          if (visual) await driver.sleep(3000);
          return;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }

    process.stderr.write("❌ Login failed: UTS logo not detected after retrying.\n");
    process.exit(1);
  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err.message}\n`);
    process.exit(1);
  }
})();
