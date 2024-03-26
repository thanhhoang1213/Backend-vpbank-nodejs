"use strict";

const { BadRequestError, ForbiddenRequestError } = require("../utils/error.response");
const { Created, Ok } = require("../utils/success.response");
const UserRoles = require("../constants/role.constant");
const ContentService = require("../services/content.service");

class ContentController {
  /**
   * @description Create Nội dung
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  create = async (req, res, next) => {
    const data = req.body;

    if (!data.content || !data.categoryName) {
      throw new BadRequestError("Thiếu dữ liệu content hoặc categoryName");
    }

    const response = await ContentService.create(data);

    return new Created({ message: "Tạo nội dung thành công", metadata: response }).send(res);
  };

  /**
   * @description Update Nội dung
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  update = async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;

    if (!data.content || !data.categoryName) {
      throw new BadRequestError("Thiếu dữ liệu content hoặc categoryName");
    }

    const response = await ContentService.update(id, { ...data });

    return new Ok({ message: "Cập nhật nội dung thành công", metadata: response }).send(res);
  };

  /**
   * @description Get all Nội dung
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  get = async (req, res, next) => {
    const response = await ContentService.get();

    return new Ok({ message: "Lấy dữ liệu nội dung thành công", metadata: response }).send(res);
  };

  /**
   * @description Get one Nội dung
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  getById = async (req, res, next) => {
    const id = req.params.id;

    const response = await ContentService.getById(id);

    return new Ok({
      message: `Lấy dữ liệu nội dung theo id ${id} thành công`,
      metadata: response,
    }).send(res);
  };

  /**
   * @description Get one Nội dung
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  getBySlug = async (req, res, next) => {
    const slug = req.params.slug;

    const response = await ContentService.getBySlug(slug);

    return new Ok({
      message: `Lấy dữ liệu nội dung theo slug ${slug} thành công`,
      metadata: response,
    }).send(res);
  };

  /**
   * @description Delete a Nội dung by id
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  delete = async (req, res, next) => {
    const id = req.params.id;

    const response = await ContentService.delete(id);

    return new Ok({ message: `Xóa Nội dung với id = ${id} thành công`, metadata: response }).send(
      res
    );
  };
}

module.exports = new ContentController();
