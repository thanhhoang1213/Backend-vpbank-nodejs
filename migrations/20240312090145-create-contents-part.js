'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ContentParts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contents', // Tên bảng cha
          key: 'id' // Khóa chính của bảng cha
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      partNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ContentParts');
  }
};
