const express = require("express");
const blogRouter = express.Router();
blogRouter.use(express.json());
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { BlogModel } = require("../Models/blog.model");

// blogRouter.use(auth);

// Get posts
blogRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");

  let { role, language, limit, page, sort } = req.query;
  let Query = {};
  if (role) {
    Query.role = role;
  }
  if (language) {
    Query.language = language;
  }
  let sortBy = {};
  if (sort) {
    if (sort == "asc") {
      sortBy.postedAt = 1;
    } else if (sort == "desc") {
      sortBy.postedAt = -1;
    } else {
      sortBy = {};
    }
  }

  try {
    const blog = await BlogModel.find(Query)
      .sort(sortBy)
      .skip(limit * (page - 1))
      .limit(limit);

    res.status(200).send(blog);
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: err.message });
  }
});

// Get Perticular blog
blogRouter.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  let data = await BlogModel.find({ _id: blogId });
  res.status(200).send(data);
});

// Add Post
blogRouter.post("/", async (req, res) => {
  const payload = req.body;
  // console.log(payload);
  try {
    const post = await BlogModel(payload);
    res.status(200).send({ msg: "Post has been added" });
    await post.save();
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// Delete Post
blogRouter.delete("/:postId", async (req, res) => {
  let { postId } = req.params;
  console.log(postId);
  try {
    await BlogModel.findByIdAndDelete({ _id: postId });
    res.status(200).send({ msg: "Post has been Deleted" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// Update Post
blogRouter.patch("/:postId", async (req, res) => {
  let { postId } = req.params;
  let payload = req.body;
  try {
    await BlogModel.findByIdAndUpdate({ _id: postId }, payload);
    res.status(200).send({ msg: "Post has been Updated" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = {
  blogRouter,
};
