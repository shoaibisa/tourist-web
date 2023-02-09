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
router.post("/delete", isLoggedin, guideController.deletePackage);
//register
router.get("/register", isAuth, guideController.getRegister);
router.post("/register", guideController.postRegister);
router.post("/login", guideController.postLogin);
router.get("/login", isAuth, guideController.getLogin);
router.post("/logout", guideController.postVlogout);

router.get("/addblog", isLoggedin, guideController.getAddBlog);
router.get("/bloglist", isLoggedin, guideController.getBlogList);

module.exports = router;
