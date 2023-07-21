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
        type: Sequelize.TEXT,
        get() {
          const ingredientsString = this.getDataValue('ingredients');
          
          return ingredientsString ? ingredientsString.split(';') : [];
        }
      },
      equipments: {
        type: Sequelize.TEXT,
        get() {
          const equipmentsString = this.getDataValue('equipments');

          return equipmentsString ? equipmentsString.split(';') : [];
        }
      },
      instructions: {
        type: Sequelize.TEXT,
        get() {
          const instructionsString = this.getDataValue('instructions');

          return instructionsString ? instructionsString.split(';') : [];
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
