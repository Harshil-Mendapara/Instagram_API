const express = require('express');
const app = express();
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const { postImageUpload } = require('../middlewares/fileUpload.middleware');
const { createPostController, updatePostController, deletePostController, findAllPostController } = require('../controllers/post-c');
const { createLikeCommentController, deleteCommentInPostController } = require('../controllers/LikeComment-c');

// * Find users all post 
app.get("/get", userAuthMiddleware, findAllPostController)

// * Create a post
app.post("/create", userAuthMiddleware, postImageUpload, createPostController)

// * Update a post
app.put("/update/:postId", userAuthMiddleware, postImageUpload, updatePostController)

// * Delete a post
app.delete("/delete/:postId", userAuthMiddleware, deletePostController)

// * Add like and comment in post
app.post("/:type(like|comment)/:postId", userAuthMiddleware, createLikeCommentController)

// * delete comment in post
app.delete("/delete/:type(comment)/:postId/:commentId", userAuthMiddleware, deleteCommentInPostController)

module.exports = app;
