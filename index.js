// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Setup EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
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



// Setup routes
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {
    // Omitted validation check
    //  Can get this from the page rather than using another DB call.
    //  Add it as a hidden form value.
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