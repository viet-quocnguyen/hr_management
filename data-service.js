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

module.exports.getEmployeesByStatus = function(status) {
  return new Promise((resolve, reject) => {
    var tempArr = employees.filter(employee => employee.status === status);
    if (tempArr.length === 0) {
      reject("No results returned");
    } else {
      resolve(tempArr);
    }
  });
};

module.exports.getEmployeesByDepartment = function(department) {
  return new Promise((resolve, reject) => {
    var tempArr = employees.filter(
      employee => employee.department == department
    );
    if (tempArr.length === 0) {
      reject("No results returned");
    } else {
      resolve(tempArr);
    }
  });
};

module.exports.getEmployeesByManager = function(manager) {
  return new Promise((resolve, reject) => {
    var tempArr = employees.filter(
      employee => employee.employeeManagerNum == manager
    );
    if (tempArr.length === 0) {
      reject("No results returned");
    } else {
      resolve(tempArr);
    }
  });
};

module.exports.getEmployeeByNum = function(num) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].employeeNum == num) {
        resolve(employees[i]);
        break;
      }
    }
    reject("No results returned");
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

module.exports.addEmployee = function(employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = !employeeData.isManager ? false : true;
    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    resolve(employees);
  });
};

module.exports.updateEmployee = function(employeeData) {
  return new Promise((resolve, reject) => {
    employees.forEach((employee, index) => {
      if (employee.employeeNum == employeeData.employeeNum) {
        employees[index] = employeeData;
        return resolve();
      }
    });
  });
};
