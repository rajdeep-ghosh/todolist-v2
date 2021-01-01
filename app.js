const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Working!");
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});