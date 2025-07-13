const { logging } = require("selenium-webdriver");
function log(msg) { process.stdout.write(`${msg}\n`); }

module.exports = async function(driver, parameters = {}) {
  const whatToSay = parameters.whatToSay;
  log(`🟠 Received parameters:`);
  for (const [key, value] of Object.entries(parameters)) {
    log(`• ${key}: ${JSON.stringify(value)}`);
  }
  log(`🟡 Will console.log in browser: ${whatToSay}`);

  try {
    // 1. Wait for browser tab to be open and ready
    log("⚡ Waiting for browser page to be ready...");
    // Optionally navigate to a known page and wait for dom if you want:
    // await driver.get('about:blank'); // Optional, uncomment if needed
    await driver.sleep(2000);

    // 2. Console log in browser
    await driver.executeScript(`console.log(${JSON.stringify(whatToSay)});`);
    log("🧪 Ran console.log in browser.");

    // 3. Wait for browser runtime to flush logs
    await driver.sleep(2000);

    // 4. Get browser logs (needs loggingPrefs at session creation!)
    let entries;
    try {
      entries = await driver.manage().logs().get(logging.Type.BROWSER);
    } catch (err) {
      process.stderr.write(`⚠️ Could not get browser log: ${err.message}\n`);
      throw new Error("Could not get browser log!");
    }

    // 5. Print all browser console logs for debug
    log("🟢 Browser console logs:");
    for (const entry of entries) {
      log(`[browser][${entry.level}] ${entry.message}`);
    }

    // 6. Check for expected message
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
