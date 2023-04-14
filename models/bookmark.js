module.exports = (sequelize, Sequelize) => {
    const Bookmark = sequelize.define("bookmark", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rating: {
            type: Sequelize.NUMBER
        },
        review: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'bookmarks',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    return Bookmark;
};