var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Quoc Viet Nguyen - 107724189");

});

app.listen(HTTP_PORT, () => {
    console.log("Server is Running...");
});