const { By } = require("selenium-webdriver");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

/**
 * Test: Looks for "University of Technology Sydney" span in UTS login page.
 * Opens a new tab, waits up to 10s, reports result.
 * @param {WebDriver} driver   - Provided by the sequence runner/session.
 * @param {object}   parameters - (Not used)
 */
module.exports = async function(driver, parameters = {}) {
  const timeoutMs = 10000; // 10 seconds
  const pollInterval = 2000;
  log("🧪 Miro UTS span test starting...");
  if (!driver) {
    throw new Error("Driver must be provided by the sequence runner/session!");
  }

  let originalHandle;
  let newTabHandle;
  let found = false;

  try {
    // Record the original window
    const startHandles = await driver.getAllWindowHandles();
    originalHandle = startHandles[0];

    // Open new tab and switch context
    log("📑 Opening a new tab and switching context.");
    await driver.executeScript("window.open('about:blank','_blank');");
    const handles = await driver.getAllWindowHandles();
    newTabHandle = handles[handles.length - 1];
    await driver.switchTo().window(newTabHandle);

    log("🌐 Navigating to https://login.uts.edu.au/home/bookmark/0oa47kqefaOdZ1ie83l7/2557 ...");
    await driver.get("https://login.uts.edu.au/home/bookmark/0oa47kqefaOdZ1ie83l7/2557");

    // Poll for span presence
    const start = Date.now();
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

    // Clean up: close new tab, back to original
    try {
      const endHandles = await driver.getAllWindowHandles();
      if (endHandles.length > 1 && newTabHandle) {
        await driver.close(); // closes current (new) tab
        await driver.switchTo().window(originalHandle);
      }
    } catch (err) {
      process.stderr.write(`⚠️ Cleanup after success: ${err && err.message}\n`);
    }

    if (!found) {
      process.stderr.write("❌ Failed: span 'University of Technology Sydney' NOT found after timeout.\n");
      throw new Error("Failed: span 'University of Technology Sydney' NOT found after timeout.");
    } else {
      log("🏁 Test finished successfully.");
    }
  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err && err.message}\n`);
    // Cleanup even on error
    try {
      const handles = await driver.getAllWindowHandles();
      if (handles.length > 1 && newTabHandle) {
        await driver.switchTo().window(newTabHandle);
        await driver.close();
      }
      if (originalHandle) {
        await driver.switchTo().window(originalHandle);
      }
    } catch (err2) {
      process.stderr.write(`⚠️ Failed to close tab or switch back: ${err2 && err2.message}\n`);
    }
    throw err;
  }
};
