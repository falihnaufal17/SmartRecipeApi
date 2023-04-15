module.exports = (sequelize, Sequelize) => {
    const Bookmark = sequelize.define("bookmark", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.JSON
        }
    }, {
        tableName: 'bookmarks',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    return Bookmark;
};