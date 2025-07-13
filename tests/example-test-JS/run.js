const { By, until } = require("selenium-webdriver");
function log(msg) { process.stdout.write(`${msg}\n`); }

module.exports = async function(driver, parameters = {}) {
  const whatToSay = parameters.whatToSay || "Hi My Name Is Andrew!!";
  log("🟠 Received parameters:");
  for (const [key, value] of Object.entries(parameters)) {
    log(`• ${key}: ${JSON.stringify(value)}`);
  }
  log(`🟡 Will enter into textarea: ${whatToSay}`);

  try {
    // 1. Go to Google Australia
    log("🌏 Navigating to https://www.google.com.au/");
    await driver.get("https://www.google.com.au/");
    await driver.sleep(1500);

    // 2. Handle consent - sometimes Google may show a consent dialog
    try {
      const agreeBtns = await driver.findElements(By.xpath("//button[.//div[contains(.,'Agree') or contains(.,'accept') or contains(.,'Accept')]]"));
      if (agreeBtns.length > 0) {
        log("⚠️ Clicking consent/agree button...");
        await agreeBtns[0].click();
        await driver.sleep(1200);
      }
    } catch (e) { /* ignore */ }

    // 3. Wait for search textarea
    log("🔎 Waiting for search textarea...");
    let textarea;
    try {
      textarea = await driver.wait(until.elementLocated(By.name("q")), 8000);
      await driver.wait(until.elementIsVisible(textarea), 5000);
    } catch (e) {
      process.stderr.write("❌ FAIL: Search textarea not found or not visible.\n");
      throw new Error("Google search textarea not found/visible");
    }

    // 4. Type whatToSay param
    await textarea.clear();
    await textarea.sendKeys(whatToSay);
    log("⌨️ Typed into textarea.");
    await driver.sleep(600);

    // 5. Check value
    const val = await textarea.getAttribute("value");
    log(`🟢 Textarea value is now: ${val}`);

    if (val === whatToSay) {
      log("✅ PASS: Textarea contains the right value.");
      return;
    } else {
      process.stderr.write(`❌ FAIL: Textarea does NOT contain the expected value!\n`);
      throw new Error("Textarea does not contain the expected value.");
    }
  } catch (err) {
    process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
    throw err;
  }
};
