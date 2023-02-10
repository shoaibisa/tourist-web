const router = require("express").Router();
const blogController = require("../controller/blog");
const isLoggedin = require("../middleware/isLoggedin");
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
module.exports = router;
