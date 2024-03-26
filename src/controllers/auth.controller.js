"use strict";

const { BadRequestError, UnauthorizedRequestError } = require("../utils/error.response");
const AuthService = require("../services/auth.service");
const { Created, Ok } = require("../utils/success.response");

class AuthController {
  /**
   * @description Register User
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  register = async (req, res, next) => {
    const data = req.body;

    if (!data.username || !data.password || !data.displayName) {
      throw new BadRequestError("Thiếu dữ username or password or displayName");
    }

    const response = await AuthService.register(data);

    return new Created({ message: "Tạo Người dùng thành công", metadata: response }).send(res);
  };

  /**
   * @description Current User
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  currentUser = async (req, res, next) => {
    const data = req.user;

    if (!data) {
      throw new UnauthorizedRequestError("Vui lòng đăng nhập");
    }

    const { password, ...other } = data;

    return new Ok({ message: "Lấy người dùng hiện tại thành công", metadata: other }).send(res);
  };

  /**
   * @description Login
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  login = async (req, res, next) => {
    const data = req.body;

    if (!data.username || !data.password) {
      throw new BadRequestError("Thiếu dữ username or password ");
    }

    const response = await AuthService.login(data);

    return new Ok({ message: "Đăng nhập thành công", metadata: response }).send(res);
  };
}

module.exports = new AuthController();
