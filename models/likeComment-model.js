module.exports = (sequelize, DataTypes) => {
  const LikeComment = sequelize.define('likeComment', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [['like', 'comment']] }
    },
    message: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: true
    }
  });

  LikeComment.associate = (models) => {
    LikeComment.belongsTo(models.User, { foreignKey: 'user_Id', as: 'user' });
    LikeComment.belongsTo(models.Post, { foreignKey: 'post_Id', as: 'post' });
  };

  return LikeComment;
};
