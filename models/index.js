const Sequelize = require('sequelize');
const config = require('../config/db-config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.databaseName, config.username, config.password, {
    dialect: config.dialect
});

const db = {};

const UserModel = require('./user-model');
const PostModel = require('./post-model');
const FollowModel = require('./follows-model');
const LikeCommentModel = require('./likeComment-model.js');

db.User = UserModel(sequelize, Sequelize);
db.Post = PostModel(sequelize, Sequelize);
db.Follow = FollowModel(sequelize, Sequelize);
db.LikeComment = LikeCommentModel(sequelize, Sequelize);


Object.values(db).forEach(model => {
    if (model.associate) {
        model.associate(db);
    }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
