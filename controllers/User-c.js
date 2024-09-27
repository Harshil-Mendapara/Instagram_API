const { createJwtToken } = require("./../utils/JwtTokenHandler");
const { User, Post, LikeComment, Follow } = require("./../models");
const { compare } = require("bcrypt");
const { createUser, findUser, updateUsers, deleteAvatar, deleteUser } = require("../service/user.service");
const validator = require("../utils/validator.");
const Joi = require("joi");


// * Get users all data
const getUserData = {
    handler: async (req, res) => {
        const { userId } = req.user;

        try {
            const user = await findUser({ id: userId }, { exclude: ["password", "createdAt", "updatedAt"] }, {
                include: [
                    {
                        model: Follow,
                        as: "followers",
                        attributes: { exclude: ["sender_id", "receiver_id", "createdAt", "updatedAt"] },
                        where: { status: "accepted" },
                        required: false,
                        include: {
                            model: User,
                            as: "sender_user",
                            attributes: { exclude: ["firstName", "lastName", "gender", "email", "createdAt", "updatedAt", "password"] },
                        }
                    },
                    {
                        model: Follow,
                        as: "following",
                        attributes: { exclude: ["receiver_id", "sender_id", "createdAt", "updatedAt"] },
                        where: { status: "accepted" },
                        required: false,
                        include: {
                            model: User,
                            as: "receiver_user",
                            attributes: { exclude: ["firstName", "lastName", "gender", "email", "createdAt", "updatedAt", "password"] },
                        }
                    },
                    {
                        model: Post,
                        as: 'posts',
                        attributes: { exclude: ["user_Id", "createdAt", "updatedAt"] },
                        include: [
                            {
                                model: LikeComment,
                                as: "likes",
                                where: { type: 'like' },
                                required: false,
                                attributes: {
                                    exclude: ["type", "message", "user_Id", "post_Id", "createdAt", "updatedAt"]
                                },
                                include: [{
                                    model: User,
                                    as: "user",
                                    attributes: ["username", "avatar"]
                                }]
                            },
                            {
                                model: LikeComment,
                                as: "comments",
                                where: { type: 'comment' },
                                required: false,
                                attributes: {
                                    exclude: ["type", "user_Id", "post_Id", "createdAt", "updatedAt"]
                                },
                                include: [
                                    {
                                        model: User,
                                        as: "user",
                                        attributes: ["username", "avatar"]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: LikeComment,
                        as: "likes",
                        required: false,
                        where: { type: "like" },
                        attributes: { exclude: ["user_Id", "createdAt"] },
                        include: {
                            model: Post,
                            as: "post",
                            attributes: { exclude: ["user_Id", "createdAt"] },
                        }
                    },
                    {
                        model: LikeComment,
                        as: "comments",
                        required: false,
                        where: { type: "comment" },
                        attributes: { exclude: ["user_Id", "createdAt"] },
                        include: {
                            model: Post,
                            as: "post",
                            attributes: { exclude: ["user_Id", "createdAt"] },
                        }
                    },
                ],
            })
            return res.status(200).json({ error: false, message: "User profile fetched successfully", profile: user });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errormessage: error.message
            });
        }
    }
}



// * Register new user
const createUserController = {
    validaton: validator({
        body: Joi.object({
            firstName: Joi.string().min(3).max(50).required(),
            lastName: Joi.string().min(3).max(50).required(),
            avatar: Joi.string().optional(),
            gender: Joi.string().valid('male', 'female', 'other').required(),
            username: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).max(10).required(),
        })
    }),

    handler: async (req, res) => {
        const userBody = req.body;
        try {
            const user = await createUser(userBody);
            const tokens = createJwtToken({ userId: user.id });
            return res.status(201).json({
                error: false, message: "Account created successfully",
                data: { user, Token: tokens }
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}



// * login  user
const loginUserController = {
    validaton: validator({
        body: Joi.object({
            username: Joi.string().min(3).max(30).optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(5).max(10).required(),
        })
    }),
    handler: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            if (!username && !email) {
                return res.status(400).json({ error: true, message: "Username or email must be provided" });
            }

            const loginUser = await findUser(username ? { username } : { email });

            if (!loginUser) {
                res.status(400).json({ error: true, message: "User not found" });
            }

            const isValidPassword = await compare(password, loginUser.password);
            if (!isValidPassword) {
                res.status(400).json({ error: true, message: "Invalid password" });
            }

            delete loginUser.password;
            const token = createJwtToken({ userId: loginUser.id });

            res.status(200).json({
                error: false,
                message: "User logged in successfully",
                data: loginUser,
                Token: token
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}

// * update  user data
const updateUserController = {
    validaton: validator({
        body: Joi.object({
            firstName: Joi.string().min(3).max(50).optional(),
            lastName: Joi.string().min(3).max(50).optional(),
            avatar: Joi.string().optional(),
            username: Joi.string().min(3).max(30).optional(),
            email: Joi.string().email().optional(),
        })
    }),

    handler: async (req, res) => {
        const { firstName, lastName, username, email } = req.body;
        const { userId } = req.user;
        const avatar = req.file ? req.file.filename : null;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: true, message: "User not found." });
            }

            const updateData = {};

            if (firstName) updateData.firstName = firstName;
            if (lastName) updateData.lastName = lastName;
            if (username) updateData.username = username;
            if (email) updateData.email = email;
            if (avatar) updateData.avatar = avatar;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: true, message: "Please provide details to update." });
            }

            const updatedUser = await updateUsers(updateData, { id: userId });
            if (updatedUser === 0) {
                return res.status(404).json({
                    error: true,
                    message: "User data Not updated.",
                });
            }

            return res.status(200).json({
                error: false,
                message: "User data updated successfully.",
                data: updateData
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}


// * delete  user avatar
const deleteUserAvatarController = {
    handler: async (req, res) => {
        const { userId } = req.user;

        try {
            await deleteAvatar(userId);
            return res.status(200).json({ error: false, message: "user avatar deleted successfully" });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}


// * delete  user Account
const deleteUserController = {
    handler: async (req, res) => {
        const { userId } = req.user;

        try {
            await deleteUser(userId);
            return res.status(200).json({ error: false, message: "User account deleted successfully" });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}


module.exports = {
    getUserData,
    createUserController,
    loginUserController,
    updateUserController,
    deleteUserAvatarController,
    deleteUserController
}