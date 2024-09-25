const { findUserPosts } = require("../service/post.services");
const { findLikeCommentInPost, addPostLike, addPostComment, deleteComment } = require("./../service/likeComment.services")
const validator = require("../utils/validator.");
const Joi = require("joi");


const addLikeInPostController = {
    validaton: validator({
        query: Joi.object({
            postId: Joi.number().required(),
        }),
    }),

    handler: async (req, res) => {
        const { postId } = req.query;
        const { userId } = req.user;

        try {
            const post = await findUserPosts(postId, userId);
            if (!post) {
                return res.status(400).json({ error: true, message: "post not found" })
            }

            const existingLike = await findLikeCommentInPost("like", postId, userId);

            if (!existingLike) {
                const like = await addPostLike(postId, userId);
                return res.status(200).json({ error: false, message: `Like added to post`, post: like });
            }
            await existingLike.destroy();
            return res.status(200).json({ error: false, message: `Like removed from post` });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}


const addCommentInPostController = {
    validaton: validator({
        query: Joi.object({
            postId: Joi.number().required(),
        }),
        body: Joi.object({
            message: Joi.string().required(),
        }),
    }),

    handler: async (req, res) => {
        const { postId } = req.query;
        const { userId } = req.user;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: true,
                message: "Please add a comment message"
            });
        }

        try {
            const post = await findUserPosts(postId, userId);
            if (!post) {
                return res.status(404).json({ error: true, message: "Post not found" });
            }

            const comment = await addPostComment(message, postId, userId);
            return res.status(201).json({
                error: false,
                message: `Comment added to post`,
                data: comment
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
};


const deleteCommentInPostController = {
    validaton: validator({
        query: Joi.object({
            commentId: Joi.number().required(),
            postId: Joi.number().required(),
        }),
    }),

    handler: async (req, res) => {
        const { commentId, postId } = req.query;
        const { userId } = req.user;

        try {
            await deleteComment(commentId, postId, userId);
            return res.status(200).json({ error: false, message: "Comment deleted successfully" });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: 'Internal Server Error',
                errorMessage: error.message
            });
        }
    }
}

module.exports = {
    addLikeInPostController,
    addCommentInPostController,
    deleteCommentInPostController,
};