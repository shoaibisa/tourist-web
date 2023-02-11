require("dotenv").config();
const bcrypt = require("bcrypt");
const Tourist = require("../model/tourist");
const fs = require("fs");
const fileHelper = require("../util/file");

exports.getLogin = (req, res, next) => {
  res.render("tourist/login", {
    pageTitle: "Travel World | Toursit Login",
    path: "/login",
  });
};

exports.postLogin = async (req, res, next) => {
  const temail = req.body.temail;
  const tpass = req.body.tpass;

  Tourist.findOne({ touristEmail: temail })
    .then((tourist) => {
      if (!tourist) {
        return res.redirect("/tourist/login");
      }
      bcrypt
        .compare(tpass, tourist.touristPassword)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isTouristLoggedIn = true;
            req.session.tourist = tourist;
            return req.session.save((err) => {
              res.redirect("/tourist/dashboard");
            });
          }
          res.redirect("/tourist/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/tourist/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("tourist/register", {
    pageTitle: "Travel World | Toursit Signup",
    path: "/signup",
  });
};

exports.postSignup = async (req, res, next) => {
  const { tname, temail, tpass, tpassc } = req.body;

  if (tpass !== tpassc) {
    return res.redirect("/tourist/signup");
  }

  if (await Tourist.findOne({ touristEmail: temail })) {
    return res.redirect("/tourist/signup");
  }

  const hashedPass = await bcrypt.hash(tpass, 12);
  const tourist = new Tourist({
    touristPassword: hashedPass,
    touristEmail: temail,
    touristName: tname,
  });

  tourist.save((err, t) => {
    if (err) {
      console.log(err);
      res.redirect("/tourist/signup");
    }
    res.redirect("/tourist/login");
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getDashboard = (req, res, next) => {
  res.render("tourist/dashboard", {
    pageTitle: "Travel World | Toursit Dashboard",
    path: "/dashboard",
    tourist: req.tourist,
    profileImage: req.tourist.touristImage,
  });
};

exports.getProfile = (req, res, next) => {
  if (!req.tourist.profileComplete) {
    return res.redirect("/tourist/edit-profile");
  }
  res.render("tourist/profile", {
    pageTitle: "Travel World | Toursit Profile",
    path: "/profile",
    tourist: req.tourist,
    profileImage: req.tourist.touristImage,
  });
};

exports.getEditProfile = (req, res, next) => {
  res.render("tourist/editprofile", {
    pageTitle: "Travel World | Toursit Edit Profile",
    path: "/tourist/edit-profile",
    tourist: req.tourist,
    profileImage: req.tourist.touristImage,
  });
};
exports.postEditProfile = (req, res, next) => {
  const profileImage = req.file;

  let image = req.tourist.touristImage;
  if (profileImage) {
    const pathImg = "upload/images/" + image;
    if (image && fs.existsSync(pathImg)) {
      fileHelper.deleteFiles(pathImg);
    }
    image = profileImage.filename;
  }
  //   return console.log(profileImage, image);
  const {
    organization,
    education,
    contact,
    country,
    address,
    name,
    city,
    state,
  } = req.body;
  //   return console.log(req.body);

  Tourist.findOne({ _id: req.tourist._id })
    .then((tourist) => {
      tourist.touristName = name;
      tourist.touristImage = image;
      tourist.touristOrganization = organization;
      tourist.touristEducation = education;
      tourist.touristPhone = contact;
      tourist.touristCountry = country;
      tourist.touristAddress = address;
      tourist.touristCity = city;
      tourist.touristState = state;
      tourist.profileComplete = true;
      return tourist.save();
    })
    .then((result) => {
      res.redirect("/tourist/profile");
    })
    .catch((err) => console.log(err));
};
