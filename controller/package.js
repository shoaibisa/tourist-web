const Package = require("../model/package");

exports.getAllPackages = (req, res, next) => {
  Package.find({ status: "approved" })
    .populate("packageGuide")
    .exec()
    .then((packages) => {
      res.render("package/packages", {
        packages: packages,
        profileImage: false,
      });
    });
};

exports.getPackage = (req, res, next) => {
  const packageId = req.params.packageId;
  Package.findByIdAndUpdate(
    { _id: packageId },
    { $inc: { packageViews: 1 } },
    { new: true }
  ).exec();
  Package.findById(packageId)

    .populate("packageGuide")
    .exec()
    .then((pack) => {
      res.render("package/singlepackage", {
        pack: pack,
        profileImage: false,
      });
    });
};
