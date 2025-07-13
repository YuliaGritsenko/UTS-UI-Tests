const { logging } = require("selenium-webdriver");

// Convenience function for terminal log
function log(msg) { process.stdout.write(`${msg}\n`); }

module.exports = async function(driver, parameters = {}) {
  // Print all parameters received
  log(`🟠 Received parameters:`);
  for (const [key, value] of Object.entries(parameters)) {
    log(`• ${key}: ${JSON.stringify(value)}`);
  }

  // Use the parameter keys as provided by the UI (which sends the raw keys, per your metadata)
  const whatToSay = parameters.whatToSay;
  log(`🟡 Will console.log in browser: ${whatToSay}`);

  try {
    // 1. Console log in browser
    await driver.executeScript(`console.log(${JSON.stringify(whatToSay)});`);
    log("🧪 Ran console.log in browser.");

    // 2. Wait for browser log to flush (especially in headless)
    await driver.sleep(1500);

    // 3. Get browser logs (needs loggingPrefs at session creation!)
    let entries;
    try {
      // If logging not enabled on the driver, this will throw!
      entries = await driver.manage().logs().get(logging.Type.BROWSER);
    } catch (err) {
      process.stderr.write(`⚠️ Could not get browser log: ${err.message}\n`);
      throw new Error("Could not get browser log!");
    }

    // 4. Print all browser console logs for debug
    log("🟢 Browser console logs:");
    for (const entry of entries) {
      log(`[browser][${entry.level}] ${entry.message}`);
    }

    // 5. Check for expected message
    const found = entries.some(entry =>
      entry.message && entry.message.includes(whatToSay)
    );
    if (found) {
      log("✅ PASS: Found message in browser console logs.");
      return; // Pass
    } else {
      process.stderr.write(`❌ FAIL: Message wasn't found in browser console log!\n`);
      throw new Error("Console log expected message NOT found.");
    }
  } catch (err) {
    process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
    throw err;
  }
};
