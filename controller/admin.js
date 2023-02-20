require("dotenv").config();
const Blog = require("../model/blog");
const Package = require("../model/package");
const MainPage = require("../model/mainpage");
exports.getDashboard = (req, res, next) => {
  res.render("admin/dashboard", {
    admin: req.admin,
    profileImage: false,
  });
};
exports.getLogin = (req, res, next) => {
  res.render("admin/login");
};

exports.postLogin = (req, res, next) => {
  const { aname, apass } = req.body;
  if (aname === process.env.ADMIN_ID && apass === process.env.ADMIN_PASS) {
    req.session.isAdminLoggedIn = true;
    req.session.admin = {
      adminname: process.env.ADMIN_ID,
      adminpass: process.env.ADMIN_PASS,
    };
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin/login");
  }
};
exports.getAddCarousel = (req, res, next) => {
  res.render("admin/addheaderimage", {
    admin: req.admin,
    profileImage: false,
  });
};
exports.postAddCarousel = (req, res, next) => {
  const cimage = req.file;
  if (!cimage) {
    return res.redirect("/admin/addcarousel");
  }
  const m = new MainPage({
    carouselImage: req.file.filename,
  });
  m.save().then((err, result) => {
    if (err) {
      return res.redirect("/admin/dashboard");
    }

    res.redirect("/");
  });
};

//blogs
exports.getBlogs = (req, res, next) => {
  Blog.find()
    .populate("blogAuthor")
    .exec()
    .then((blogs) => {
      // return console.log(blogs);
      res.render("admin/blogs", {
        admin: req.admin,
        blogs: blogs,
        profileImage: false,
      });
    });
};

//packages
exports.getPackages = (req, res, next) => {
  Package.find()
    .populate("packageGuide")
    .exec()
    .then((packages) => {
      res.render("admin/packages", {
        admin: req.admin,
        packages: packages,
        profileImage: false,
      });
    });
};
exports.approveBlog = (req, res, next) => {
  const blogId = req.body.blogId;
  Blog.findByIdAndUpdate(blogId)
    .then((blog) => {
      blog.status = "approved";
      return blog.save();
    })
    .then((result) => {
      res.redirect("/admin/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.abortBlog = (req, res, next) => {
  const blogId = req.body.blogId;
  Blog.findByIdAndUpdate(blogId)
    .then((blog) => {
      blog.status = "disapproved";
      return blog.save();
    })
    .then((result) => {
      res.redirect("/admin/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
};

//packages
exports.actionPackage = (req, res, next) => {
  const packageId = req.body.packageId;
  const action = req.body.action;
  Package.findByIdAndUpdate(packageId)
    .then((pack) => {
      pack.status = action;
      return pack.save();
    })
    .then((result) => {
      res.redirect("/admin/packages");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.viewBlog = (req, res, next) => {
  const blogId = req.body.blogId;
  Blog.findById(blogId)

    .populate("blogAuthor")
    .exec()
    .then((blog) => {
      if (blog.status === "approved") {
        return res.redirect("/blog/" + blogId);
      }
      res.render("viewblog", {
        admin: req.admin,
        blog: blog,
        isview: true,
        isTouristAuth: false,
        profileImage: false,
      });
    });
};
