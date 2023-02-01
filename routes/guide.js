const router = require("express").Router();
const guideController = require("../controller/guide");
const isLoggedin = require("../middleware/isLoggedin");

router.get("/dashboard", isLoggedin, guideController.getGuideDashboard);
router.get("/addpackage", isLoggedin, guideController.getAddPackage);
router.get("/packagelist", isLoggedin, guideController.getPackageList);

//register
router.post("/register", guideController.postRegister);
router.post("/login", guideController.postLogin);
router.get("/login", guideController.getLogin);
router.post("/logout", guideController.postVlogout);
module.exports = router;
