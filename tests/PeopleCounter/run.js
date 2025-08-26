const { By, until } = require("selenium-webdriver");
const edge = require('selenium-webdriver/edge');

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
    // Initialize URLs and credentials
    const url = "https://peoplecounter.uts.edu.au/";
    const ccode = parameters.CUSTOMERCODEPPLCOUNT1 || "";
    const password = parameters.PASSPPLCOUNT1 || "";
    const username = parameters.USERPPLCOUNT1 || "";

    log("🟠 Starting People Counter Navigation Test");
    try {
        // Launch the Website
        log(`🌏 Navigating to ${url}`);
        await driver.get(url);
        await driver.sleep(2000); // Wait for the page to load

        // Log In as User
        log("🔐 Logging...");
        await driver.findElement(By.id("customer_code")).sendKeys(ccode);
        await driver.findElement(By.id("username")).sendKeys(username);
        await driver.findElement(By.id("password")).sendKeys(password)
        await driver.findElement(By.id("login")).click();
        await driver.sleep(2000); // Wait for login

        // Create New Report
        log("🔐 Filling the report form");
        await driver.findElement(By.linkText("New Report")).click();

        // Report Type 
        // Wait until the select element is present
        let reportType = await driver.wait(until.elementLocated(By.id('rt')), 10000);
        // Select the option by value
        await reportType.findElement(By.css('option[value="NoOfRoomsAndSeats"]')).click();

        // Room, Desk or Group: 
        // Wait until the select element is present
        let roomDeskGroup = await driver.wait(until.elementLocated(By.id('a')), 10000);
        // Select the option by value
        await roomDeskGroup.findElement(By.css('option[value="Room"]')).click();
        // 
      

    } finally {
        // Close the browser
        await driver.quit(); 
    } 
};