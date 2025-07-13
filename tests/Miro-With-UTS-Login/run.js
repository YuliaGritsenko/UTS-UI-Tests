const { By } = require("selenium-webdriver");
function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
  const timeoutMs = 10000; // 10 seconds
  const pollInterval = 2000;
  log("🧪 Miro UTS span test starting...");
  if (!driver) {
    throw new Error("Driver must be provided by the sequence runner/session! (Don’t run this test stand-alone)");
  }
  let handles = [];
  try {
    // Open new tab, switch to it
    log("📑 Opening a new tab and switching context.");
    await driver.executeScript("window.open('about:blank','_blank');");
    handles = await driver.getAllWindowHandles();
    const newTabHandle = handles[handles.length - 1];
    await driver.switchTo().window(newTabHandle);

    log("🌐 Navigating to https://login.uts.edu.au/home/bookmark/0oa47kqefaOdZ1ie83l7/2557 ...");
    await driver.get("https://login.uts.edu.au/home/bookmark/0oa47kqefaOdZ1ie83l7/2557");

    const start = Date.now();
    let found = false;
    while (Date.now() - start < timeoutMs) {
      log("🔍 Looking for span: University of Technology Sydney ...");
      try {
        const spans = await driver.findElements(
          By.xpath(`//span[text()='University of Technology Sydney']`)
        );
        if (spans.length > 0) {
          log("✅ Found University of Technology Sydney span!");
          found = true;
          break;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err && err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }
    // Clean up: close new tab, return to original tab
    if (handles.length > 1) {
      await driver.close();
      await driver.switchTo().window(handles[0]);
    }
    if (!found) {
      process.stderr.write("❌ Failed: span 'University of Technology Sydney' NOT found after timeout.\n");
      throw new Error("Failed: span 'University of Technology Sydney' NOT found after timeout.");
    } else {
      log("🏁 Test finished successfully.");
    }
    return;
  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err && err.message}\n`);
    // Attempt to close tab and switch back
    try {
      handles = handles.length ? handles : await driver.getAllWindowHandles();
      if (handles.length > 1) {
        await driver.close();
        await driver.switchTo().window(handles[0]);
      }
    } catch (err2) {
      process.stderr.write(`⚠️ Failed to close tab or switch back: ${err2 && err2.message}\n`);
    }
    throw err;
  }
};
