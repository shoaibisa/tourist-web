const Guide = require("../model/guide");
const Blog = require("../model/blog");

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
