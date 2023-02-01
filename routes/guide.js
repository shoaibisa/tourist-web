const router = require("express").Router();
const guideController = require("../controller/guide");
const isAuth = require("../middleware/isAuth");
const isLoggedin = require("../middleware/isLoggedin");
const upload = require("../util/upload");

router.get("/dashboard", isLoggedin, guideController.getGuideDashboard);
router.get(
  "/addpackage",
  isLoggedin,

  guideController.getAddPackage
);
router.post(
  "/addpackage",
  isLoggedin,
  upload.single("pimage"),
  guideController.postAddPackage
);
router.get("/packagelist", isLoggedin, guideController.getPackageList);

//register
router.get("/register", isAuth, guideController.getRegister);
router.post("/register", guideController.postRegister);
router.post("/login", guideController.postLogin);
router.get("/login", isAuth, guideController.getLogin);
router.post("/logout", guideController.postVlogout);
module.exports = router;
