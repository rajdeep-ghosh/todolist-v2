const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

let items = [];

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
    let item = req.body.newItem;
    items.push(item);

    res.redirect("/");
});

app.listen(port, () => {
    console.log("Server started at port 3000");
});