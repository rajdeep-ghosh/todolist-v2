const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/modules/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

// let items = [];
let workItems = [];

// Connect MongoDB at default port 27017.
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.');
    } else {
        console.log('Error in DB connection: ' + err);
    }
});

// Make itemsSchema for the db
const itemsSchema = new mongoose.Schema({
    name: String
});

// Make new model for itemsSchema
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Click on the + to add a new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
    Item.find({}, (err, foundItems) => {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, (err) => {
                    if (!err) {
                        console.log("Successfully inserted");
                    } else {
                        console.log(err);
                    }
                });
                res.redirect("/");
            } else {
                res.render("list", {listTitle: "Today", newListItem: foundItems});
            }
        }
    });
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
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