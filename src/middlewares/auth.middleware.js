"use strict";

const { db } = require("../../config/db/mssql.config");
const { UnauthorizedRequestError, ForbiddenRequestError } = require("../utils/error.response");

const Authorization = (role = "") => {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  return async (req, res, next) => {
    const userId = req.headers["x-client-id"]?.toString();

    if (!userId) {
      throw new UnauthorizedRequestError("Vui lòng đăng nhập");
    }

    req.userId = userId;

    const user = await db.Users.findByPk(userId);

    if (!user) {
      throw new ForbiddenRequestError("User Id không hợp lệ");
    }

    const data = user.get();

    req.user = data;

    if (!role) return next();

    if (data.role !== role) throw new ForbiddenRequestError("Bạn không có quyền truy cập");

    next();
  };
};

module.exports = Authorization;
