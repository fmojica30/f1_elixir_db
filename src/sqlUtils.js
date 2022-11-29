export async function resetDB(connection) {
  //Deleting all data from tables
  connection.query("delete from driver;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: driver table data not deleted");
    } else {
      console.log("Reset DB: driver table data deleted");
    }
  });

  connection.query("delete from constructor;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: constructor table data not deleted");
    } else {
      console.log("Reset DB: constructor table data deleted");
    }
  });

  connection.query("delete from engine;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: engine table data not deleted");
    } else {
      console.log("Reset DB: engine table data deleted");
    }
  });

  connection.query("delete from grand_prix;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: grand_prix table data not deleted");
    } else {
      console.log("Reset DB: grand_prix table data deleted");
    }
  });

  // Reseting id count
  connection.query("ALTER TABLE driver AUTO_INCREMENT = 1;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: driver table auto increment not reset");
    } else {
      console.log("Reset DB: driver table auto increment reset");
    }
  });

  connection.query("ALTER TABLE constructor AUTO_INCREMENT = 1;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: constructor table auto increment not reset");
    } else {
      console.log("Reset DB: constructor table auto increment reset");
    }
  });

  connection.query("ALTER TABLE engine AUTO_INCREMENT = 1;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: engine table auto increment not reset");
    } else {
      console.log("Reset DB: engine table auto increment reset");
    }
  });

  connection.query("ALTER TABLE grand_prix AUTO_INCREMENT = 1;", (err) => {
    if (err) {
      console.log(err);
      console.log("Reset DB: grand_prix table auto increment not reset");
    } else {
      console.log("Reset DB: grand_prix table auto increment reset");
    }
  });
}
