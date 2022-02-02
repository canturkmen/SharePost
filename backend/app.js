const express = require('express');
const app = express();
const mongoose = require('mongoose');

const postsRouter = require('./routes/posts')

mongoose.connect("mongodb+srv://CanTurkmen:dt41UfIi2ceWPvYp@cluster0.mm4nt.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log("Connected to the database.");

})
.catch(() => {
  console.log("Failed to connect the database.");
});

app.use(express.json());

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts/", postsRouter);

module.exports = app;
