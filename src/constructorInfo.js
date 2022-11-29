import cheerio from "cheerio";
import puppeteer from "puppeteer";

async function getConstructorInfo() {
  const baseUrl = "https://www.statsf1.com/en/constructeurs-";
  const browser = await puppeteer.launch();
  let constructor_out = [];
  let skips = [23, 24, 20, 16];

  for (let i = 0; i < 26; i++) {
    // No drivers with X last name so skip
    if (skips.includes(i)) {
      continue;
    }

    var chr = String.fromCharCode(97 + i); // where i is 0, 1, 2 ...
    const page = await browser.newPage();
    await page.goto(baseUrl + chr + ".aspx");
    await page.waitForSelector("#ctl00_CPH_Main_GV_Constructeur");
    const data = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );
    const $ = cheerio.load(data);

    //Iterating through table rows
    $(".sortable>tbody>tr").each((j, el) => {
      let constructor = {
        name: "",
        active: false,
        nation: "",
        start_year: 0,
        winner: false,
        wc: false,
      };

      $(el)
        .find("td")
        //Iterating through columns in row
        .each((i, el) => {
          if (i === 0) {
            constructor.name = $(el).text().trim();
            $(el).find("a").find("span").attr("class") === "CurConstructor"
              ? (constructor.active = true)
              : (constructor.active = false);
          } else if (i === 1) {
            let nation = $(el).attr("sorttable_customkey");
            if (nation !== undefined) {
              constructor.nation = nation;
            }
          } else if (i === 2) {
            constructor.start_year = $(el).text();
          } else if (i === 3) {
            $(el).find("img").attr("src") === "/images/spacer.gif"
              ? (constructor.winner = false)
              : (constructor.winner = true);
          } else {
            $(el).find("img").attr("src") === "/images/spacer.gif"
              ? (constructor.wc = false)
              : (constructor.wc = true);
          }
        });
      constructor_out.push(constructor);
    });
    page.close();
  }
  return constructor_out;
}

export async function loadConstructorInfo(connection) {
  const constructorInfo = await getConstructorInfo();
  const sql = "INSERT INTO constructor (name, active, nation, start_year, winner, world_champion) VALUES ?";
  const values = constructorInfo.map((c) => [
    c.name,
    c.active,
    c.nation,
    c.start_year,
    c.winner,
    c.wc,
  ]);
  connection.query(sql, [values], (err) => {
    if (err) {
      console.log("Load Constructor Info: Data not loaded");
      console.log(err);
    } else {
      console.log("Load Constructor Info: Data loaded");
    }
  });
}
