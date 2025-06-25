import { Builder, By, Key } from "selenium-webdriver";

(async () => {
  const driver = await new Builder()
    .usingServer(process.env.SELENIUM_REMOTE_URL || "http://selenium:4444/wd/hub")
    .forBrowser("chrome")
    .build();

  try {
    await driver.get("https://www.google.com.au");
    const searchBox = await driver.findElement(By.name("q"));
    await searchBox.sendKeys("Hi world!!", Key.RETURN);
    console.log("✅ TS test complete");
  } finally {
    await driver.quit();
  }
})();