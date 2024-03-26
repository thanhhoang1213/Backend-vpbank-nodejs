"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contents.init(
    {
      categoryName: DataTypes.STRING,
      summarizeContent: DataTypes.STRING,
      content: DataTypes.TEXT,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Contents",
    }
  );
  return Contents;
};
