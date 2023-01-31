const Guide = require("../model/guide");
const bcrypt = require("bcrypt");
//guide register
exports.postRegister = async (req, res, next) => {
  const gname = req.body.gname;
  const gemail = req.body.gemail;
  const password = req.body.gpass;
  const confirmPassword = req.body.gpassc;
  if (await Guide.findOne({ guideEmail: gemail })) {
    return res.redirect("/register", { error: "Email already exists" });
  }
  if (password !== confirmPassword) {
    return res.redirect("/register", { error: "Password does not match" });
  }
  const hashedPass = await bcrypt.hash(password, 12);
  const guide = new Guide({
    guidePassword: hashedPass,
    guideEmail: gemail,
    guideName: gname,
  });
  guide.save((err, g) => {
    if (err) {
      console.log(err);
      res.redirect("/register", { error: "Something went wrong" });
    }
    res.redirect("/login");
  });
};

exports.getGuideDashboard = (req, res, next) => {
  res.render("dashboard");
};

exports.getAddPackage = (req, res, next) => {
  res.render("guide/addPackage");
};
