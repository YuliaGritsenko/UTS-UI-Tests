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

/* 
      // Select Locker Bank - HS02.01.120_001-040
        log("🔒 Selecting Locker Bank: HS02.01.120_001-040");
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_001-040']")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);

        // Get All Locker Elements 
        const lockers_001_040 = await driver.findElements(By.css('div.locker-info-div'));

        for (let locker of lockers_001_040) {
        const leaseLocker = await locker.getAttribute('lease-locker');
        const className = await locker.getAttribute('class');

        if (className.includes('AvailableLockerInfo')) {
          console.log(`${leaseLocker} - Available`);
        } else if (className.includes('SingleUsePreservedLockerInfo')) {
          console.log(`${leaseLocker} - Single Use Preserved, Available`);
        } else if (className.includes('FlaggedLockerInfo') || className.includes('FlexibleReservedLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Reserved by ${leaseOwner}`);
        } else if (className.includes('ExpiredLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Expired - Reserved by ${leaseOwner}`);
        }
    }

        // Select Locker Bank - HS02.01.120_041-110
        log("🔒 Selecting Locker Bank: HS02.01.120_041-110");
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_041-110']")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);

        // Get All Locker Elements
        const lockers_041_110 = await driver.findElements(By.css('div.locker-info-div'));

        for (let locker of lockers_041_110) {
        const leaseLocker = await locker.getAttribute('lease-locker');
        const className = await locker.getAttribute('class');

        if (className.includes('AvailableLockerInfo')) {
          console.log(`${leaseLocker} - Available`);
        } else if (className.includes('SingleUsePreservedLockerInfo')) {
          console.log(`${leaseLocker} - Single Use Preserved, Available`);
        } else if (className.includes('FlaggedLockerInfo') || className.includes('FlexibleReservedLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Reserved by ${leaseOwner}`);
        } else if (className.includes('ExpiredLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Expired - Reserved by ${leaseOwner}`);
        }
    } 
              // Select Locker Bank - HS02.01.120_111-160
        log("🔒 Selecting Locker Bank: HS02.01.120_111-160");
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_111-160']")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);

        // Get All Locker Elements
        const lockers_111_160 = await driver.findElements(By.css('div.locker-info-div'));

        for (let locker of lockers_111_160) {
        const leaseLocker = await locker.getAttribute('lease-locker');
        const className = await locker.getAttribute('class');

        if (className.includes('AvailableLockerInfo')) {
          console.log(`${leaseLocker} - Available`);
        } else if (className.includes('SingleUsePreservedLockerInfo')) {
          console.log(`${leaseLocker} - Single Use Preserved, Available`);
        } else if (className.includes('FlaggedLockerInfo') || className.includes('FlexibleReservedLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Reserved by ${leaseOwner}`);
        } else if (className.includes('ExpiredLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Expired - Reserved by ${leaseOwner}`);
        }
    }
                    // Select Locker Bank - HS02.01.120_161-215
        log("🔒 Selecting Locker Bank: HS02.01.120_161-215");
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_161-215']")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);

        // Get All Locker Elements
        const lockers_161_215 = await driver.findElements(By.css('div.locker-info-div'));

        for (let locker of lockers_161_215) {
        const leaseLocker = await locker.getAttribute('lease-locker');
        const className = await locker.getAttribute('class');

        if (className.includes('AvailableLockerInfo')) {
          console.log(`${leaseLocker} - Available`);
        } else if (className.includes('SingleUsePreservedLockerInfo')) {
          console.log(`${leaseLocker} - Single Use Preserved, Available`);
        } else if (className.includes('FlaggedLockerInfo') || className.includes('FlexibleReservedLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Reserved by ${leaseOwner}`);
        } else if (className.includes('ExpiredLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Expired - Reserved by ${leaseOwner}`);
        }
    }
                   // Select Locker Bank - HS02.01.120_216-270
        log("🔒 Selecting Locker Bank: HS02.01.120_216-270");
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_216-270']")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);

        // Get All Locker Elements
        const lockers_216_270 = await driver.findElements(By.css('div.locker-info-div'));

        for (let locker of lockers_216_270) {
        const leaseLocker = await locker.getAttribute('lease-locker');
        const className = await locker.getAttribute('class');

        if (className.includes('AvailableLockerInfo')) {
          console.log(`${leaseLocker} - Available`);
        } else if (className.includes('SingleUsePreservedLockerInfo')) {
          console.log(`${leaseLocker} - Single Use Preserved, Available`);
        } else if (className.includes('FlaggedLockerInfo') || className.includes('FlexibleReservedLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Reserved by ${leaseOwner}`);
        } else if (className.includes('ExpiredLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Expired - Reserved by ${leaseOwner}`);
        }
    }
      // Select Locker Bank - HS02.01.120_271-310
        log("🔒 Selecting Locker Bank: HS02.01.120_271-310");
        await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_271-310']")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@class='footerButton' and @value='View']")).click();
        await driver.sleep(3000);

        // Get All Locker Elements
        const lockers_271_310 = await driver.findElements(By.css('div.locker-info-div'));

        for (let locker of lockers_271_310) {
        const leaseLocker = await locker.getAttribute('lease-locker');
        const className = await locker.getAttribute('class');

        if (className.includes('AvailableLockerInfo')) {
          console.log(`${leaseLocker} - Available`);
        } else if (className.includes('SingleUsePreservedLockerInfo')) {
          console.log(`${leaseLocker} - Single Use Preserved, Available`);
        } else if (className.includes('FlaggedLockerInfo') || className.includes('FlexibleReservedLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Reserved by ${leaseOwner}`);
        } else if (className.includes('ExpiredLockerInfo')) {
          const leaseOwner = await locker.getAttribute('lease-owner');
          console.log(`${leaseLocker} - Expired - Reserved by ${leaseOwner}`);
        }
    }
      
      */
      
     // 🔐Add a Reservation🔐
     await driver.findElement(By.linkText('Add Reservation')).click();
     await driver.sleep(3000); // Wait for the page to load
     await driver.findElement(By.id('SalaryID')).sendKeys(login_lockers);
     await driver.findElement(By.xpath("//input[@class='gridResponsiveFilter' and @value='Search']")).click();
    await driver.sleep(2000);
    
    // Select User                                

    await driver.findElement(By.xpath(`//span[@title='${username_lockers}']`)).click();
    await driver.findElement(By.xpath("//input[@class='footerButton' and @value='Select']")).click();
    await driver.sleep(2000);
  
    // Select the reservation type

   
await driver.findElement(
  By.xpath("//button[@class='btn btn-daylocker choose-lease-btn' and @leasetype='6' and @leaseeid='7f8a8712-e353-e7ef-5c53-afc3d1e98942']")
).click();

    await driver.findElement(By.id("NeighbourhoodId")).click();
    await driver.findElement(By.xpath("//option[text()='Science Lv1']")).click();

    await driver.wait(until.elementIsVisible(await driver.wait(until.elementLocated(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_001-040']")), 300000)), 300000).click();


    // Select Locker Bank - HS02.01.120_001-040
    await driver.findElement(By.xpath("//span[@class='gridContentOverflow' and @title='HS02.01.120_001-040']")).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@class='footerButton' and @value='Select']")).click();
    await driver.sleep(3000);

    try {
      // Find the first available locker
      const availableLocker = await driver.findElement(By.css('div.AvailableReservationLockerInfo'));

      // Extract the locker number
      const lockerNumber = await availableLocker.findElement(By.css('span.lockerInfoCode')).getAttribute('data-actualvalue');

      // Click on the available locker
      await availableLocker.click();
      await driver.sleep(2000);

      // Click Select
      await driver.findElement(By.id('addReservation')).click();
      await driver.sleep(2000);

      // Print the reservation message with the locker number
      console.log(`Single Reservation made - locker #${lockerNumber}`);
    } catch (err) {
      console.log('No available lockers found.');
    }

    await driver.wait(until.elementLocated(By.id('NeighbourhoodId')), 300000);

      log("🟢 Locker navigation test steps completed successfully.");
    } catch (err) {
        process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
        throw err;
    } finally {
        // Optionally close the browser
        // await driver.quit();
    }
};
