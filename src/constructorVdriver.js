import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { getDriverNames } from "./sqlUtils.js";

async function getConstructorVDriver(dn) {
  const baseUrl = "https://www.statsf1.com/en/";
  const browser = await puppeteer.launch();
  let output = [];
  for (const e of dn) {
    const page = await browser.newPage();
    console.log(
      baseUrl +
        e.first_name.split().join("-") +
        "-" +
        e.last_name.split().join("-") +
        "/constructeur.aspx"
    )
    await page.goto(
      baseUrl +
        e.first_name.split().join("-") +
        "-" +
        e.last_name.split().join("-") +
        "/constructeur.aspx"
    );
    await page.waitForSelector("#content");
    const data = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );
    const $ = cheerio.load(data);

    $(".sortable>tbody>tr").each((j, jel) => {
      let pair = {
        first_name: e.first_name,
        last_name: e.last_name,
        constructor: "",
        fastest_laps: "",
        laps_lead: "",
        kilometers_lead: "",
        laps_raced: "",
        kilometers_raced: "",
      };
      $(jel)
        .find("td")
        .each((i, iel) => {
          if (i === 0) {
            pair.constructor = $(iel).text().trim();
          } else if (i === 5) {
            pair.fastest_laps = $(iel).text().trim();
          } else if (i === 9) {
            pair.laps_lead = $(iel).text().trim();
          } else if (i === 10) {
            pair.kilometers_lead = $(iel).text().trim();
          } else if (i === 11) {
            pair.laps_raced = $(iel).text().trim();
          } else if (i === 12) {
            pair.kilometers_raced = $(iel).text().trim();
          }
        });
      output.push(pair);
    });
    page.close();
  }
  browser.close();
  return output;
}

export async function loadConstructorVDriverInfo(connection) {
  const dn = await getDriverNames(connection);
  const di = await getConstructorVDriver(dn);

  for (const dc in di) {
    const sql = `
    INSERT INTO constructor_driver_pairings (driver, constructor, fastest_lap, laps_lead, kilometers_lead, laps_raced, kilometers_raced) 
    select 
      (select id as driver from driver where first_name = "${dc.first_name}" and last_name = "${dc.last_name}"),
      (select id as constructor from constructor where name = "${dc.constructor}"),
      (select "${dc.fastest_laps}" as fastest_lap),
      (select "${dc.laps_lead}" as laps_lead),
      (select "${dc.kilometers_lead}" as kilometers_lead),
      (select "${dc.laps_raced}" as laps_raced),
      (select "${dc.kilometers_raced}" as kilometers_raced)
    ;
    `;

    connection.query(sql, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Test");
      }
    });
  }
}
