const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const today = new Date();
    const currentDay = today.getDay();
    var day = "";

    switch (currentDay) {
        case 0:
            day = "Sunday";
            break;

        case 1:
            day = "Monday";
            break;
        
        case 2:
            day = "Tuesday";
            break;

        case 3:
            day = "Wednesday";
            break;

        case 4:
            day = "Thursday";
            break;

        case 5:
            day = "Friday";
            break;

        case 6:
            day = "Saturday";
            break;
        
        default:
            console.log(currentDay);
            break;
    }

    res.render("list", {kindOfDay: day});
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});