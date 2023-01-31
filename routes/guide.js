const router = require("express").Router();
const guideController = require("../controller/guide");
router.get("/dashboard", guideController.getGuideDashboard);
router.get("/add", guideController.getAddPackage);

//register
router.post("/register", guideController.postRegister);
module.exports = router;
