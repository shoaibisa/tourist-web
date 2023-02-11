const router = require("express").Router();
const blogController = require("../controller/blog");
const isLoggedin = require("../middleware/isLoggedin");
const isTouristLoggedIn = require("../middleware/isTouristLoggedIn");
const upload = require("../util/upload");

//Guide
router.post(
  "/guide/addblog",
  isLoggedin,
  upload.single("bimage"),
  blogController.postBlog
);
router.post("/guide/deleteblog", isLoggedin, blogController.deleteBlog);
// get by id, by status by tags
router.get("/blogs", blogController.getMainBlogList);
router.get("/blog/:bId", blogController.getBlogById);

//actions
//action
router.post(
  "/blog/likedislike",
  isTouristLoggedIn,
  blogController.postLikeDislike
);
module.exports = router;
