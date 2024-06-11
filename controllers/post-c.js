const { createUserPost, findUserPost, deleteUserPost, findUsersAllPosts } = require("../service/post.services");
const { Op } = require("sequelize");

const createPostController = async (req, res) => {
    const postBody = req.body;
    const { id: userId } = req.user;

    const post = await createUserPost({ ...postBody, user_Id: userId });
    if (!post) throw Error("post not created");

    return res.status(200).json({ error: false, message: "user post create successfully", data: post });
};
    
const updatePostController = async (req, res) => {
    const { postId } = req.params;
    const { title, description, image } = req.body;
    const { id: userId } = req.user;
    console.log("userId", userId);
    console.log("postId", postId);
    const post = await findUserPost(postId, userId);
    if (!post || !req.body) {
        return res.status(400).json("post not found")
    }
    if (!(title || description || image)) {
        return res.status(400).json({ error: true, message: "Nothing to update" });
    }

    post.title = title ? title : post.title;
    post.description = description ? description : post.description;
    post.image = image ? image : post.image;

    await post.save();
    return res.status(200).json({ error: false, message: `User-${userId} post-${postId} updated successfully`, post: post });
}

const deletePostController = async (req, res) => {
    const { postId } = req.params;
    const { id: userId } = req.user;
    console.log("userID", userId);
    console.log("postID", postId);
    await deleteUserPost(postId, userId);
    return res.status(200).json({ error: false, message: `post-${postId} deleted successfully` });
}

const findAllPostController = async (req, res) => {
    const { title, description } = req.body;
    const { id: userId } = req.user;
    const filter = { user_id: userId };

    if (title) filter.title = { [Op.like]: `%${title}%` };
    if (description) filter.description = { [Op.like]: `%${description}%` };

    const post = await findUsersAllPosts(filter, ["id", "title", "description", "image"])
    return res.status(200).json({ error: false, message: "User posts fetched successfully", data: post });

}

module.exports = {
    createPostController,
    updatePostController,
    deletePostController,
    findAllPostController
}