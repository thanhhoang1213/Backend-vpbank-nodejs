"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sliders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sliders.init(
    {
      image: DataTypes.STRING,
      text1: DataTypes.STRING,
      text2: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Sliders",
    }
  );
  return Sliders;
};
