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
//login
exports.getLogin = (req, res) => {
  res.render("pages/login");
};
exports.postLogin = async (req, res, next) => {
  const gemail = req.body.gemail;
  const gpass = req.body.gpass;

  Guide.findOne({ guideEmail: gemail })
    .then((guide) => {
      if (!guide) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(gpass, guide.guidePassword)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.guide = guide;
            return req.session.save((err) => {
              res.redirect("/guide/dashboard");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
//destroying the session
exports.postVlogout = (req, res) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/guide/login");
  });
};

exports.getGuideDashboard = (req, res, next) => {
  res.render("dashboard", {
    guide: req.guide,
  });
};

exports.getAddPackage = (req, res, next) => {
  res.render("guide/addPackage", {
    guide: req.guide,
  });
};

exports.getPackageList = (req, res, next) => {
  res.render("guide/packagelist", {
    guide: req.guide,
  });
};
