const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/modules/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

let items = [];
let workItems = [];

app.get("/", (req, res) => {
    const day = date.getDate();
    res.render("list", {listTitle: day, newListItem: items});
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work", newListItem: workItems});
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(port, () => {
    console.log("Server started");
});