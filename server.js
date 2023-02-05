require("./db/db");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBstore = require("connect-mongodb-session")(session);
const PORT = 5000;
require("dotenv").config();
//model
const Guide = require("./model/guide");

const dbUrl = "mongodb://0.0.0.0:27017/tourist";
const app = express();

//guide session
const oSessionStore = new MongoDBstore({
  //calling constructor
  uri: dbUrl,
  collection: "guidesession",
});
//routes
const guideRoute = require("./routes/guide");
const adminRoute = require("./routes/admin");
const publicRoute = require("./routes/publicCon");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use("/profile", express.static("upload/images"));
//session setup
app.use(
  session({
    secret: "Guide and Tourist is awsome",
    resave: false,
    saveUninitialized: false,
    store: oSessionStore,
  })
);

app.use((req, res, next) => {
  if (!req.session.guide) {
    return next();
  }
  Guide.findById(req.session.guide._id)
    .then((guide) => {
      req.guide = guide;
      next();
    })
    .catch((err) => console.log(err));
});
//local variable
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

//admin login
app.use((req, res, next) => {
  if (!req.session.admin) {
    return next();
  }
  req.admin = {
    adminname: process.env.ADMIN_ID,
    adminpass: process.env.ADMIN_PASS,
  };
  next();
});
app.use((req, res, next) => {
  res.locals.isAdminAuthenticated = req.session.isAdminLoggedIn;
  next();
});
app.use(publicRoute);
app.get("/passwordforgot", (req, res) => {
  res.render("pages/forgotPage");
});
app.get("/recoverpassword", (req, res) => {
  res.render("pages/recoverpassword");
});
app.use("/guide", guideRoute);
app.use("/admin", adminRoute);

app.get("/404", (req, res) => {
  res.render("pages/error404");
});
app.get("/profile", (req, res) => {
  res.render("pages/profile", { guide: req.guide });
});
app.get("/basicDetails", (req, res) => {
  res.render("pages/basicdetails", { guide: req.guide });
});
app.get("/feq", (req, res) => {
  res.render("pages/feq", { guide: req.guide });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
