const { LikeComment } = require("./../models");

const findLikeCommentInPost = async (type, postId, userId) => {
    const like = await LikeComment.findOne({ where: { type, post_Id: postId, user_Id: userId } });
    return like;
};

const addPostLike = async (postId, userId) => {
    const like = await LikeComment.create({ type: "like", post_Id: postId, user_Id: userId });
    return like;
};

const addPostComment = async (message, postId, userId) => {
    const comment = await LikeComment.create({ type: "comment", message, post_Id: postId, user_Id: userId });
    return comment;
};

const deleteComment = async (commentID, postId, userId) => {
    const comment = await LikeComment.findOne({ where: { id: commentID, type: "comment", post_Id: postId, user_Id: userId } });
    if (!comment) throw Error("comment not found");
    await comment.destroy();
};

module.exports = { findLikeCommentInPost, addPostLike, addPostComment, deleteComment };