"use strict";

const { BadRequestError } = require("../utils/error.response");
const SliderService = require("../services/slider.service");
const { Created, Ok } = require("../utils/success.response");

class SliderController {
  /**
   * @description Create Sliders
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  create = async (req, res, next) => {
    const data = req.body;
    const file = req.file;

    if (!data.text1 || !data.text2 || !file) {
      throw new BadRequestError("Thiếu dữ liệu text1 hoặc text2 hoặc fileImage");
    }

    const response = await SliderService.create({ ...data, image: file.filename });

    return new Created({ message: "Tạo slider thành công", metadata: response }).send(res);
  };

  /**
   * @description Update Sliders
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  update = async (req, res, next) => {
    const data = req.body;
    const file = req.file;
    const id = req.params.id;

    if (!data.text1 || !data.text2) {
      throw new BadRequestError("Thiếu dữ liệu text1 hoặc text2");
    }

    const response = await SliderService.update(id, { ...data, imageUpdate: file?.filename });

    return new Ok({ message: "Cập nhật slider thành công", metadata: response }).send(res);
  };

  /**
   * @description Get All Sliders
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  get = async (req, res, next) => {
    const response = await SliderService.get();

    return new Ok({ message: "Lấy dữ liệu slider thành công", metadata: response }).send(res);
  };

  /**
   * @description Get a Sliders
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  getById = async (req, res, next) => {
    const id = req.params.id;

    const response = await SliderService.getById(id);

    return new Ok({
      message: `Lấy dữ liệu slider theo id ${id} thành công`,
      metadata: response,
    }).send(res);
  };

  /**
   * @description Delete a Slider by id
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  delete = async (req, res, next) => {
    const id = req.params.id;

    const response = await SliderService.delete(id);

    return new Ok({ message: `Xóa slider với id = ${id} thành công`, metadata: response }).send(
      res
    );
  };
}

module.exports = new SliderController();
