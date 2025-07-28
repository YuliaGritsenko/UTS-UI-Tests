const { By, until } = require("selenium-webdriver");
const edge = require('selenium-webdriver/edge');


(async function main() {
    // Initialize WebDriver
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    
    // Initialize URLs and credentials
    const url = "https://cb2lockersci.uts.edu.au";
    const login_lockers = parameters.LOGLOCKERS1 || "";
    const password_lockers = parameters.PASSLOCKERS1 || "";
    const username_lockers = parameters.USERLOCKERS1 || "";
    try {

        // Launch the Website
        await driver.get(url);
        await driver.sleep(2000); // Wait for the page to load
        // Log In as User
        await driver.findElement(By.id("loginUserName")).sendKeys(login_lockers);
        await driver.findElement(By.id("loginPassword")).sendKeys(username_lockers);
        await driver.findElement(By.id("loginButton")).click();
        await driver.sleep(2000); // Wait for login

        // Select Neighbourhood
        await driver.findElement(By.id("NeighbourhoodId")).click();
        await driver.findElement(By.xpath("//option[text()='Science Lv1']")).click();
        await driver.sleep(2000);

        // Select Locker Bank - HS02.01.120_001-040
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_001-040']")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);
    } finally {
        // Optionally close the browser
        // await driver.quit();
    }
})();

