const router = require("express").Router();
const adminConroller = require("../controller/admin");
const isAdminLoggedin = require("../middleware/isAdminLoggedin");
const isAmdinAuth = require("../middleware/isAmdinAuth");
const upload = require("../util/upload");
router.get("/login", isAmdinAuth, adminConroller.getLogin);
router.post("/login", adminConroller.postLogin);

router.get("/dashboard", isAdminLoggedin, adminConroller.getDashboard);
router.get("/addcarousel", isAdminLoggedin, adminConroller.getAddCarousel);
router.post(
  "/addcarouselimage",
  upload.single("cimage"),
  isAdminLoggedin,
  adminConroller.postAddCarousel
);

//blogs

router.get("/blogs", isAdminLoggedin, adminConroller.getBlogs);
router.post("/blog/approve", isAdminLoggedin, adminConroller.approveBlog);
router.post("/blog/abort", isAdminLoggedin, adminConroller.abortBlog);
router.post("/blog/view", isAdminLoggedin, adminConroller.viewBlog);

//packages
router.get("/packages", isAdminLoggedin, adminConroller.getPackages);
router.post("/package/action", isAdminLoggedin, adminConroller.actionPackage);
module.exports = router;
