const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const options = new chrome.Options();
options.addArguments("--start-maximized");
options.addArguments("--disable-infobars");

(async function testChatGPTResponse() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get("http://localhost:5173");

    let questionInput = await driver.wait(
      until.elementLocated(By.css('input[type="text"]')),
      10000
    );

    await questionInput.sendKeys("Apa itu ChatGPT?");

    let submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );
    await submitButton.click();

    // Tunggu elemen respons
    let responseElement = await driver.wait(
      until.elementLocated(By.css("p")),
      15000
    );

    let responseText = await responseElement.getText();
    console.log("Respons dari ChatGPT:", responseText);

    // Tunggu elemen error jika ada
    try {
      let errorElement = await driver.wait(
        until.elementLocated(By.css("p.error")),
        5000
      );
      let errorText = await errorElement.getText();
      console.log("Pesan error:", errorText);
    } catch (err) {
      console.log("Tidak ada pesan error.");
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    await driver.quit();
  }
})();
