const { findUserPosts } = require("../service/post.services");
const { findLikeCommentInPost, addPostLike, addPostComment, deleteComment } = require("./../service/likeComment.services")

const createLikeCommentController = async (req, res) => {
    const { type, postId } = req.params;
    const { id: userId } = req.user;

    const post = await findUserPosts(postId, userId);
    if (!post) {
        return res.status(400).json({ error: true, message: "post not found" })
    }

    if (type === "like") {
        const like = await findLikeCommentInPost("like", postId, userId);
        if (!like) {
            const likeData = await addPostLike(postId, userId);
            return res.status(200).json({ error: false, message: `Like added to postId-${postId}`, data: likeData });
        }
        await like.destroy();
        return res.status(200)
            .json({ error: false, message: `Like removed from postId-${postId}` });
    }
    if (type === "comment") {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: true, message: "Please add a comment message" });
        const comment = await addPostComment(message, postId, userId);
        return res.status(201).json({ error: false, message: `Comment added to postId-${postId}`, data: comment });
    }
    return res.status(400).json({ error: true, message: "Invalid type provided" });
}

const deleteCommentInPostController = async (req, res) => {
    const { commentId, type, postId } = req.params;
    const { id: userId } = req.user;
    if (type !== 'comment') return res.status(400).json({ error: true, message: "Invalid type provided" });
    try {
        await deleteComment(commentId, postId, userId);
        return res.status(200).json({ error: false, message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(404).json({ error: true, message: "Comment not found" });
    }
}

module.exports = { 
    createLikeCommentController, 
    deleteCommentInPostController 
};