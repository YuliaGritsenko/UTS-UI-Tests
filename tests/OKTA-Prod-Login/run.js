const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
function log(msg) { process.stdout.write(`${msg}\n`); }

(async function runLoginTest() {

  // Place this at the top of your main function:
  console.log("DEBUG: env CHROME_USER_PROFILE = ", process.env.CHROME_USER_PROFILE);
  const profilePath = process.env.CHROME_USER_PROFILE || '/shared/browser-sessions/okta-session';
  console.log("DEBUG: using profilePath = ", profilePath);
  log(`Node running as UID ${process.getuid?.()} GID ${process.getgid?.()}`);
  log('Environment:');
  log(JSON.stringify(process.env, null, 2));

  const visual = process.env.VISUAL_BROWSER === "true";
  // Always use the shared volume path
  const profilePath = process.env.CHROME_USER_PROFILE;
  if (!profilePath) {
    throw new Error("CHROME_USER_PROFILE environment variable must be set!");
  }

  log("🧪 OKTA-Prod-Login starting...");
  log(`👁 VISUAL_BROWSER = ${visual}`);
  log(`🗂 Using Chrome profile: ${profilePath}`);

  try {
    const seleniumUrl = process.env.SELENIUM_REMOTE_URL || "http://localhost:4444/wd/hub";
    const options = new chrome.Options().addArguments(`--user-data-dir=${profilePath}`);
    if (!visual) {
      options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1920,1080");
    }

    // Robust Chrome option logging
    try {
      log(`Chrome options (args): ${JSON.stringify(options.args)}`);
    } catch (e) {}
    try {
      log(`Chrome options (options_): ${JSON.stringify(options.options_)}`);
    } catch (e) {}
    try {
      log(`Chrome options: ${options}`);
    } catch (e) {}

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer(seleniumUrl)
      .build();

    // Print Chrome version/UA
    try {
      const chromeVersion = await driver.executeScript('return navigator.userAgent;');
      log(`Chrome version/UA: ${chromeVersion}`);
    } catch (err) {
      log(`(Could not get chrome version: ${err.message})`);
    }

    await driver.manage().setTimeouts({
      implicit: 0,
      pageLoad: 60000,
      script: 30000,
    });

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
          log("✅ Login successful: UTS logo detected.");
          if (visual) await driver.sleep(3000);
          // 🛑 Do NOT quit driver — keep session open for next test
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
