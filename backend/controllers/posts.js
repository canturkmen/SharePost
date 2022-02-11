const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save().then((storedData) => {
    res.status(201).json({
      message: "Post has been added.",
      post: {...storedData, id: storedData._id}
    });
  })
  .catch((error) => {
    res.status(500).json({
      message: "Failed to save the post !"
    })
  });
}

exports.getPosts = (req, res, next) => {
  let fetchedDocuments;
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  if(pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery.then(documents => {
    fetchedDocuments = documents;
    return Post.count()
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: fetchedDocuments,
        maxPosts: count
      });
    })
  })
  .catch((error) => {
    res.status(500).json({
      message: "Failed to fetch the posts !"
    })
  });
}

exports.updatePosts = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then((result) => {
    console.log(result);
    if(result.matchedCount > 0) {
      res.status(200).json({ message: "Post edited successfully."});
    } else {
      res.status(401).json({ message: "Not authorized for editing the post."})
    }
  })
  .catch((error) => {
    res.status(500).json({
      message: "Failed to update the post !"
    })
  });
}

exports.getPost =  (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if(post) {
      res.status(200).json(post);
    }
    else {
      res.status(404).json({message: "Failed to reload the post"});
    }
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result) => {
    if(result.deletedCount > 0) {
      res.status(200).json({
        message: "Post Deleted successfully"
      });
    } else {
      res.status(401).json({
        message: "Not authorized for deleting the post."
      })
    }
  })
  .catch((error) => {
    res.status(500).json({
      message: "Failed to delete the post !"
    })
  });
}
