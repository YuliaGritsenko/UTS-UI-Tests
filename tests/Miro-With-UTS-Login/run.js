const { By } = require("selenium-webdriver");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
  const timeoutMs = 60000;
  const pollInterval = 2000;
  log("🧪 Miro UTS span test starting...");

  if (!driver) {
    throw new Error("Driver must be provided by the sequence runner/session! (Don’t run this test stand-alone)");
  }

  try {
    // Open a new tab within the same browser session & switch to it
    log("📑 Opening a new tab and switching context.");
    await driver.executeScript("window.open('about:blank','_blank');");
    const handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[handles.length - 1]); // Switch to the new tab

    log("🌐 Navigating to https://miro.com/app/dashboard/ ...");
    await driver.get("https://miro.com/app/dashboard/");
    const start = Date.now();
    let found = false;

    while (Date.now() - start < timeoutMs) {
      log("🔍 Looking for span: University of Technology Sydney ...");
      try {
        const spans = await driver.findElements(By.xpath(`//span[text()='University of Technology Sydney']`));
        if (spans.length > 0) {
          log("✅ Found University of Technology Sydney span!");
          found = true;
          // You can add: await driver.sleep(1500);
          break;
        }
      } catch (err) {
        process.stderr.write(`⚠️ Poll error: ${err.message}\n`);
      }
      await driver.sleep(pollInterval);
    }

    if (!found) {
      process.stderr.write("❌ Failed: span 'University of Technology Sydney' NOT found after timeout.\n");
      // DO NOT exit(1) or throw — sequence should continue!
    } else {
      log("🏁 Test finished successfully.");
    }

    //Optionally: close the tab we just made and switch back (if wanted):
    await driver.close();
    await driver.switchTo().window(handles[0]);

    //Always return cleanly
    return;

  } catch (err) {
    process.stderr.write(`🔥 Fatal error: ${err.message}\n`);
    // Do NOT exit(1) here. Allow sequence to proceed.
    return;
  }
};
