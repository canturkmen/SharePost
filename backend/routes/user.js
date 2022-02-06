const express = require("express");
const user = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user.save()
    .then((result) => {
      res.status(201).json({
        message: "User created successfully !",
        result: result
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
  });
})

router.post("/login", (req, res, next) => {
  let foundUser;
  user.findOne({email: req.body.email})
  .then((user) => {
    if(!user) {
      return res.status(404).json({
        message: "User not found !"
      })
    }
    foundUser = user;
    return bcrypt.compare(req.body.password, foundUser.password)
    .then((result) => {
      if(!result) {
        return res.status(404).json({
          message: "User not found !"
        });
      }
      const token = jwt.sign({
        email: foundUser.email, userId: foundUser._id},
        "this_should_be_longer",
        {expiresIn: "1h"}
        );

        console.log("succesfull");
        res.status(200).json({
          token: token
        });
    })
  .catch((err) => {
      return res.status(404).json({
        message: "Auth failed !"
      });
    })
  })
})

module.exports = router;

