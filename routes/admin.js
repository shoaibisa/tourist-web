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
module.exports = router;
