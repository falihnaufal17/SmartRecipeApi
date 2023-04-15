module.exports = (sequelize, Sequelize) => {
    const Rating = sequelize.define("rating", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        rate: {
            type: Sequelize.TINYINT
        },
        review: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'ratings',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    return Rating;
};