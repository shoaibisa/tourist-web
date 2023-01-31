require("./db/db");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;
const guideRoute = require("./routes/guide");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("dashboard");
});
app.get("/guide/addpackage", (req, res) => {
  res.render("guide/addPackage");
});
app.get("/guide/packageList", (req, res) => {
  res.render("guide/packageList");
});
app.get("/login", (req, res) => {
  res.render("pages/login");
});
app.get("/register", (req, res) => {
  res.render("pages/register");
});
app.get("/passwordforgot", (req, res) => {
  res.render("pages/forgotPage");
});
app.get("/recoverpassword", (req, res) => {
  res.render("pages/recoverpassword");
});
app.use("/guide", guideRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
