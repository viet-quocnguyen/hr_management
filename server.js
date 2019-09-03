var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    console.log("Hit / route")
    res.send("Hello World");

});

app.listen(HTTP_PORT, () => {
    console.log("Server is Running...");
});