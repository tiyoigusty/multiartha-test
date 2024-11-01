const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const options = new chrome.Options();
options.addArguments("--start-maximized");
options.addArguments("--disable-infobars");

async function testLogin() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get("http://localhost:5173/login");

    await driver
      .findElement(By.id("email"))
      .sendKeys("contohadmin@example.com");
    await driver
      .findElement(By.id("password"))
      .sendKeys("12341234", Key.RETURN);

    await driver.wait(until.urlContains("/admin"), 5000);
    console.log("Login berhasil dan akses dashboard berhasil diverifikasi");

    const dashboardText = await driver
      .findElement(By.css("nav a span"))
      .getText();
    if (dashboardText === "Dashboard Admin") {
      console.log("Berhasil mengakses halaman dashboard");
    } else {
      console.log("Gagal mengakses halaman dashboard");
    }
  } catch (error) {
    console.error("Pengujian gagal:", error);
  } finally {
    await driver.quit();
  }
}

testLogin();
