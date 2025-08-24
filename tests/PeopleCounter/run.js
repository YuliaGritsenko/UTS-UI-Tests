const { By, until } = require("selenium-webdriver");
const edge = require('selenium-webdriver/edge');

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

module.exports = async function(driver, parameters = {}) {
    // Initialize URLs and credentials
    const url = "https://peoplecounter.uts.edu.au/";
    const urlNewReport = "https://peoplecounter.uts.edu.au/SpaceAuditTechnology/reports/FOUBySpace?rt=FOUBySpace&a=Room&faculties=&departments=&campus=CB&buildings=CB04&level=05&room=&b=CB04.05&r=&tt=&capacityBand=&cmin=&cmax=&course=&class=&session=&dstart=2025-05-01&dend=2025-05-15&fdstart=2025-05-01&fdend=2025-05-15&time_period=&excludetype=Public&periodsInclude=all&booked_periods=1&walk_in_periods=1&days=1%2C2%2C3%2C4%2C5%2C6%2C7&tchooser=Day+Core&tstart=08%3A00&tend=18%3A00&OccPer=&CapPer=&gb=RoomName/";
    const ccode = parameters.CustomerCodepplcount1 || "";
    const password = parameters.PASSpplcount1 || "";
    const username = parameters.USERpplcount1 || "";

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
        await driver.sleep(7000); // Wait for login
/*
        log(`🌏 Navigating to ${url}`);
        await driver.get(urlNewReport);
        await driver.sleep(7000); // Wait for the page to load




        // Select Neighbourhood
        log("📍 Selecting neighbourhood: Science Lv1");
        await driver.findElement(By.id("NeighbourhoodId")).click();
        await driver.findElement(By.xpath("//option[text()='Science Lv1']")).click();
        await driver.sleep(2000);

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
      
      log("🟢 Locker navigation test steps completed successfully.");
    } catch (err) {
        process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
        throw err; */
    } finally {
        // Close the browser
        await driver.quit(); 
    } 
};