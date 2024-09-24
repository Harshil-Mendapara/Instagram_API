const { createUserPost, findUserPost, deleteUserPost, findUsersAllPosts } = require("../service/post.services");
const { Op } = require("sequelize");

const createPostController = async (req, res) => {
    const postBody = req.body;
    const { id: userId } = req.user;

    try {
        const post = await createUserPost({ ...postBody, user_Id: userId });
        if (!post) {
            return res.status(404).json({ error: false, message: "Post Not Created", post: post });
        }
        return res.status(200).json({ error: false, message: "Post create successfully", data: post });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            errorMessage: error.message
        });
    }
};

const updatePostController = async (req, res) => {
    const { postId } = req.params;
    const { title, description, image } = req.body;
    const { id: userId } = req.user;

    if (!(title || description || image)) {
        return res.status(400).json({ error: true, message: "Nothing to update" });
    }

    try {
        const post = await findUserPost(postId, userId);
        if (!post) {
            return res.status(404).json({ error: false, message: "Post Not Found" });
        }

        post.title = title ? title : post.title;
        post.description = description ? description : post.description;
        post.image = image ? image : post.image;

        await post.save();
        return res.status(200).json({ error: false, message: `Post updated successfully`, post: post });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            errorMessage: error.message
        });
    }
}

const deletePostController = async (req, res) => {
    const { postId } = req.params;
    const { id: userId } = req.user;
    try {
        await deleteUserPost(postId, userId);
        return res.status(200).json({ error: false, message: `Post deleted successfully` });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            errorMessage: error.message
        });
    }
}

const findAllPostController = async (req, res) => {
    const { id: userId } = req.user;
    try {

        const post = await findUsersAllPosts({ user_id: userId })
        return res.status(200).json({ error: false, message: "User posts fetched successfully", data: post });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            errorMessage: error.message
        });
    }
}

module.exports = {
    createPostController,
    updatePostController,
    deletePostController,
    findAllPostController
}