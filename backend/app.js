const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post has been added."
  })
});

app.get("/api/posts",(req, res, next) => {
  const posts = [
    {
    id: '132f23r2fd',
    title: 'First server-side post',
    content: 'This coming from the server.'
    },

    {
      id: 'f2f4f32rfq3',
      title: 'Second server-side post',
      content: 'This the second post.'
    }
];
  res.status(200).json({
    message: 'Posts fetched succesfully',
    posts: posts
  });
})
glnAujyIMoIRluO3
module.exports = app;
