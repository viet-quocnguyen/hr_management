const fs = require("fs");

var employees = [];
var departments = [];

module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/employees.json", (err, data) => {
      if (err) reject("Unable to read file");
      employees = JSON.parse(data);
    });

    fs.readFile("./data/departments.json", (err, data) => {
      if (err) reject("Unable to read file");
      departments = JSON.parse(data);
    });
    resolve("Read file successfully");
  });
};

module.exports.getAllEmployees = function() {
  return new Promise((resolve, reject) => {
    if (employees.length === 0) {
      reject("No results returned");
    }
    resolve(employees);
  });
};

module.exports.getManagers = function() {
  var managers = [];
  employees.forEach(employee => {
    if (employee.isManager === true) {
      managers.push(employee);
    }
  });
  return new Promise((resolve, reject) => {
    if (managers.length === 0) {
      reject("No results returned");
    }
    resolve(managers);
  });
};

module.exports.getDepartments = function() {
  return new Promise((resolve, reject) => {
    if (departments.length === 0) {
      reject("No results returned");
    }
    resolve(departments);
  });
};
