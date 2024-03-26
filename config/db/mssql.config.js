require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const sliderModel = require("../../models/sliders");
const newsModel = require("../../models/news");
const userModel = require("../../models/user");
const contentModel = require("../../models/contents");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_SQL_PORT,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    options: { encrypt: false },
  },
  query: {
    raw: false,
  },
  logging: false
});

const db = {};
db.Sliders = sliderModel(sequelize, DataTypes);
db.News = newsModel(sequelize, DataTypes);
db.Users = userModel(sequelize, DataTypes);
db.Contents = contentModel(sequelize, DataTypes);

let connectDB = async () => {
  try {
    // sync all models with database
    sequelize.sync({ alter: true });

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connectDB to the database:", error);
  }
};

module.exports = {
  db,
  connectDB,
};
