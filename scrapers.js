const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "manuelguzmandev@gmail.com",
    pass: process.env.PASSWORD,
  },
});

const mailOptions = {
  from: "manuelguzmandev@gmail.com",
  to: "m_guzman74@yahoo.com",
  subject: null,
  text: null,
};

async function BBScrape(url) {
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

      mailOptions.subject = "Stock available";
      mailOptions.text = `stock available for ${titleValue}. Click here to navigate to item: ${url}`;

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log("Email sent:" + info.response);
        }
      });
    } else {
      console.log("no stock available...");
    }
  } catch (error) {
    console.log("Error has caused script to crash:", error);
    await browser.close();
  } finally {
    await browser.close();
  }
}

const scrapeAddresses = {
  BB: [
    "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3080-aorus-master-10gb-rev-2-0-gddr6x-pci-express-4-0-graphics-card/6462198.p?skuId=6462198",
    "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3080-aorus-master-10gb-gddr6x-pci-express-4-0-graphics-card/6436223.p?skuId=6436223",
    "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3080-gaming-oc-10gb-gddr6x-pci-express-4-0-graphics-card/6430620.p?skuId=6430620",
    "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3080-eagle-oc-10gb-gddr6x-pci-express-4-0-graphics-card/6430621.p?skuId=6430621",
    "https://www.bestbuy.com/site/asus-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-strix-graphics-card-black/6432445.p?skuId=6432445",
    "https://www.bestbuy.com/site/evga-rtx-3080-12gb-ftw3-ultra-gaming-12g-p5-4877-kl-pci-express-4-0-lhr/6494860.p?skuId=6494860",
    "https://www.bestbuy.com/site/msi-nvidia-geforce-rtx-3080-ventus-3x-10g-oc-bv-gddr6x-pci-express-4-0-graphic-card-black-sliver/6430175.p?skuId=6430175",
    "https://www.bestbuy.com/site/evga-geforce-rtx-3080-xc3-ultra-gaming-10gb-gddr6-pci-express-4-0-graphics-card/6432400.p?skuId=6432400",
    "https://www.bestbuy.com/site/msi-nvidia-geforce-rtx-3080-ventus-3x-10g-oc-lhr-gddr6x-pci-express-4-0-graphic-card-black/6471287.p?skuId=6471287",
    "https://www.bestbuy.com/site/asus-geforce-rtx-3080-v2-10gb-gddr6x-pci-express-4-0-strix-graphics-card-black/6475238.p?skuId=6475238",
    "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3080-aorus-master-10gb-rev3-0-gddr6x-pci-express-4-0-graphics-card/6471950.p?skuId=6471950",
    "https://www.bestbuy.com/site/msi-nvidia-geforce-rtx-3080-gaming-z-trio-10g-lhr-10gb-gddr6x-pci-express-4-0-graphic-card-black/6480289.p?skuId=6480289",
    "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3080-vision-oc-10gb-gddr6x-pci-express-4-0-graphics-card/6471957.p?skuId=6471957",
    "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-3080-vision-oc-10gb-gddr6x-pci-express-4-0-graphics-card/6436219.p?skuId=6436219",
    "https://www.bestbuy.com/site/evga-rtx-3080-xc3-ultra-gaming-10g-p5-3885-kh-pci-express-4-0-lhr/6471615.p?skuId=6471615",
    "https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440",
    "https://www.bestbuy.com/site/asus-tuf-rtx3080ti-12gb-gddr6-pci-express-4-0-graphics-card-black/6466932.p?skuId=6466932",
  ],
};

const intervalFunc = (addressArray, scraper) => {
  // console.log("the length of the address array is:", addressArray.length);
  for (let i = 0; i <= addressArray.length - 1; i++) {
    scraper(addressArray[i]);
  }
};

setInterval(() => {
  intervalFunc(scrapeAddresses.BB, BBScrape);
}, 30000);
