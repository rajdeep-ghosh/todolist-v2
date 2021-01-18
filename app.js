require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/modules/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

// Connect MongoDB at default port 27017.
mongoose.connect("mongodb+srv://" + process.env.AUTH + "@cluster0.mahaq.mongodb.net/todolistDB?retryWrites=true&w=majority", {
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

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

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
    const listName = req.body.list;
    
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save(function() {
            res.redirect("/");
        });
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            if (!err) {
                foundList.items.push(item);
                foundList.save(function () {
                    res.redirect("/" + listName);
                });
            } else {
                console.log(err);
            }
        });
    }
});

app.post("/delete", (req, res) => {
    const deleteItem = req.body.deleteItem;
    const listName = req.body.listName;

    if(listName === "Today") {
        Item.findByIdAndRemove(deleteItem, {useFindAndModify: false}, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully deleted item");
            }
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteItem}}}, {useFindAndModify: false}, (err, foundItems) => {
            if(!err) {
                res.redirect("/" + listName);
            }
        });
    }    
});

app.get("/:route", (req, res) => {
    const customListName = _.capitalize(req.params.route);

    List.findOne({name: customListName}, (err, foundList) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundList) {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save(function() {
                    res.redirect("/" + customListName);
                });
                
            } else {
                // Show an existing list
                res.render("list", {listTitle: foundList.name, newListItem: foundList.items});
            }
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(port, () => {
    console.log("Server started");
});