const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const log = (msg) => process.stdout.write(`${msg}\n`);

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

    const seleniumUrl = process.env.SELENIUM_REMOTE_URL || "http://selenium:4444/wd/hub";

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer(seleniumUrl)
      .build();

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
        if (logoElements.length > 0) {
          log("✅ Login successful!");
          if (visual) await driver.sleep(3000);
          return;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }

    process.stderr.write("❌ Login failed: UTS logo not detected after timeout.\n");
    process.exit(1);
  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err.message}\n`);
    process.exit(1);
  }
})();
