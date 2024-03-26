"use strict";

const { BadRequestError, ForbiddenRequestError } = require("../utils/error.response");
const UserService = require("../services/user.service");
const { Created, Ok } = require("../utils/success.response");
const UserRoles = require("../constants/role.constant");

class NewsController {
  /**
   * @description Update Người dùng
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  update = async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;

    if (!data.displayName) {
      throw new BadRequestError("Thiếu dữ liệu tên hiển thị");
    }

    if (data?.role && req?.user?.role !== UserRoles.admin) {
      throw new ForbiddenRequestError("Bạn không được phép chỉnh sửa quyền!");
    }

    const response = await UserService.update(id, { ...data });

    return new Ok({ message: "Cập nhật Người dùng thành công", metadata: response }).send(res);
  };

  /**
   * @description Get All Người dùng
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  get = async (req, res, next) => {
    const response = await UserService.get();

    return new Ok({ message: "Lấy dữ liệu Người dùng thành công", metadata: response }).send(res);
  };

  /**
   * @description Get a Người dùng
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  getById = async (req, res, next) => {
    const id = req.params.id;

    const response = await UserService.getById(id);

    return new Ok({
      message: `Lấy dữ liệu Người dùng theo id ${id} thành công`,
      metadata: response,
    }).send(res);
  };

  /**
   * @description Delete a Người dùng by id
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  delete = async (req, res, next) => {
    const id = req.params.id;

    const response = await UserService.delete(id);

    return new Ok({ message: `Xóa Người dùng với id = ${id} thành công`, metadata: response }).send(
      res
    );
  };
}

module.exports = new NewsController();
