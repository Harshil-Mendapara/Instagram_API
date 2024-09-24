const { promises: fsPromises } = require('fs');
const { join } = require("path");
const { User } = require("./../models");

const createUser = async (userBody) => {
    try {
        const user = await User.create({ ...userBody });
        return user.toJSON();
    } catch (error) {
        throw new Error("Error while creating user: " + error.message);
    }
}

const findUser = async (whereQuery, attributes = null, query) => {
    try {
        const user = await User.findOne({ ...query, where: whereQuery, attributes });
        if (!user) throw new Error("User not found");
        return user.toJSON();
    } catch (error) {   
        throw new Error(error.message);
    }
}

const updateUsers = async (userData, Query) => {
    const updatedUser = await User.update(userData, { where: Query });
    if (!updatedUser) {
        throw new Error("User not found or no changes were made.");
    }
    return true;
}

const deleteAvatar = async (userId) => {
    const user = await User.findOne({ where: { id: userId } })
    if (!user.avatar) throw new Error("User image is already deleted");
    try {
        await fsPromises.unlink(join(`${__dirname}/../public/${user.avatar}`));
        user.avatar = null;
        await user.save();
    } catch (error) {
        console.error('Error deleting user avatar:', error);
    }
}


const deleteUser = async (userId) => {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }
    await fsPromises.unlink(join(`${__dirname}/../public/${user.avatar}`));
    await user.destroy();
}

module.exports = {
    createUser,
    findUser,
    updateUsers,
    deleteAvatar,
    deleteUser
}