const { hashSync, genSaltSync } = require('bcrypt');
const saltRounds = 12;


const User = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false,
            validate: { notNull: { msg: "Please enter firstName" } }
        },
        lastName: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false,
            validate: { notNull: { msg: "Please enter lastName" } }
        },
        avatar: {
            type: DataTypes.STRING,
            trim: true,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isIn: [['male', 'female', 'other']] }
        },
        username: {
            type: DataTypes.STRING,
            trim: true,
            unique: { msg: "username already exist" },
        },
        email: {
            type: DataTypes.STRING,
            trim: true,
            unique: { msg: "Email already exist" },
            validate: { isEmail: true },
            set(value) {
                const email = value ? value.toLowerCase() : '';
                this.setDataValue('email', email);
            }
        },
        password: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false,
            validate: { notNull: { msg: "password is required" } },
            set(value) {
                this.setDataValue('password', hashSync(value, genSaltSync(saltRounds)))
            }
        },
    }, {
        timestamps: true,
        hooks: {
            afterCreate(row) {
                delete row.dataValues.password
                delete row.dataValues.createdAt
                delete row.dataValues.updatedAt
                delete row.dataValues.avatar
            }
        }

    });

    User.associate = (models) => {
        User.hasMany(models.Post, { as: 'posts', foreignKey: 'user_Id' });
        User.hasMany(models.LikeComment, { as: "likes", foreignKey: "user_Id" })
        User.hasMany(models.LikeComment, { as: "comments", foreignKey: "user_Id" });
        User.hasMany(models.Follow, { as: "following", foreignKey: "sender_id" });
        User.hasMany(models.Follow, { as: "followers", foreignKey: "receiver_id" });
    };
    return User;
}
module.exports = User 
