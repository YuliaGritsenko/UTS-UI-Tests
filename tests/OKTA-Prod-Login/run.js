const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

(async function runLoginTest() {
  let driver;
  const timeoutMs = 60000;
  const pollInterval = 2000;
  const visual = process.env.VISUAL_BROWSER === "true";
  const profilePath = process.env.CHROME_USER_PROFILE || "/tmp/okta-session";
  log("🧪 OKTA-Prod-Login starting...");
  log(`👁 VISUAL_BROWSER = ${visual}`);
  log(`🗂 Using Chrome profile: ${profilePath}`);

  try {
    const seleniumUrl = process.env.SELENIUM_REMOTE_URL || "http://localhost:4444/wd/hub";
    const options = new chrome.Options().addArguments(`--user-data-dir=${profilePath}`);
    if (!visual) {
      options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1920,1080");
    }
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer(seleniumUrl)
      .build();
    await driver.manage().setTimeouts({
      implicit: 0,
      pageLoad: 60000,
      script: 30000,
    });
    log("🌐 Navigating to https://login.uts.edu.au...");
    await driver.get("https://login.uts.edu.au");
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      log("⏳ Waiting for dashboard-search-input...");
      try {
        const searchInputs = await driver.findElements(By.id("dashboard-search-input"));
        if (searchInputs.length > 0) {
          log("✅ Login successful: dashboard search input detected.");
          if (visual) await driver.sleep(3000);
          // 🛑 Success, do NOT quit browser so session continues for sequence
          return;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }
    // --- FAIL: timed out ---
    process.stderr.write("❌ Login failed: dashboard search input not detected after retrying.\n");
    if (driver) await driver.quit();
    process.exit(1);
  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err.message}\n`);
    if (driver) await driver.quit();
    process.exit(1);
  }
  // (No automatic .quit or exit(0) here on manual success.)
})();
