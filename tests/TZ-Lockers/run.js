const { By, until } = require("selenium-webdriver");
const edge = require('selenium-webdriver/edge');

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
    // Initialize URLs and credentials
    const url = "https://cb2lockersci.uts.edu.au";
    const login_lockers = parameters.LOGLOCKERS1 || "";
    const password_lockers = parameters.PASSLOCKERS1 || "";
    const username_lockers = parameters.USERLOCKERS1 || "";

    log("🟠 Starting UTS Lockers Navigation Test");
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

        // Select Neighbourhood
        log("📍 Selecting neighbourhood: Science Lv1");
        await driver.findElement(By.id("NeighbourhoodId")).click();
        await driver.findElement(By.xpath("//option[text()='Science Lv1']")).click();
        await driver.sleep(2000);

        // Select Locker Bank - HS02.01.120_001-040
        log("🔒 Selecting Locker Bank: HS02.01.120_001-040");
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_001-040']")).click();
        await driver.sleep(2000);

        log("👁️ Viewing Locker Bank details");
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);

       // Get All Locker Elements
var allLockers = driver.FindElements(By.CssSelector("div.locker-info-div"));       
allLockers.forEach(locker => {
    const leaseLocker = locker.getAttribute("lease-locker");
    const classList = locker.getAttribute("class");

    if (classList.includes("AvailableLockerInfo")) {
        log(`👁️${leaseLocker} - Available`);
    } else if (classList.includes("SingleUsePreservedLockerInfo")) {
        log(`${leaseLocker} - Single Use Preserved, Available`);
    } else if (classList.includes("FlaggedLockerInfo") || classList.includes("FlexibleReservedLockerInfo")) {
        const leaseOwner = locker.getAttribute("lease-owner");
        log(`${leaseLocker} - Reserved by ${leaseOwner}`);
    } else if (classList.includes("ExpiredLockerInfo")) {
        const leaseOwner = locker.getAttribute("lease-owner");
        log(`${leaseLocker} - Expired - Reserved by ${leaseOwner}`);
    }
});

        log("🟢 Locker navigation test steps completed successfully.");
    } catch (err) {
        process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
        throw err;
    } finally {
        // Optionally close the browser
        // await driver.quit();
    }
};
