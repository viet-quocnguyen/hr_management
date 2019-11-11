/*********************************************************************************
 * WEB322 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Quoc Viet Nguyen
 * Student ID: 107724189
 * Date: November 1st, 2019
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
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function(url, options) {
        return (
          `<li class=${url == app.locals.activeRoute ? "active" : ""}>` +
          `<a href="${url}">${options.fn(this)}</a>` +
          `</li>`
        );
      },
      equal: function(lvalue, rvalue, options) {
        if (arguments.length < 3) {
          throw new Error("Handlebars Helper equal needs 2 parameters");
        }
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      }
    }
  })
);

app.set("view engine", ".hbs");

// Setup multer for file storage
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

app.use((req, res, next) => {
  let route = req.baseUrl + req.path;

  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

// GET Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/employees", (req, res) => {
  if (req.query.status) {
    dataService
      .getEmployeesByStatus(req.query.status)
      .then(employees => {
        res.render("employees", { employees });
      })
      .catch(err => res.render({ message: err }));
  } else if (req.query.department) {
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then(employees => {
        res.render("employees", { employees });
      })
      .catch(err => res.render("employees", { message: err }));
  } else if (req.query.manager) {
    dataService
      .getEmployeesByManager(req.query.manager)
      .then(employees => {
        res.render("employees", { employees });
      })
      .catch(err => res.render("employees", { message: err }));
  } else {
    dataService
      .getAllEmployees()
      .then(employees => {
        if (employees.length > 0) {
          res.render("employees", { employees });
        } else {
          res.render("employees", { message: "No results" });
        }
      })
      .catch(err => {
        res.render("employees", { message: err });
      });
  }
});

app.get("/employee/:value", (req, res) => {
  dataService
    .getEmployeeByNum(req.params.value)
    .then(employee => {
      res.render("employee", { employee });
    })
    .catch(err => {
      res.json("employee", { message: err });
    });
});

app.get("/departments", (req, res) => {
  dataService
    .getDepartments()
    .then(departments => {
      if (departments.length > 0) {
        res.render("departments", { departments });
      } else {
        res.render("departments", { message: "No results" });
      }
    })
    .catch(err => {
      res.json({ message: err });
    });
});

app.get("/employees/add", (req, res) => {
  res.render("addEmployee");
});

app.get("/images/add", (req, res) => {
  res.render("addImage");
});

app.get("/images", (req, res) => {
  fs.readdir(path.join(__dirname, "/public/images/uploaded"), function(
    err,
    items
  ) {
    res.render("images", {
      images: items
    });
  });
});

// POST Routes
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
  dataService
    .addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch(() => {
      console.log("Error");
    });
});

app.post("/employee/update", (req, res) => {
  dataService.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  });
});

app.get("/departments/add", (req, res) => {
  res.render("addDepartment");
})

app.post("/departments/add", (req, res) => {
  dataService.addDepartment(req.body).then(() => res.redirect("/departments")).catch(() => console.log("Error"));
})

app.post("/department/update", (req, res) => {
  dataService.updateDepartment(req.body).then(() => res.redirect("/departments")).catch(() => console.log("Error"));
})

app.get("/department/:departmentId", (req, res) => {
  dataService.getDepartmentById(req.params.departmentId).then((data) => {
    if(data){
      res.render("department", data);
    }else{
      res.status(404).send("Department Not Found");
    }
  }).catch(() => {
    res.status(404).send("Department Not Found");
  })
})

app.get("/departments/delete/:departmentId", (req, res) => {
  dataService.deleteDepartmentById(req.params.departmentId).then(() => {
    res.redirect("departments");
  }).catch(() => {
    res.status(500).send("Unable to remove department");
  })
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
