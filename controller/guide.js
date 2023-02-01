const Guide = require("../model/guide");
const Package = require("../model/package");
const bcrypt = require("bcrypt");
//guide register
exports.getRegister = (req, res) => {
  res.render("pages/register");
};
exports.postRegister = async (req, res, next) => {
  const gname = req.body.gname;
  const gemail = req.body.gemail;
  const password = req.body.gpass;
  const confirmPassword = req.body.gpassc;
  if (await Guide.findOne({ guideEmail: gemail })) {
    return res.redirect("/guide/register", { error: "Email already exists" });
  }
  if (password !== confirmPassword) {
    return res.redirect("/guide/register", {
      error: "Password does not match",
    });
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
      res.redirect("/guide/register", { error: "Something went wrong" });
    }
    res.redirect("/guide/login");
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
        return res.redirect("/guide/login");
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
          res.redirect("/guide/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/guide/login");
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

exports.postAddPackage = (req, res, next) => {
  const pimage = req.file;
  if (!pimage) {
    return res.redirect("/guide/addpackage");
  }
  const { pname, pprice, pdesc, pslot, pduration, proutes, pinitary } =
    req.body;
  console.log(pname, pprice, pdesc, pslot, pduration, proutes);
  const p1 = new Package({
    packageTitle: pname,
    packagePrice: pprice,
    packageDescription: pdesc,
    packageSlot: pslot,
    packageDuration: pduration,
    packageRoutes: proutes,
    packageImage: req.file.filename,
    packageItinerary: pinitary,
    packageGuide: req.guide._id,
  });
  p1.save((err, p) => {
    if (err) {
      console.log(err);
      return res.redirect("/guide/dashboard");
    }
    Guide.findById(req.guide._id).then((guide) => {
      guide.packages.push(p);
      guide.save();
    });
    return res.redirect("/guide/addpackage");
  });
};
exports.getPackageList = (req, res, next) => {
  Package.find({ packageGuide: req.guide._id }).then((packages) => {
    res.render("guide/packagelist", {
      guide: req.guide,
      packageList: packages,
    });
  });
};
