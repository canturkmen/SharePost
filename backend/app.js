const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");

mongoose.connect("mongodb+srv://CanTurkmen:"+ process.env.MONGO_ATLAS_PW + "@cluster0.mm4nt.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log("Connected to the database.");

})
.catch(() => {
  console.log("Failed to connect the database.");
});

app.use(express.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts/", postsRouter);
app.use("/api/user/", userRouter);

module.exports = app;
