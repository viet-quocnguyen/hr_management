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

var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Quoc Viet Nguyen - 107724189");
});

app.listen(HTTP_PORT, () => {
  console.log("Server is Running...");
});
