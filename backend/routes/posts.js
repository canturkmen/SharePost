const express = require("express");
const checkAuth = require("../middleware/auth-check");
const fileCheck = require("../middleware/file")
const postController = require("../controllers/posts");

const router = express.Router();

router.post("", checkAuth, fileCheck, postController.createPost);
router.get("", postController.getPosts);
router.get("/:id", postController.getPost);
router.put("/:id", checkAuth, fileCheck, postController.updatePosts);
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
