const fs = require('fs').promises;
const { join } = require("path");
const { Post } = require("./../models");


const createUserPost = async (postBody) => {
    try {
        const post = await Post.create({ ...postBody });
        return post.toJSON();
    } catch (error) {
        throw new Error("Error while creating post: " + error.message);
    }
}

const findUserPosts = async (postId, userId) => {
    const post = await Post.findOne({ id: postId, user_Id: userId });
    return post;
}
const findUserPost = async (postId, userId) => {
    const post = await Post.findOne({ where: { id: postId, user_Id: userId } });
    return post;
}

const deleteUserPost = async (postId, userId) => {
    const post = await findUserPost(postId, userId);
    if (!post) throw Error("post not found");
    const imagePath = join(`${__dirname}/../public/${post.image}`);
    await fs.unlink(imagePath, (err) => {
        if (err) throw err;
    });
    await post.destroy();
}

const findUsersAllPosts = async (whereQuery, attributes = null) => {
    try {
        const posts = await Post.findAll({ where: whereQuery, attributes });
        if (!posts) throw new Error("User not found please Enter valid Token");
        return posts;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createUserPost,
    findUserPosts,
    findUserPost,
    deleteUserPost,
    findUsersAllPosts
}