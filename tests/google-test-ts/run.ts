// run.ts
import { Builder, By, Key, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

(async function runTest() {
  let driver: WebDriver;
  let exitCode = 1;
  const visual = process.env.VISUAL_BROWSER === "true";
  const seleniumUrl = process.env.SELENIUM_REMOTE_URL || "http://localhost:4444/wd/hub";

  try {
    const options = new chrome.Options();
    if (!visual) {
      options.addArguments("--headless=new", "--no-sandbox", "--disable-gpu", "--window-size=1920,1080");
    }

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer(seleniumUrl)
      .build();

    console.log("🚀 Navigating to Google...");
    await driver.get("https://www.google.com");
    const searchBox = await driver.wait(until.elementLocated(By.name("q")), 5000);
    await searchBox.sendKeys("hello world", Key.RETURN);
    await driver.wait(until.elementLocated(By.id("result-stats")), 5000);

    console.log("✅ TypeScript Test Passed");
    exitCode = 0;
  } catch (err: any) {
    console.error("❌ TypeScript Test Failed:", err.message);
  } finally {
    if (driver) {
      if (visual) await driver.sleep(3000);
      await driver.quit();
    }
    process.exit(exitCode);
  }
})();