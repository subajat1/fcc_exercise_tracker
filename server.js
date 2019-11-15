const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const shortid = require("shortid");

const mongoose = require("mongoose");
mongoose.connect(process.env.MLAB_URI);
const Schema = mongoose.Schema;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var router = express.Router();

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

var enableCORS = function(req, res, next) {
  if (!process.env.DISABLE_XORIGIN) {
    var allowedOrigins = ['https://marsh-glazer.gomix.me','https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin;
    if(!process.env.XORIGIN_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(req.method);
      res.set({
        "Access-Control-Allow-Origin" : origin,
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept"
      });
    }
  }
  next();
};


app.use('/api', enableCORS, router);

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const exerciseSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String },
  duration: Number,
  date: Date
});

var Exercise = mongoose.model("Exercise", exerciseSchema);

const userSchema = new Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true }
});

var User = mongoose.model("User", userSchema);

router.get('/test', function(req, res) {
  res.json({"test": "123"})
});

router.get('/mongo-connection', function(req, res) {
  if (mongoose) {
    res.json({isMongooseOk: !!mongoose.connection.readyState})
  } else {
    res.json({isMongooseOk: false})
  }
});



router.post("/exercise/new-user", function(req, res) {
  
  let user = new User({
    username: req.body.username,
    userId: shortid.generate()
  });

  res.json({
    username: user.username,
    _id: user.id
  });
});

router.post("/exercise/add", function (req, res) {
  let exercise = new Exercise(req.body);
  
  res.json({
    "username":"test321321",
    "description":"descdesc",
    "duration":321,
    "_id":"rknc2Bnir",
    "date":"Tue Jan 01 2019"
  });
});

router.get("/exercise/log", function (req, res) {
  res.json({
    data: []
  })
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
