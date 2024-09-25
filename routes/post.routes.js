const express = require('express');
const app = express();
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const { postImageUpload } = require('../middlewares/fileUpload.middleware');
const { createPostController, updatePostController, deletePostController, findAllPostController } = require('../controllers/post-c');
const { addLikeInPostController, addCommentInPostController, deleteCommentInPostController } = require('../controllers/LikeComment-c');

// * Find users all post 
app.get("/get", userAuthMiddleware, findAllPostController.handler)

// * Create a post
app.post("/create", userAuthMiddleware, postImageUpload, createPostController.validaton, createPostController.handler)

// * Update a post
app.put("/update/:postId", userAuthMiddleware, postImageUpload, updatePostController.validaton, updatePostController.handler)

// * Delete a post
app.delete("/delete/:postId", userAuthMiddleware, deletePostController.validaton, deletePostController.handler)

// * Add like and comment in post
app.post("/like", userAuthMiddleware, addLikeInPostController.validaton, addLikeInPostController.handler)

// * Add like and comment in post
app.post("/comment", userAuthMiddleware, addCommentInPostController.validaton, addCommentInPostController.handler)

// * delete comment in post
app.delete("/delete", userAuthMiddleware, deleteCommentInPostController.validaton, deleteCommentInPostController.handler)

module.exports = app;
