const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
  const timeoutMs = 60000;
  const pollInterval = 2000;
  const visual = process.env.VISUAL_BROWSER === "true";
  const profilePath = process.env.CHROME_USER_PROFILE || "/tmp/miro-session";
  log("🧪 Miro UTS span test starting...");
  log(`👁 VISUAL_BROWSER = ${visual}`);
  log(`🗂 Using Chrome profile: ${profilePath}`);

  // If driver not provided, create one (for single/manual run)
  let createdDriver = false;
  if (!driver) {
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

  try {
    log("🌐 Navigating to https://miro.com/app/dashboard/ ...");
    await driver.get("https://miro.com/app/dashboard/");

    const start = Date.now();
    let found = false;

    while (Date.now() - start < timeoutMs) {
      log("🔍 Looking for span: University of Technology Sydney ...");
      try {
        // Get ALL span elements and check their visible text content
        const spans = await driver.findElements(By.xpath(`//span[text()='University of Technology Sydney']`));
        if (spans.length > 0) {
          log("✅ Found University of Technology Sydney span!");
          found = true;
          if (visual) await driver.sleep(2000);
          break;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }

    if (!found) {
      process.stderr.write("❌ Failed: span 'University of Technology Sydney' NOT found after timeout.\n");
      if (createdDriver && driver) await driver.quit();
      process.exit(1);
    }

    // PASS
    if (createdDriver && driver) await driver.quit();
    // If in a sequence, don't quit driver (remove line above)
    return;

  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err.message}\n`);
    if (driver) await driver.quit();
    process.exit(1);
  }
};

// To allow running directly
if (require.main === module) {
  module.exports();
}