const MainPage = require("../model/mainpage");

exports.getMainPage = (req, res, next) => {
  MainPage.find()
    .then((mainpage) => {
      res.render("pages/landingPage", {
        mainpage: mainpage,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
