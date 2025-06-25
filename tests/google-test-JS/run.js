const { Builder, By, Key } = require("selenium-webdriver");

(async function runTest() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://www.google.com.au");
    const searchBox = await driver.findElement(By.name("q"));
    await searchBox.sendKeys("Hi world!!", Key.RETURN);
    console.log("✅ JS test complete");
  } catch (e) {
    console.error("❌ JS test failed:", e.message);
  } finally {
    await driver.quit();
  }
})();