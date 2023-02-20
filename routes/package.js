const router = require("express").Router();
const packageController = require("../controller/package");
router.get("/packages", packageController.getAllPackages);

module.exports = router;
