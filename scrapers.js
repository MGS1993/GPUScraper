const puppeteer = require("puppeteer");

async function scrapeProduct(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4691.0 Safari/537.36"
    );
    await page.goto(url);

    const [el] = await page.$x(
      "/html/body/div[3]/main/div[2]/div/div[1]/div[3]/div[2]/div/div[2]/div[1]/div/div/div/button"
    );

    const disabledProp = await el.getProperty("disabled");
    const isDisabled = await disabledProp.jsonValue();

    console.log(disabledProp);
    console.log({ isDisabled });

    browser.close();

    if (isDisabled === false) {
      console.log("Gpu stock available!");
    } else {
      console.log("Gpu stock sold out. Bummer.");
    }
  } catch (error) {
    console.log("Error has caused script to crash:", error);
  }
}

scrapeProduct(
  "https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440"
);
