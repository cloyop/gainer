import { chromium } from "playwright";
import { genMessageFromData } from "./tel.js";

const url =
  "https://es.bitdegree.org/precios-criptomonedas/principales-cripto-ganadores-hoy";

export default async function circle() {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    const [payload, hasError] = await getLastData(page);
    if (hasError === true) throw Error(`Error getting last data: ${payload}`);
    if (payload.length === 0) throw Error(`No payload${payload}`);
    await page.close();
    await browser.close();
    await genMessageFromData(payload);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
//
async function getLastData(page = undefined) {
  if (page === undefined) return null;
  try {
    return page.evaluate(() => {
      const data = [];
      const genDataFill = (coinrank, name, symbol, price, percent, up) => {
        return {
          coinrank,
          name,
          symbol,
          price,
          percent,
          up,
        };
      };
      const $ = (from, selector) => from.querySelector(selector);
      const ContainerReference = $(document, ".container.py-2 > div");
      const childs = ContainerReference.childNodes;
      childs.forEach((element, index) => {
        if (index === childs.length - 1) {
          return;
        }
        const statsC = $(element, ".stats-card");
        if (statsC.textContent.toLowerCase().includes("rentable")) {
          const newStore = {
            title: "",
            coins: [],
          };
          statsC.childNodes.forEach((el) => {
            if (el.classList.contains("title")) {
              newStore.title = el.textContent;
              return;
            }
            const fas = $(el, ".coin-price-info  .fas");
            const coint = $(el, ".coin-rank").textContent;
            const name = $(el, ".name").textContent;
            const symbol = $(el, ".coin-item-symbol").textContent;
            const price = $(el, ".coin-price-info  .stat").textContent;
            const percent = fas.parentElement.textContent;
            const up = fas.classList.contains("fa-caret-up") ? true : false;
            newStore.coins.push(
              genDataFill(coint, name, symbol, price, percent, up)
            );
          });
          data.push(newStore);
        }
      });
      return [data, false];
    });
  } catch (error) {
    console.log(error);
    return [error, true];
  }
}
