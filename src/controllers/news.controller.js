"use strict";

const { BadRequestError } = require("../utils/error.response");
const NewsService = require("../services/news.service");
const { Created, Ok } = require("../utils/success.response");

class NewsController {
  /**
   * @description Create News
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  create = async (req, res, next) => {
    const data = req.body;
    const file = req.file;

    if (!data.link || !data.title || !file) {
      throw new BadRequestError("Thiếu dữ liệu link hoặc title hoặc fileImage");
    }

    const response = await NewsService.create({ ...data, image: file.filename });

    return new Created({ message: "Tạo News thành công", metadata: response }).send(res);
  };

  /**
   * @description Update News
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  update = async (req, res, next) => {
    const data = req.body;
    const file = req.file;
    const id = req.params.id;

    if (!data.link || !data.title) {
      throw new BadRequestError("Thiếu dữ liệu link hoặc title");
    }

    const response = await NewsService.update(id, { ...data, imageUpdate: file?.filename });

    return new Ok({ message: "Cập nhật News thành công", metadata: response }).send(res);
  };

  /**
   * @description Get All News
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  get = async (req, res, next) => {
    const response = await NewsService.get();

    return new Ok({ message: "Lấy dữ liệu News thành công", metadata: response }).send(res);
  };

  /**
   * @description Get a News
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  getById = async (req, res, next) => {
    const id = req.params.id;

    const response = await NewsService.getById(id);

    return new Ok({
      message: `Lấy dữ liệu News theo id ${id} thành công`,
      metadata: response,
    }).send(res);
  };

  /**
   * @description Delete a News by id
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  delete = async (req, res, next) => {
    const id = req.params.id;

    const response = await NewsService.delete(id);

    return new Ok({ message: `Xóa News với id = ${id} thành công`, metadata: response }).send(res);
  };
}

module.exports = new NewsController();
