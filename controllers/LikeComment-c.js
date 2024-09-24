const { findUserPosts } = require("../service/post.services");
const { findLikeCommentInPost, addPostLike, addPostComment, deleteComment } = require("./../service/likeComment.services")

const createLikeCommentController = async (req, res) => {
    const { postId } = req.query;
    const { id: userId } = req.user;

    try {
        const post = await findUserPosts(postId, userId);
        if (!post) {
            return res.status(400).json({ error: true, message: "post not found" })
        }

        const existingLike = await findLikeCommentInPost("like", postId, userId);

        if (!existingLike) {
            const like = await addPostLike(postId, userId);
            return res.status(200).json({ error: false, message: `Like added to post`, data: like });
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

const createCommentController = async (req, res) => {
    const { postId } = req.query;
    const { id: userId } = req.user;
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
};


const deleteCommentInPostController = async (req, res) => {
    const { commentId, postId } = req.query;
    const { id: userId } = req.user;

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

module.exports = {
    createLikeCommentController,
    createCommentController,
    deleteCommentInPostController,
};