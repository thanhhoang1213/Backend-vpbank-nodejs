"use strict";

const { db } = require("../../config/db/mssql.config");
const { ConflictRequestError, BadRequestError } = require("../utils/error.response");
const { hashPassword, comparePassword } = require("../utils/password");
const UserRoles = require("../constants/role.constant");

class AuthService {
  static register = async (data) => {
    const [usernameExist, isAdmin] = await Promise.all([
      db.Users.findOne({ where: { username: data.username } }),
      db.Users.findOne({ where: { role: UserRoles.admin } }),
    ]);

    if (usernameExist) {
      throw new ConflictRequestError("Tài khoản đã tồn tại");
    }

    const password = await hashPassword(data.password);

    // Kiểm tra nếu đây là chưa  có admin thì lần đầu tạo  sẽ là admin
    if (!isAdmin) {
      data.role = UserRoles.admin;
    } else {
      data.role = UserRoles.user;
    }

    const response = await db.Users.create({ ...data, password });

    return response;
  };

  static login = async ({ username, password }) => {
    const usernameExist = await db.Users.findOne({ where: { username }, raw: false });

    if (!usernameExist) {
      throw new BadRequestError("Tài khoản không tồn tại");
    }

    const checkPassword = await comparePassword(password, usernameExist.password);

    if (!checkPassword) {
      throw new BadRequestError("Sai mật khẩu!");
    }

    const { password: _p, ...others } = usernameExist.get();

    return others;
  };
}

module.exports = AuthService;
