const Follow = (sequelize, DataTypes) => {
    const Follow = sequelize.define('follow', {
        status: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false,
            validate: { isIn: [["requested", "accepted", "delete", "blocked"]],
            notNull: { msg: "Status is required" } }
        }
    },{
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['sender_id', 'receiver_id']
            }
        ]
    });

    Follow.associate = (models) => {
        Follow.belongsTo(models.User, { as: "sender_user", foreignKey: "sender_id" });
         Follow.belongsTo(models.User, { as: "receiver_user", foreignKey: "receiver_id" });
    };
    return Follow;
};

module.exports = Follow;
