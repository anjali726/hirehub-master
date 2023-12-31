// REQUIRING NPM MODULES
const bodyParser = require("body-parser"),
  express = require("express"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local").Strategy,
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  passportLocalMongoose = require("passport-local-mongoose"),
  session = require("express-session");
const app = express();
require("dotenv").config();

// DATABASE CONNECTION
let uri = "mongodb+srv://splicer:howyoudoin@hirehub.ccpod.mongodb.net/HireHub?retryWrites=true&w=majority";
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log(error));

// PASSPORT CONFIGURATION
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
require("./controllers/passport");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//LOCAL CONFIGURATION
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//REQUIRING MODELS
const Job = require("./models/job"),
  Notification = require("./models/job"),
  Question = require("./models/job"),
  User = require("./models/user");

//REQUIRING ROUTES
const authRoutes = require("./routes/auth"),
  homeRoutes = require("./routes/home"),
  jobRoutes = require("./routes/jobs"),
  notificationRoutes = require("./routes/notifications"),
  questionRoutes = require("./routes/questions"),
  userRoutes = require("./routes/users");

//USING ROUTES
app.use("/", authRoutes);
app.use("/", homeRoutes);
app.use(jobRoutes);
app.use(notificationRoutes);
app.use(questionRoutes);
app.use(userRoutes);

//PORT CONNECTION
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("server started");
});
