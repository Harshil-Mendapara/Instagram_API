const { createJwtToken } = require("./../utils/JwtTokenHandler");
const { User, Post, LikeComment, Follow } = require("./../models");
const { compare } = require("bcrypt");
const { createUser, findUser, updateUsers, deleteAvatar, deleteUser } = require("../service/user.service");

// * Get users all data
const getUserData = async (req, res) => {
    const { id: userId } = req.user
    try {
        const user = await findUser({ id: userId }, { exclude: ["password", "createdAt", "updatedAt"] }, {
            include: [
                {
                    model: Post,
                    as: 'posts',
                    attributes: {
                        exclude: ["user_Id", "createdAt", "updatedAt"]
                    },
                    include: [
                        {
                            model: LikeComment,
                            as: "likes",
                            where: { type: 'like' },
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
                    model: Follow,
                    as: "followers",
                    attributes: { exclude: ["receiver_id", "createdAt", "updatedAt"] },
                    where: { status: "accepted" },
                    required: false,
                    include: {
                        model: User,
                        as: "sender_user",
                        attributes: { exclude: ["firstName", "lastName", "gender", "email", "updatedAt", "updatedAt", "password"] },
                    }
                },
                {
                    model: Follow,
                    as: "following",
                    attributes: { exclude: ["sender_id", "createdAt", "updatedAt"] },
                    where: { status: "accepted" },
                    required: false,
                    include: {
                        model: User,
                        as: "receiver_user",
                        attributes: { exclude: ["firstName", "lastName", "gender", "email", "updatedAt", "updatedAt", "password"] },
                    }
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
            ]
        })
        return res.status(200).json({ error: false, message: "User profile fetched successfully", data: user });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            errormessage: error.message
        });
    }
}

// * Register new user
const createUserController = async (req, res) => {
    const userBody = req.body;
    try {
        const user = await createUser(userBody);
        const tokens = createJwtToken(user);
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
};


// * login  user
const loginUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username && !email) {
            return res.status(400).json({ error: true, message: "Username or email must be provided" });
        }

        const loginUser = await findUser(username ? { username } : { email });

        if (!loginUser) {
            res.status(400).json({ error: false, message: "User not found" });
        }

        const isValidPassword = await compare(password, loginUser.password);
        if (!isValidPassword) {
            res.status(400).json({ error: true, message: "Invalid password" });
        }

        const { id, firstName, lastName, gender, avatar } = loginUser;
        delete loginUser.password
        const token = createJwtToken({ loginUser });

        res.status(200).json({
            error: false,
            message: "User logged in successfully",
            data: { id, firstName, lastName, gender, avatar, username, email, Token: token }
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            errorMessage: error.message
        });
    }
}

// * update  user data
const updateUserController = async (req, res) => {
    const { firstName, lastName, username, email, avatar } = req.body;
    const { id: userId } = req.user;

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

        // Call function to update the user
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


// * update  user avatar
const deleteUserAvatarController = async (req, res) => {
    const { id: userId } = req.user;
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

// * delete  user Account
const deleteUserController = async (req, res) => {
    try {
        const { id: userId } = req.user;
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


module.exports = {
    getUserData,
    createUserController,
    loginUserController,
    updateUserController,
    deleteUserAvatarController,
    deleteUserController
}