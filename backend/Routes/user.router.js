const express = require("express");
const userRouter = express.Router();
userRouter.use(express.json());
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Models/user.model");
require("dotenv");

// Register
userRouter.post("/register", async (req, res) => {
  const { username, avatar, email, password } = req.body;
  // console.log(email);
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new UserModel({
        username,
        email,
        password: hash,
        avatar,
      });
      await user.save();
      res
        .status(200)
        .send({ msg: "Registration has been successfully registered" });
    });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});
// Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    // console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).send({
            mgs: "Login Successful!!",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "wrong Credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});
module.exports = { userRouter };
