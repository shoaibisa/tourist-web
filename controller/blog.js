const Guide = require("../model/guide");
const Tourist = require("../model/tourist");
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
  Blog.find({
    $and: [{ status: "approved" }],
  })
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

exports.getBlogById = async (req, res, next) => {
  const bId = req.params.bId;
  let likedilkeAction = false;
  if (req.tourist) {
    const tourist = await Tourist.findById(req.tourist._id);

    likedilkeAction = tourist.blogsAction.find((b) => {
      return b.blog.equals(bId);
    });
  }
  // return console.log(likedilkeAction);
  //count views
  Blog.findByIdAndUpdate(bId, { $inc: { blogViews: 1 } }).exec();
  Blog.findOne({ _id: bId })
    .populate("blogAuthor")
    .exec()
    .then((blog) => {
      if (blog.status !== "approved") {
        return res.redirect("/blogs");
      }
      // return console.log(blog);
      res.render("singleblog", {
        guide: req.guide,
        tourist: req.tourist,
        blog: blog,

        likedilkeAction: likedilkeAction,
        isGuideAuth: req.isGuideAuth,
        isTouristAuth: req.isTouristAuth,
      });
    });
};

exports.postLikeDislike = async (req, res, next) => {
  const blogId = req.body.blogId;
  const likedislike = req.body.likedislike;

  const tourist = await Tourist.findById(req.tourist._id);

  const blogAction = tourist.blogsAction.find((b) => {
    return b.blog.equals(blogId);
  });
  // return console.log(blogAction);

  if (!blogAction) {
    Tourist.findByIdAndUpdate(req.tourist._id, {
      $push: {
        blogsAction: {
          blog: blogId,
          likedislike: likedislike,
        },
      },
    }).exec();

    //update blog likes or dislikes
    if (likedislike === "like") {
      Blog.findByIdAndUpdate(blogId, {
        $inc: { likes: 1 },
      }).exec();
    } else {
      Blog.findByIdAndUpdate(blogId, {
        $inc: { dislikes: 1 },
      }).exec();
    }
  } else {
    if (blogAction.likedislike === likedislike) {
      //remove the same
      Tourist.findByIdAndUpdate(req.tourist._id, {
        $pull: {
          blogsAction: {
            blog: blogId,
            likedislike: likedislike,
          },
        },
      }).exec();
      //decrement likes or dislikes
      if (likedislike === "like") {
        Blog.findByIdAndUpdate(blogId, {
          $inc: { likes: -1 },
        }).exec();
      } else {
        Blog.findByIdAndUpdate(blogId, {
          $inc: { dislikes: -1 },
        }).exec();
      }
    } else {
      //remove and add toggle
      Tourist.findByIdAndUpdate(req.tourist._id, {
        $pull: {
          blogsAction: {
            blog: blogId,
            likedislike: blogAction.likedislike,
          },
        },
      }).exec();

      Tourist.findByIdAndUpdate(req.tourist._id, {
        $push: {
          blogsAction: {
            blog: blogId,
            likedislike: likedislike,
          },
        },
      }).exec();

      //increment and decrement likes or dislikes
      if (likedislike === "like") {
        Blog.findByIdAndUpdate(blogId, {
          $inc: { likes: 1, dislikes: -1 },
        }).exec();
      } else {
        Blog.findOneAndUpdate(blogId, {
          $inc: { likes: -1, dislikes: 1 },
        }).exec();
      }
    }
  }

  res.redirect("/blog/" + blogId);
};

//fetch query
exports.getBlogByTag = (req, res, next) => {
  const tag = req.params.tag;
  if (tag === "latest") {
    return res.redirect("/blogs");
  }
  Blog.find({ blogTag: tag, status: "approved" })
    .sort({ createdAt: -1 })
    .populate("blogAuthor")
    .exec()
    .then((blogs) => {
      if (!blogs) {
        return res.redirect("/blogs");
      }
      res.render("blogs", {
        guide: req.guide,
        blogs: blogs,
      });
    });
};
