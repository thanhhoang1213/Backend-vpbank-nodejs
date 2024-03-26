"use strict";

const { db } = require("../../config/db/mssql.config");
const { NotFoundRequestError } = require("../utils/error.response");

class NewsService {
  static get = async () => {
    const response = await db.Users.findAll();

    if (!response.length) return [];

    return response.map((t) => {
      const { password, ...other } = t.get();
      return other;
    });
  };

  static getById = async (id) => {
    const response = await db.Users.findByPk(id);

    if (!response) throw new NotFoundRequestError("Không tìm thấy người dùng với id " + id);

    const { password, ...other } = response.get();

    return other;
  };

  static delete = async (id) => {
    const userExist = await db.Users.findByPk(id, { raw: false });

    if (!userExist) {
      throw new NotFoundRequestError("Không tìm thấy người dùng với id " + id);
    }

    userExist.destroy();

    return true;
  };

  static update = async (id, data) => {
    const userExist = await db.Users.findByPk(id, { raw: false });

    if (!userExist) {
      throw new NotFoundRequestError("Không tìm thấy người dùng với id " + id);
    }

    userExist.displayName = data.displayName;

    if (data.role) {
      userExist.role = data.role;
    }

    await userExist.save();

    return userExist;
  };
}

module.exports = NewsService;
