/*********************************************************************************
 * WEB322 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Quoc Viet Nguyen
 * Student ID: 107724189
 * Date: Sept 08,2019
 *
 * Online (Heroku) URL: https://web322-qvnguyen.herokuapp.com
 *
 ********************************************************************************/
var data = require("./data-service.js");
var employeesData = require("./data/employees.json");
var departmentsData = require("./data/departments.json");
var dataService = require("./data-service.js");
var express = require("express");
var path = require("path");
var app = express();




var HTTP_PORT = process.env.PORT || 8080;
app.use(express.static('public'));
app.get("/", (req, res) => {
  
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
})

app.get("/employees", (req, res) => {
  res.json(employeesData);
})

app.get("/departments", (req, res) => {
  res.json(departmentsData);
})

app.get("/managers", (req, res) => {
  var managersData = [];
  employeesData.forEach((employee) => {
    if(employee.isManager === true){
      managersData.push(employee);
    }
  })
  res.json(managersData);
})

app.use((req, res) => {
  res.status(404).send("Page not found");
})

app.listen(HTTP_PORT, () => {
  console.log(`Express http server listening on ${HTTP_PORT}`);
});
