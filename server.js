const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
 app.get("/",(req,res)=>{
   res.render("dashboard")
 })
 app.get("/guide/addpackage",(req,res)=>{
  res.render("guide/addPackage")
})
app.get("/guide/packageList",(req,res)=>{
  res.render("guide/packageList")
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
