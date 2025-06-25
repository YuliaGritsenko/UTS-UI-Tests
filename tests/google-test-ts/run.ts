import { Builder, By, Key } from 'selenium-webdriver';

(async function runTest() {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://www.google.com.au");
    const searchBox = await driver.findElement(By.name("q"));
    await searchBox.sendKeys("Hi world!!", Key.RETURN);
    console.log("✅ TypeScript test complete");
  } catch (e) {
    console.error("❌ TypeScript test failed:", e);
  } finally {
    await driver.quit();
  }
})();