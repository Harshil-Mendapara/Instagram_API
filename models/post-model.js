

const Post = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
      validate: { notNull: { msg: "please Enter title" } }
    },
    description: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
      validate: { notNull: { msg: "please Enter description" } }
    },
    image: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
      validate: { notNull: { msg: "Post Not Found, please upload post image" } }
    },
  }, {
    timestamps: true
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { as: "user", foreignKey: 'user_Id' });
    Post.hasMany(models.LikeComment, { as: 'likes', foreignKey: 'post_Id' });
    Post.hasMany(models.LikeComment, { as: 'comments', foreignKey: 'post_Id' });
  };

  return Post
}

module.exports = Post;
