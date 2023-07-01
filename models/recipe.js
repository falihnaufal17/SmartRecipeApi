module.exports = (sequelize, Sequelize) => {
  const Recipe = sequelize.define(
    "recipes",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
      },
      ingredients: {
        type: Sequelize.STRING,
        get() {
          const ingredientsString = this.getDataValue('ingredients');
          
          return ingredientsString ? ingredientsString.split(';') : [];
        }
      },
      thumbnail: {
        type: Sequelize.TEXT,
      },
      video_url: {
        type: Sequelize.TEXT
      }
    },
    {
      tableName: "recipes",
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );

  return Recipe;
};
