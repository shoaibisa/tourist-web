const Package = require("../model/package");

exports.getAllPackages = (req, res, next) => {
  Package.find()
    .populate("packageGuide")
    .exec()
    .then((packages) => {
      res.render("package/packages", {
        packages: packages,
        profileImage: false,
      });
    });
};
