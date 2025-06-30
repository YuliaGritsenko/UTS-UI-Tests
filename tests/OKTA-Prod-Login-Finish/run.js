// run.js in OKTA-Prod-Login-Finish
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function closeSession() {
  console.log("🧼 OKTA-Prod-Login-Finish — closing session...");

  const seleniumUrl = process.env.SELENIUM_REMOTE_URL || "http://localhost:4444/wd/hub";
  const profilePath = process.env.CHROME_USER_PROFILE || "/tmp/okta-session";
  const visual = process.env.VISUAL_BROWSER === "true";

  const options = new chrome.Options().addArguments(`--user-data-dir=${profilePath}`);
  if (!visual) {
    options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1920,1080");
  }

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .usingServer(seleniumUrl)
    .build();

  await driver.quit();
  console.log("✅ Browser session closed by OKTA-Prod-Login-Finish.");
  process.exit(0);
})();