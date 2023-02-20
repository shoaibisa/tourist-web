const router = require("express").Router();
const packageController = require("../controller/package");
router.get("/packages", packageController.getAllPackages);
router.get("/package/:packageId", packageController.getPackage);

module.exports = router;
