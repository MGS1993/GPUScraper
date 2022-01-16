const puppeteer = require("puppeteer");

async function scrapeProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4691.0 Safari/537.36"
    );
    await page.goto(url);

    const titleHandle = await page.$("div.sku-title > h1");
    const titleHInnerText = await titleHandle.getProperty("textContent");
    const titleValue = await titleHInnerText.jsonValue();

    const elementHandle = await page.$(
      "div.fulfillment-add-to-cart-button > div > div > button"
    );
    const jsHandle = await elementHandle.getProperty("disabled");
    const buttonDisableStatus = await jsHandle.jsonValue();

    if (buttonDisableStatus === false) {
      console.log(`stock available for ${titleValue}`);
    } else {
      console.log("no stock available...");
    }
    await browser.close();
  } catch (error) {
    console.log("Error has caused script to crash:", error);
    await browser.close();
  }
}

setInterval(() => {
  scrapeProduct(
    "https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440"
  );
  scrapeProduct(
    "https://www.bestbuy.com/site/asus-tuf-rtx3080ti-12gb-gddr6-pci-express-4-0-graphics-card-black/6466932.p?skuId=6466932"
  );
}, 30000);
