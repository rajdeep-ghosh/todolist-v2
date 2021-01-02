const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var items = [];

app.get("/", (req, res) => {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    };
    
    const day = today.toLocaleDateString("en-US", options);
    res.render("list", {kindOfDay: day, newListItem: items});
});

app.post("/", (req, res) => {
    var item = req.body.newItem;
    items.push(item);

    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});