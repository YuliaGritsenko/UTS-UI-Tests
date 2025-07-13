const { By, logging } = require("selenium-webdriver");

/*
 * parameters = { whatToSay: "Hi my name is Andrew" } // Provided by user/UI
 */
module.exports = async function(driver, parameters = {}) {
  function log(msg) { process.stdout.write(`${msg}\n`); }

  const whatToSay = parameters.whatToSay;
  log(`🟡 Will console.log: ${whatToSay}`);

  try {
    // (Optionally: Navigate to any target page first, if not already open)
    // await driver.get("about:blank");

    // 1. Inject a console.log via script
    await driver.executeScript(`console.log(${JSON.stringify(whatToSay)});`);
    log("🧪 Ran console.log in browser.");

    // 2. IMPORTANT: give browser time to flush logs
    await driver.sleep(1500);

    // 3. Grab browser console logs (requires Chrome loggingPrefs set at browser startup!)
    let entries = [];
    try {
      // Many setups use capability: { "goog:loggingPrefs": { browser: "ALL" } }
      entries = await driver.manage().logs().get(logging.Type.BROWSER);
      // entries: [{level, message, timestamp, ...}, ...]
    } catch (err) {
      process.stderr.write(`⚠️ Could not get browser log: ${err.message}\n`);
      throw new Error("Could not get browser log!");
    }

    // 4. Check for our expected message
    const match = entries.find(entry => entry.message.includes(whatToSay));
    if (match) {
      log("✅ PASS: Found message in browser console logs.");
      return;
    } else {
      process.stderr.write(`❌ FAIL: Expected message was NOT found in browser console log!\n`);
      throw new Error("Console log expected message not found.");
    }
  } catch (err) {
    process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
    throw err;
  }
};
