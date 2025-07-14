const { By, until } = require("selenium-webdriver");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

/**
 * Test: UTS Canvas Dashboard Link Checker
 * @param {WebDriver} driver   - Provided by your sequence runner, should be a fresh driver.
 */
module.exports = async function (driver, parameters = {}) {
  log("🟠 Starting UTS Canvas Dashboard Link Checker Test");

  try {
    // Step 1: Go to UTS Canvas login
    const url = "https://login.uts.edu.au/home/uts_canvas_1/0oao8pbm1LMFy76bn3l6/alno8rwfebrj4immO3l6";
    log(`🌏 Navigating to ${url}`);
    await driver.get(url);

    // Step 2: Wait for page load
    await driver.sleep(2000); // Adjust if slower network

    // Step 3: Try to find the 'ic-app-header__logomark' anchor
    log("🔎 Waiting for dashboard link (class='ic-app-header__logomark')...");

    let dashboardEl;
    try {
      dashboardEl = await driver.wait(
        until.elementLocated(By.css('a.ic-app-header__logomark')),
        12000 // generous for SSO/redirects
      );
      await driver.wait(until.elementIsVisible(dashboardEl), 9000);
    } catch (e) {
      log("❌ FAIL: Dashboard link (class='ic-app-header__logomark') not found or visible.");
      throw new Error("Dashboard link not present/visible");
    }

    // Step 4: Verify href attribute just in case
    const href = await dashboardEl.getAttribute("href");
    if (href && href.startsWith('https://canvas.uts.edu.au/')) {
      log(`🟢 Dashboard link found. Href: ${href}`);
      log("✅ PASS: Canvas dashboard link loaded successfully.");
    } else {
      log("❌ FAIL: Dashboard link present but href not as expected!");
      throw new Error("Dashboard link present but href wrong/missing.");
    }

  } catch (err) {
    process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
    throw err;
  }
};