const fs = require('fs');

var employees = [];
var departments = [];

module.exports.initialize = () => {
    fs.readFile("./data/employees.json", (err, data) => {
        if (err) throw err;
        employees = JSON.parse(data);
        
        return employees;
    })
}