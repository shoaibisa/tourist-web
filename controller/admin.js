require("dotenv").config();
const MainPage = require("../model/mainpage");
exports.getDashboard = (req, res, next) => {
  res.render("admin/dashboard", {
    admin: req.admin,
  });
};
exports.getLogin = (req, res, next) => {
  res.render("admin/login");
};

exports.postLogin = (req, res, next) => {
  const { aname, apass } = req.body;
  if (aname === process.env.ADMIN_ID && apass === process.env.ADMIN_PASS) {
    req.session.isAdminLoggedIn = true;
    req.session.admin = {
      adminname: process.env.ADMIN_ID,
      adminpass: process.env.ADMIN_PASS,
    };
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin/login");
  }
};
exports.getAddCarousel = (req, res, next) => {
  res.render("admin/addheaderimage", {
    admin: req.admin,
  });
};
exports.postAddCarousel = (req, res, next) => {
  const cimage = req.file;
  if (!cimage) {
    return res.redirect("/admin/addcarousel");
  }
  const m = new MainPage({
    carouselImage: req.file.filename,
  });
  m.save().then((err, result) => {
    if (err) {
      return res.redirect("/admin/dashboard");
    }

    res.redirect("/");
  });
};
