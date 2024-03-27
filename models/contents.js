'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contents extends Model {
    static associate(models) {
      // Define association with ContentPart
      Contents.hasMany(models.ContentParts, { foreignKey: 'contentId' });
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
      modelName: 'Contents',
    }
  );
  return Contents;
};