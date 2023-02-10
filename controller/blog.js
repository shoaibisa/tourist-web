const Guide = require("../model/guide");
const Blog = require("../model/blog");
const fs = require("fs");
const fileHelper = require("../util/file");
//post a blog
exports.postBlog = (req, res, next) => {
  const bimage = req.file;
  if (!bimage) {
    return res.redirect("/guide/addblog");
  }
  const { btitle, bdesc, btags } = req.body;
  //   return console.log(btitle, bdesc, btags);
  const b1 = new Blog({
    blogTitle: btitle,
    blogTag: btags,
    blogContent: bdesc,
    blogImage: req.file.filename,
    blogAuthor: req.guide._id,
  });

  b1.save((err, b) => {
    if (err) {
      console.log(err);
      return res.redirect("/guide/dashboard");
    }
    Guide.findById(req.guide._id).then((guide) => {
      guide.blogs.push(b);
      guide.save();
    });
    return res.redirect("/guide/bloglist");
  });
};

exports.deleteBlog = async (req, res, next) => {
  const bId = req.body.bId;

  await Blog.findByIdAndRemove(bId)
    .then(async (b) => {
      if (!b) {
        throw "Not found";
      }
      if (b.blogAuthor.equals(req.guide._id)) {
        const g = await Guide.findByIdAndUpdate(req.guide._id, {
          $pull: { blogs: b._id },
        });
        const pathImg = "upload/images/" + b.blogImage;
        if (fs.existsSync(pathImg)) {
          fileHelper.deleteFiles(pathImg);
        }
      } else {
        console.log("You are not allowed!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/guide/bloglist");
};

//globlal
exports.getMainBlogList = (req, res, next) => {
  //latest blogs
  const guide = req.guide;
  // return console.log(guide);
  Blog.find()
    .sort({ createdAt: -1 })
    .populate("blogAuthor")
    // .limit(3)
    .exec()
    .then((blogs) => {
      // return console.log(blogs);
      res.render("blogs", {
        guide: req.guide,
        blogs: blogs,
      });
    });
};

exports.getBlogById = (req, res, next) => {
  const bId = req.params.bId;
  // return console.log(bId);
  //count views
  Blog.findByIdAndUpdate(bId, { $inc: { blogViews: 1 } }).exec();
  Blog.findById(bId)
    .populate("blogAuthor")
    .exec()
    .then((blog) => {
      // return console.log(blog);
      res.render("singleblog", {
        guide: req.guide,
        blog: blog,
      });
    });
};
