/*********************************************************************************
 * WEB322 – Assignment 02
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Quoc Viet Nguyen
 * Student ID: 107724189
 * Date: September 24th, 2019
 *
 * Online (Heroku) Link: https://web322-qvnguyen.herokuapp.com/
 *
 ********************************************************************************/

// Configuration
var dataService = require("./data-service.js");
var express = require("express");
var path = require("path");
var app = express();
var multer = require("multer");
const fs = require("fs");

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

// Setup multer for file storage
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({ storage: storage });

// GET Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", (req, res) => {
  dataService
    .getAllEmployees()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ message: err });
    });
});

app.get("/departments", (req, res) => {
  dataService
    .getDepartments()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ message: err });
    });
});

app.get("/managers", (req, res) => {
  dataService
    .getManagers()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ message: err });
    });
});

app.get("/employees/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addEmployee.html"));

})

app.get("/images/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addImage.html"));
})

app.get("/images", (req, res) => {
  fs.readdir(path.join(__dirname, "/public/images/uploaded"), function (err, items) {
    res.json({
      images: items
    })
  });
})

// POST Routes
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
})

// Middleware
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Fetch JSON data and listen to the port
dataService
  .initialize()
  .then(res => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
