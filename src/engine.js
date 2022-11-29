import cheerio from "cheerio";
import puppeteer from "puppeteer";

async function getEngineInfo() {
  const baseUrl = "https://www.statsf1.com/en/moteurs-";
  const browser = await puppeteer.launch();
  let engine_out = [];
  let skips = [24, 21, 17]
  for (let i = 0; i < 26; i++) {
    if (skips.includes(i)) {
      continue;
    }

    var chr = String.fromCharCode(97 + i); // where n is 0, 1, 2 ...
    const page = await browser.newPage();
    await page.goto(baseUrl + chr + ".aspx");
    await page.waitForSelector("#content > div:nth-child(2)");
    const data = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );
    const $ = cheerio.load(data);

    $(".sortable>tbody>tr").each((j, el) => {
      let engine = {
        name: "",
        active: false,
        nation: "",
        start_year: "",
        winner: false,
        wc: false
      }

      $(el).find("td").each((i, el) => {
        if (i === 0) {
          engine.name = $(el).text().trim();
          $(el).find("a").find("span").attr("class") === "CurEngine"
          ? (engine.active = true)
          : (engine.active = false);
        } else if (i === 1){
          let nation = $(el).attr("sorttable_customkey");
            if (nation !== undefined) {
              engine.nation = nation;
            }
        } else if (i === 2){
          engine.start_year = $(el).text();
        } else if (i === 3){
          $(el).find("img").attr("src") === "/images/spacer.gif"
              ? (engine.winner = false)
              : (engine.winner = true);
        } else if (i === 4){
          $(el).find("img").attr("src") === "/images/spacer.gif"
              ? (engine.wc = false)
              : (engine.wc = true);
        }
      })
      engine_out.push(engine);
    })
    page.close
  }
  return engine_out;
}

export async function loadEngineInfo(connection) {
  const info = await getEngineInfo();
  const sql = "INSERT INTO engine (name, active, nation, start_year, winner, world_champion) VALUES ?";
  const values = info.map((x) => [
    x.name,
    x.active,
    x.nation,
    x.start_year,
    x.winner,
    x.wc,
  ]);
  connection.query(sql, [values], (err) => {
    if (err) {
      console.error("Load Engine Info: Data not loaded");
      console.log(err);
    } else {
      console.error("Load Engine Info: Data loaded");
    }
  });
}