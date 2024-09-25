const express = require('express');
const app = express();
const { getUserData, createUserController, loginUserController, updateUserController, deleteUserAvatarController, deleteUserController } = require('../controllers/User-c');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const { userAvatarUpdate } = require('../middlewares/fileUpload.middleware');


// * get users data
app.get("/get", userAuthMiddleware, getUserData.handler);

// * Register a new User
app.post('/register', createUserController.validaton, createUserController.handler);

// * Login user
app.post('/login', loginUserController.validaton, loginUserController.handler);

// * Update user and avatar
app.put("/update", userAuthMiddleware, userAvatarUpdate, updateUserController.validaton, updateUserController.handler);

// * Delete user avatar
app.delete("/delete-avatar", userAuthMiddleware, deleteUserAvatarController.handler)

app.delete("/delete-user", userAuthMiddleware, deleteUserController.handler)

module.exports = app;
