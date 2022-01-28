const express = require('express');

const app = express();

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE OPTIONS,");
  next();
})

app.use('/api/posts',(req, res, next) => {
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

module.exports = app;
