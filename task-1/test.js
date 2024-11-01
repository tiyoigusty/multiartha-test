const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
require("dotenv").config();

const options = new chrome.Options();
options.addArguments("--start-maximized");
options.addArguments("--disable-infobars");

(async function loginShopee() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get("https://shopee.co.id/buyer/login");

    await driver.wait(until.elementLocated(By.name("loginKey")), 10000);
    await driver.wait(until.elementLocated(By.name("password")), 10000);

    await driver
      .findElement(By.name("loginKey"))
      .sendKeys(`${process.env.EMAIL}`);
    await driver
      .findElement(By.name("password"))
      .sendKeys(`${process.env.PASSWORD}`);

    await driver.sleep(2000);

    const submitButton = await driver.wait(
      until.elementLocated(
        By.css(".b5aVaf.PVSuiZ.Gqupku.qz7ctP.qxS7lQ.Q4KP5g")
      ),
      15000
    );

    await driver.wait(until.elementIsVisible(submitButton), 10000);
    await submitButton.click();

    await driver.sleep(5000);
  } catch (error) {
    console.error("Error during login:", error);

    const pageSource = await driver.getPageSource();
    fs.writeFileSync("pageSource.html", pageSource);
    console.log("Page source saved to pageSource.html");
  } finally {
    await driver.quit();
  }
})();
