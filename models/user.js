module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullname: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.TEXT
    }
  }, {
    tableName: 'users',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  });

  return User;
};