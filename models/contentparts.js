// contentparts.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContentParts extends Model {
    static associate(models) {
      // Define association with Contents
      ContentParts.belongsTo(models.Contents, { foreignKey: 'contentId' });
    }
  }
  ContentParts.init(
    {
      partNumber: DataTypes.INTEGER,
      partContent: DataTypes.TEXT,
      contentId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'ContentParts',
    }
  );
  return ContentParts;
};
