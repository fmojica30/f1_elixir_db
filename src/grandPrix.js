import cheerio from "cheerio";
import puppeteer from "puppeteer";

async function getGrandPrixInfo() {
  const baseUrl = "https://www.statsf1.com/en/grands-prix.aspx";
  const browser = await puppeteer.launch();
  let gp_out = [];
  const page = await browser.newPage();
  await page.goto(baseUrl);
  await page.waitForSelector("#ctl00_CPH_Main_GV_GrandPrix");
  const data = await page.evaluate(() => document.querySelector("*").outerHTML);
  const $ = cheerio.load(data);
  $(".sortable>tbody>tr").each((j, el) => {
    var gp = {
      name: "",
      number: "",
      first: "",
      last: "",
    };
    $(el)
      .find("td")
      .each((i, el) => {
        if (i === 0) {
          gp.name = $(el).text().toLowerCase();
        } else if (i === 1) {
          gp.number = $(el).text();
        } else if (i === 2) {
          gp.first = $(el).text();
        } else if (i === 3) {
          gp.last = $(el).text();
        }
      });
    gp_out.push(gp);
  });
  page.close();
  return gp_out;
}

export async function loadGrandPrixInfo(connection) {
  const info = await getGrandPrixInfo();
  const sql =
    "INSERT INTO grand_prix (name, number, start_year, last_year) VALUES ?";
  const values = info.map((gp) => [
    gp.name,
    gp.number,
    gp.first,
    gp.last
  ]);
  connection.query(sql, [values], (err) => {
    if (err) {
      console.log("Load Grand Prix Info: Data not loaded");
      console.log(err);
    } else {
      console.log("Load Grand Prix Info: Data loaded");
    }
  });
}
