// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");
const path = require("path");
const multer = require("multer");
const upload = multer();

app.use(express.urlencoded({ extended: false }));
// npm start


// Setup EJS
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});
//Setup routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/", async (req, res) => {

    const totRecs = await dblib.getTotalRecords();

    const car = {
        carvin: "",
        carmake: "",
        carmodel: "",
        carmileage: ""
    };
    res.render("index", {
        type: "get",
        totRecs: totRecs.totRecords,
        car: car
    });
});

// app.post("/", upload.array(), async (req, res) => {
//     dblib.findProducts(req.body)
//         .then(result => res.send(result))
//         .catch(err => res.send({ trans: "Error", result: err.message }));

// });

// app.get("/", async (req, res) => {
//     // Omitted validation check
//     const totRecs = await dblib.getTotalRecords();
//     res.render("index", {
//         type: "get",
//         totRecs: totRecs.totRecords
//     });
// });

app.post("/", async (req, res) => {

    const totRecs = await dblib.getTotalRecords();

    dblib.findProducts(req.body)
        .then(result => {
            res.render("index", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: result,
                car: req.body
            })
        })
        .catch(err => {
            res.render("index", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: `Unexpected Error: ${err.message}`,
                car: req.body
            });
        });
});
