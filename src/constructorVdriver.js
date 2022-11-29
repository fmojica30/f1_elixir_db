import cheerio from "cheerio";
import puppeteer from "puppeteer";

async function getConstructorVDriver() {
  const baseUrl = "https://www.statsf1.com/en/constructeurs-";
}

export async function loadConstructorVDriverInfo(connection) {
  let dc_out = {
    first_name: "alexander",
    last_name: "albon",
    constructor: "Red Bull",
    fastest_laps: 0,
    laps_lead: 0,
    kilometers_lead: 0,
    laps_raced: 0,
    kilometers_raced: 0,
  };
  const sql = `
    INSERT INTO constructor_driver_pairings (driver, constructor, fastest_lap, laps_lead, kilometers_lead, laps_raced, kilometers_raced) 
    select 
      (select id as driver from driver where first_name = "${dc_out.first_name}" and last_name = "${dc_out.last_name}"),
      (select id as constructor from constructor where name = "${dc_out.constructor}"),
      (select "${dc_out.fastest_laps}" as fastest_lap),
      (select "${dc_out.laps_lead}" as laps_lead),
      (select "${dc_out.kilometers_lead}" as kilometers_lead),
      (select "${dc_out.laps_raced}" as laps_raced),
      (select "${dc_out.kilometers_raced}" as kilometers_raced)
    ;
    `;

  await connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Test");
    }
  });
}
