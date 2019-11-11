const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "d88ko6cl35v936",
  "bicvztzdxkxssj",
  "fce52aa890064e708a83c5aafd87b973360b0970733a074cb4f8bd6883385720",
  {
    host: "ec2-174-129-253-53.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: true
    }
  }
);

var Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING
});

var Department = sequelize.define("Department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

Department.hasMany(Employee, { foreignKey: "department" });

module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllEmployees = function() {
  return new Promise((resolve, reject) => {
    Employee.findAll()
      .then(data => {
        resolve(data);
      })
      .catch(() => reject("no results returned"));
  });
};

module.exports.getEmployeesByStatus = function(status) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        status: status
      }
    })
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getEmployeesByDepartment = function(department) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        department: department
      }
    })
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getEmployeesByManager = function(manager) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeManagerNum: manager
      }
    })
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getEmployeeByNum = function(num) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeNum: num
      }
    })
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getDepartments = function() {
  return new Promise((resolve, reject) => {
    Department.findAll({})
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addEmployee = function(employeeData) {
  employeeData.isManager = employeeData.isManager ? true : false;
  for (let prop in employeeData) {
    if (employeeData[prop] === "") {
      employeeData[prop] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Employee.create(employeeData)
      .then(() => resolve())
      .catch(() => reject("unable to create employee"));
  });
};

module.exports.updateEmployee = function(employeeData) {
  employeeData.isManager = employeeData.isManager ? true : false;
  for (let prop in employeeData) {
    if (employeeData[prop] === "") {
      employeeData[prop] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Employee.update(
      {
        ...employeeData
      },
      {
        where: {
          employeeNum: employeeData.employeeNum
        }
      }
    )
      .then(() => resolve())
      .catch(() => reject("unable to update employee"));
  });
};

module.exports.addDepartment = function(departmentData){
  for (let prop in departmentData) {
    if (departmentData[prop] === "") {
      departmentData[prop] = null;
    }
  }

  return new Promise((resolve, reject) => {
    Department.create(departmentData).then(() => resolve()).catch(() => reject("unable to create department"));
  });
}

module.exports.updateDepartment = function(departmentData) {
  
  for (let prop in departmentData) {
    if (departmentData[prop] === "") {
      departmentData[prop] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Department.update(
      {
        ...departmentData
      },
      {
        where: {
          departmentId: departmentData.departmentId
        }
      }
    )
      .then(() => resolve())
      .catch(() => reject("unable to update employee"));
  });
};

module.exports.getDepartmentById = function(id){
  return new Promise((resolve, reject) => {
    Department.findAll( {
      where: {
        departmentId: id
      }
    }).then((data) => resolve(data[0])).catch(() => reject("no results returned"));
  })
}

module.exports.deleteDepartmentById = function(id){
  return new Promise((resolve, reject) => {
    Department.destroy({
      where: {
        departmentId: id
      }
    }).then(() => resolve())
    .catch(() => reject("unable to delete department"));
  })
}