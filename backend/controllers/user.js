const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

exports.createUser = (req, res, next) => {
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
        message: "Invalid user information"
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
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
        process.env.JWT_KEY,
        {expiresIn: "1h"}
        );

        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: foundUser._id
        });
    })
  .catch((err) => {
      return res.status(401).json({
        message: "Invalid user information !"
      });
    });
  });
}
