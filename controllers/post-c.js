const { createUserPost, findUserPost, deleteUserPost, findUsersAllPosts } = require("../service/post.services");
const validator = require("../utils/validator.");
const Joi = require("joi");

const createPostController = {
    validaton: validator({
        body: Joi.object({
            title: Joi.string().min(3).max(100).optional(),
            description: Joi.string().min(10).max(100).optional(),
            image: Joi.string().required(),
        })
    }),

    handler: async (req, res) => {
        const { title, description } = req.body;
        const { userId } = req.user;
        const image = req.file ? req.file.filename : null;

        try {
            const post = await createUserPost({
                title, description, image,
                user_Id: userId
            });

            if (!post) {
                return res.status(404).json({ error: false, message: "Post Not Created"});
            }

            return res.status(200).json({ error: false, message: "Post create successfully", post: post });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
};

const updatePostController = {
    validaton: validator({
        params: Joi.object({
            postId: Joi.number().required(),
        }),
        body: Joi.object({
            title: Joi.string().min(3).max(100).optional(),
            description: Joi.string().min(10).max(100).optional(),
            image: Joi.string().optional(),
        }),
    }),

    handler: async (req, res) => {
        const { postId } = req.params;
        const { title, description } = req.body;
        const { userId } = req.user;
        const image = req.file ? req.file.filename : null;

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
}


const deletePostController = {
    validaton: validator({
        params: Joi.object({
            postId: Joi.number().required(),
        }),
    }),

    handler: async (req, res) => {
        const { postId } = req.params;
        const { userId } = req.user;
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
}


const findAllPostController = {
    handler: async (req, res) => {
        const { userId } = req.user;
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
}



module.exports = {
    createPostController,
    updatePostController,
    deletePostController,
    findAllPostController
}