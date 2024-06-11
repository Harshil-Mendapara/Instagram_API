const express = require('express');
const app = express();
const { getUserData, createUserController, loginUserController, updateUserController, deleteUserAvatarController, deleteUserController } = require('../controllers/User-c');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const { userAvatarUpdate } = require('../middlewares/fileUpload.middleware');


// * get users data
app.get("/get", userAuthMiddleware, getUserData)

// * Register a new User
app.post('/register', createUserController);

// * Login user
app.post('/login', loginUserController);

// * Update user and avatar
app.put("/update", userAvatarUpdate, userAuthMiddleware, updateUserController);

// * Delete user avatar
app.delete("/delete-avatar", userAuthMiddleware, deleteUserAvatarController)

app.delete("/delete-user", userAuthMiddleware, deleteUserController)

module.exports = app;
