const router = require("express").Router();
const blogController = require("../controller/blog");
const isLoggedin = require("../middleware/isLoggedin");
const upload = require("../util/upload");
router.post(
  "/guide/addblog",
  isLoggedin,
  upload.single("bimage"),
  blogController.postBlog
);

module.exports = router;
