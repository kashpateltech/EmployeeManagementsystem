const mysql = require("mysql2");

const connection = require("./sql_login");

const asTable = require("as-table").configure({ delimiter: " | ", dash: "-" });

class SQLqueries {
  constructor(query, values) {
    this.query = query;
    this.values = values;
  }
  generalTableQuery(nextStep) {
    connection.query(this.query, this.values, function (err, res) {
      if (err) throw err;
      console.log("\n");
      console.log(asTable(res));
      console.log("\n");
      nextStep();
    });
  }
  getQueryNoRepeats(nextStep, paramterToPass) {
    connection.query(this.query, this.values, function (err, res) {
      if (err) throw err;
      let titleArr = [];
      for (let i = 0; i < res.length; i++) {
        if (!titleArr.includes(res[i].title)) titleArr.push(res[i].title);
      }
      nextStep(titleArr, paramterToPass);
    });
  }
  delete(nextStep) {
    connection.query(this.query, this.values, function (err, res) {
      if (err) throw err;
      console.log("Delete Sucessfull")
      nextStep();
    });
  }
  update(nextStep, message) {
    connection.query(this.query, this.values, function (err, res) {
        if (err) throw err;
        console.log(message)
        nextStep();
      });
  }
  queryReturnResult(nextStep){
    connection.query(this.query, this.values, function (err, res) {
        if (err) throw err;       
        nextStep(res);
      });
  }
}

module.exports = SQLqueries;