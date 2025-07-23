const { By } = require("selenium-webdriver");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

/**
 * Test: Navigates to https://cb2lockersci.uts.edu.au and passes if the page loads.
 * Opens a new tab, waits up to 10s, reports result.
 * @param {WebDriver} driver   - Provided by the sequence runner/session.
 * @param {object}   parameters - (Not used)
 */
module.exports = async function(driver, parameters = {}) {
  const timeoutMs = 10000; // 10 seconds
  log("🧪 cb2lockersci.uts.edu.au load test starting...");
  if (!driver) {
    throw new Error("Driver must be provided by the sequence runner/session!");
  }

  let originalHandle;
  let newTabHandle;
  let loaded = false;

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

    log("🌐 Navigating to https://cb2lockersci.uts.edu.au ...");
    // Try to load the page, catch navigation timeout/errors
    await driver.get("https://cb2lockersci.uts.edu.au");

    // Wait for document.readyState === 'complete' or timeout
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const readyState = await driver.executeScript("return document.readyState");
      log(`🔍 Page readyState: ${readyState}`);
      if (readyState === "complete") {
        loaded = true;
        log("✅ Page loaded successfully!");
        break;
      }
      await driver.sleep(1000); // poll every second
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

    if (!loaded) {
      process.stderr.write("❌ Failed: page NOT loaded after timeout.\n");
      throw new Error("Failed: page NOT loaded after timeout.");
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
