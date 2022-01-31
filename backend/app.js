const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then((storedData) => {
    res.status(201).json({
      message: "Post has been added.",
      postId : storedData._id
    });
  });
});

app.get("/api/posts",(req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched succesfully',
      posts: documents
    });
  });
})

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if(post) {
      res.status(200).json(post);
    }
    else {
      res.status(404).json({message: "Failed to reload the post"});
    }
  })
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({_id: req.params.id}, post).then((result) => {
    res.status(200).json({
      message: "Post edited succesfully."
    });
  });
})

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post Deleted"
    });
  });
})

module.exports = app;
