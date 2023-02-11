const router = require("express").Router();
const touristController = require("../controller/tourist");
const isTouristAuth = require("../middleware/isTouristAuth");
const isTouristLoggedIn = require("../middleware/isTouristLoggedIn");
const upload = require("../util/upload");

//auth
router.get("/login", isTouristAuth, touristController.getLogin);
router.get("/signup", isTouristAuth, touristController.getSignup);
router.post("/signup", touristController.postSignup);
router.post("/login", touristController.postLogin);
router.post("/logout", touristController.postLogout);

//dashboard
router.get("/dashboard", isTouristLoggedIn, touristController.getDashboard);
router.get("/profile", isTouristLoggedIn, touristController.getProfile);
router.get(
  "/edit-profile",
  isTouristLoggedIn,
  touristController.getEditProfile
);
router.post(
  "/edit-profile",
  upload.single("timage"),
  isTouristLoggedIn,
  touristController.postEditProfile
);

module.exports = router;
