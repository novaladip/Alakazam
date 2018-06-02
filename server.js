const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const morgan = require("morgan");
const compression = require("compression");
const zlip = require("zlib");

// Load User Models
const User = require("./models/User");

// Required route
const userRoute = require("./routes/users/user");
const projectRoute = require("./routes/project/project");
const reimbursementRoute = require("./routes/reimbursement/reimbursement");

// DB Config
const db = require("./config/keys").mongoURI;
const dbOption = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose
  .connect(db, dbOption)
  .then(() => console.log("Connected to DB Host"))
  .catch(err => console.log(err.message));

// App Config
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(methodOverride("_method"));
app.use(flash());
app.use(compression(9));
app.use(morgan("dev"));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Passport Configuration
// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: require("./config/keys").secretOrKey,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set req.user to currentUser also req.flash to error & sucess
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.moment = require("moment");
  next();
});

// Use route
app.use("/user", userRoute);
app.use("/project", projectRoute);
app.use("/reimbursement", reimbursementRoute);

app.get("/", (req, res) => {
  res.render("./index/landing");
});

app.get("*", (req, res) => {
  req.flash("error", "Page that you looking for is not found, sorry.");
  res.redirect("/");
});

// Port Config
const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) =>
  console.log(`Server running at http://localhost:${PORT}`)
);
