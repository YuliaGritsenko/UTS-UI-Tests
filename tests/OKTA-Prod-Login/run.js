// tests/OKTA-Prod-Login/run.js
const { By } = require("selenium-webdriver");

module.exports = async function(driver, parameters = {}) {
  const log = (msg) => process.stdout.write(`${msg}\n`);
  const visual = parameters.visualBrowser ?? (process.env.VISUAL_BROWSER === "true");
  log("🧪 OKTA-Prod-Login starting...");
  try {
    await driver.manage().setTimeouts({ script: 30000, pageLoad: 60000 });
    log("🌐 Navigating to https://login.uts.edu.au...");
    await driver.get("https://login.uts.edu.au");
    const timeoutMs = 60000;
    const pollInterval = 2000;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      log("⏳ Waiting for user login...");
      try {
        const logoElements = await driver.findElements(By.css('img.logo[alt="University of Technology Sydney logo"]'));
        if (logoElements && logoElements.length > 0) {
          log("✅ Login successful!");
          if (visual) await driver.sleep(3000);
          return;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }
    throw new Error("UTS logo not detected after timeout.");
  } catch (err) {
    process.stderr.write(`❌ Login failed: ${err.message}\n`);
    throw err;
  }
};
