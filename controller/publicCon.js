const MainPage = require("../model/mainpage");
const Package = require("../model/package");
exports.getMainPage = async (req, res, next) => {
  const trendingBlogs = await Package.find({
    status: "approved",
  })
    .sort({ packageViews: -1 })
    .limit(4)
    .exec();
  MainPage.find()
    .then((mainpage) => {
      res.render("pages/landingPage", {
        mainpage: mainpage,
        packages: trendingBlogs,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
