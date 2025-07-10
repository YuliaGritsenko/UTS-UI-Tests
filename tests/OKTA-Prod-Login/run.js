const fs = require("fs");
const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

async function waitForDir(path, maxWaitMs = 5000) {
  const interval = 100;
  const maxTries = Math.ceil(maxWaitMs / interval);
  for (let i = 0; i < maxTries; ++i) {
    if (fs.existsSync(path)) return true;
    await new Promise(res => setTimeout(res, interval));
  }
  return false;
}

(async function runLoginTest() {
  log(`Node running as UID ${process.getuid?.()} GID ${process.getgid?.()}`);
  log('Environment:');
  log(JSON.stringify(process.env, null, 2));

  let driver;
  const timeoutMs = 60000;
  const pollInterval = 2000;
  const visual = process.env.VISUAL_BROWSER === "true";
  // Try both /tmp and home directory
  const defaultProfile = `/home/${process.env.USER || 'chrome'}/okta-session`;
  const profilePath = process.env.CHROME_USER_PROFILE || defaultProfile;

  log("🧪 OKTA-Prod-Login starting...");
  log(`👁 VISUAL_BROWSER = ${visual}`);
  log(`🗂 Using Chrome profile: ${profilePath}`);

  // Clean up any old session
  try {
    if (fs.existsSync(profilePath)) {
      fs.rmSync(profilePath, { recursive: true, force: true });
      log(`🧹 Deleted previous session dir: ${profilePath}`);
    }
  } catch (err) {
    log(`⚠️ Could not clean old session: ${err.message}`);
  }

  try {
    const seleniumUrl = process.env.SELENIUM_REMOTE_URL || "http://localhost:4444/wd/hub";
    const options = new chrome.Options().addArguments(`--user-data-dir=${profilePath}`);
    if (!visual) {
      options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1920,1080");
    }
    log(`Chrome options: ${JSON.stringify(options.args)}`);

    driver = await new Builder()
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

    const found = await waitForDir(profilePath, 5000);
    if (found) {
      log(`✅ Chrome profile/session directory exists at ${profilePath} (after navigation).`);
    } else {
      log(`❌ Chrome profile/session directory NOT found at ${profilePath} even after navigation and 5s wait!`);
    }

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
    if (fs.existsSync(profilePath)) {
      log(`(post-fail) ✅ Chrome profile/session directory exists at ${profilePath}.`);
    } else {
      log(`(post-fail) ❌ Chrome profile/session directory NOT found at ${profilePath}.`);
    }

    process.exit(1);

  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err.message}\n`);
    process.exit(1);
  }
})();
