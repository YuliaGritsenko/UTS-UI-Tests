const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function runLoginTest() {
  let driver;
  const timeoutMs = 60000;
  const pollInterval = 2000;
  const visual = process.env.VISUAL_BROWSER === "true";
  const profilePath = process.env.CHROME_USER_PROFILE || "/tmp/okta-session";

  console.log("🧪 OKTA-Prod-Login starting...");
  console.log("👁 VISUAL_BROWSER =", visual);
  console.log("🗂 Using Chrome profile:", profilePath);

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

    console.log("🌐 Navigating to https://login.uts.edu.au...");
    await driver.get("https://login.uts.edu.au");

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      console.log("⏳ Waiting for user login...");
      try {
        const logoElements = await driver.findElements(By.css('img.logo[alt="University of Technology Sydney logo"]'));
        if (logoElements.length > 0) {
          console.log("✅ Login successful: UTS logo detected.");
          if (visual) await driver.sleep(3000);
          // 🛑 Do NOT quit driver — keep session open for next test
          return;
        }
      } catch (err) {
        console.error("⚠️ Poll error:", err.message);
      }
      await driver.sleep(pollInterval);
    }

    console.error("❌ Login failed: UTS logo not detected after retrying.");
    process.exit(1);

  } catch (err) {
    console.error("🔥 Fatal error:", err.message);
    process.exit(1);
  }

  // 🟡 No .quit() or process.exit(0) so future tests can reuse the session
})();