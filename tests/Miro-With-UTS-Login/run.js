const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
  const timeoutMs = 60000;
  const pollInterval = 2000;
  const visual = process.env.VISUAL_BROWSER === "true";
  const profilePath = process.env.CHROME_USER_PROFILE || "/tmp/okta-session";
  log("🧪 OKTA-Prod-Login starting...");
  log(`👁 VISUAL_BROWSER = ${visual}`);
  log(`🗂 Using Chrome profile: ${profilePath}`);
  let createdDriver = false;
  try {
    if (!driver) {
      // For local/manual runs, create a driver here
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
      createdDriver = true;
    }
    await driver.manage().setTimeouts({
      implicit: 0,
      pageLoad: 60000,
      script: 30000,
    });
    log("🌐 Navigating to https://login.uts.edu.au...");
    await driver.get("https://login.uts.edu.au");
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      log("⏳ Waiting for user login...");
      try {
        const logoElements = await driver.findElements(By.css('img.logo[alt="University of Technology Sydney logo"]'));
        if (logoElements.length > 0) {
          log("✅ Login successful: UTS logo detected.");
          if (visual) await driver.sleep(3000);
          // Do NOT quit driver — keep session open for next test in sequence!
          // If running manually (createdDriver), quit for safety
          if (createdDriver && driver) await driver.quit();
          return;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }
    // Timeout – login failed
    process.stderr.write("❌ Login failed: UTS logo not detected after retrying.\n");
    if (createdDriver && driver) await driver.quit();
    throw new Error("Login failed: UTS logo not detected after retrying.");
  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err.message}\n`);
    if (createdDriver && driver) await driver.quit();
    throw err;
  }
  // No .quit() here so next tests in the sequence can reuse the session
};
