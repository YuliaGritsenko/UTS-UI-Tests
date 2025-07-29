const { By, until } = require("selenium-webdriver");
const edge = require('selenium-webdriver/edge');
const fs = require('fs');

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
    // Initialize URLs and credentials
    const url = "https://cb2lockersci.uts.edu.au";

   // Report Links
    const urlAL = "https://cb2lockersci.uts.edu.au/Report/AvailableLockers"; // Available Lockers
    const urlLS = "https://cb2lockersci.uts.edu.au/Report/LeaseSummary"; // Reservations Summary
    const urlEL = "https://cb2lockersci.uts.edu.au/Report/ExpiredLockers"; // Expired Lockers
    const urlFL = "https://cb2lockersci.uts.edu.au/Report/FlaggedLockers"; // Flagged Lockers
    const urlIL = "https://cb2lockersci.uts.edu.au/Report/LockerInactivity"; // Inactive Lockers
    const urlUA = "https://cb2lockersci.uts.edu.au/Report/UserActivities"; // User Activities
    const urlOA = "https://cb2lockersci.uts.edu.au/Report/OperatorActivities"; // Operator Activities
    const urlSE = "https://cb2lockersci.uts.edu.au/Report/SystemEvents"; // System Events

    const login_lockers = parameters.LOGLOCKERS1 || "";
    const password_lockers = parameters.PASSLOCKERS1 || "";
    const username_lockers = parameters.USERLOCKERS1 || "";

    log("🟠 Starting TZ Lockers Generate Reports Test - Science");
    try {
        // Launch the Website
        log(`🌏 Navigating to ${url}`);
        await driver.get(url);
        await driver.sleep(2000); // Wait for the page to load

        // Log In as User
        log("🔐 Logging in as user...");
        await driver.findElement(By.id("loginUserName")).sendKeys(login_lockers);
        await driver.findElement(By.id("loginPassword")).sendKeys(password_lockers);
        await driver.findElement(By.id("loginButton")).click();
        await driver.sleep(2000); // Wait for login

        // Available Lockers
        log("📋 Available Lockers Report");
        await driver.get(urlAL);
        await driver.sleep(2000); // Wait for the page to load
        await driver.findElement(By.id("generateReportBtn")).click();
        await driver.sleep(3000); // Wait for the report is generated
          // Take a screenshot
          // let image = await driver.takeScreenshot();
          // Save the screenshot to a file
          // fs.writeFileSync('screenshot.png', image, 'base64');
          log("📋 Screenshot saved (TODO)");

          // Reservations Summary
          log("📋 Reservations Summary Report");
          await driver.get(urlLS);
          await driver.sleep(2000); // Wait for the page to load
          await driver.findElement(By.id("generateReportBtn")).click();
          await driver.sleep(3000); // Wait for the report is generated
          
          log("📋 Screenshot saved (TODO)");

          // Expired Lockers
          log("📋 Expired Lockers Report");
          await driver.get(urlEL);
          await driver.sleep(2000); // Wait for the page to load
          await driver.findElement(By.id("generateReportBtn")).click();
          await driver.sleep(3000); // Wait for the report is generated
          
          log("📋 Screenshot saved (TODO)");

          // Flagged Lockers
          log("📋 Flagged Lockers Report");
          await driver.get(urlFL);
          await driver.sleep(2000); // Wait for the page to load
          await driver.findElement(By.id("generateReportBtn")).click();
          await driver.sleep(3000); // Wait for the report is generated
          
          log("📋 Screenshot saved (TODO)");

          // Inactive Lockers
          log("📋 Inactive Lockers Report");
          await driver.get(urlIL);
          await driver.sleep(2000); // Wait for the page to load
          await driver.findElement(By.id("generateReportBtn")).click();
          await driver.sleep(3000); // Wait for the report is generated
          
          log("📋 Screenshot saved (TODO)");

          // User Activities
          log("📋 User Activities Report");
          await driver.get(urlUA);
          await driver.sleep(2000); // Wait for the page to load
          await driver.findElement(By.id("LeaseeSalaryId")).sendKeys(login_lockers);
          await driver.findElement(By.id("generateReportBtn")).click();
          await driver.sleep(3000); // Wait for the report is generated
          
          log("📋 Screenshot saved (TODO)");

          // Operator Activities
          log("📋 Operator Activities Report");
          await driver.get(urlOA);
          await driver.sleep(2000); // Wait for the page to load     
          // await driver.findElement(By.id("generateReportBtn")).click();
          // await driver.sleep(3000); // Wait for the report is generated
          
          log("📋 SKIPPED: TODO: select date");
         
      
          // System Events
          log("📋 System Events Report");
          await driver.get(urlSE);
          await driver.sleep(2000); // Wait for the page to load     
         // await driver.findElement(By.id("generateReportBtn")).click();
         // await driver.sleep(3000); // Wait for the report is generated
          
          log("📋 SKIPPED: TODO: select date");

      log("🟢 Locker Reports test steps completed successfully.");
    } catch (err) {
        process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
        throw err;
    } finally {
       // Optionally close the browser
      // await driver.quit();
    }
};
