"use strict";

const { db } = require("../../config/db/mssql.config");
const { unlink } = require("../helpers/storage.helper");
const { NotFoundRequestError } = require("../utils/error.response");
const { mapperImage } = require("../utils/mapper.util");

class SliderService {
  static get = async () => {
    const response = await db.Sliders.findAll();

    if (!response.length) return [];

    return response.map((t) => {
      const item = t.get();
      return { ...item, image: mapperImage(item.image) };
    });
  };

  static create = async (data) => {
    const response = await db.Sliders.create(data);
    return response;
  };

  static getById = async (id) => {
    const response = await db.Sliders.findByPk(id);

    if (!response) throw new NotFoundRequestError("Không tìm thấy slider với id " + id);

    const data = response.get();

    return { ...data, image: mapperImage(response.image) };
  };

  static delete = async (id) => {
    const sliderExist = await db.Sliders.findByPk(id, { raw: false });

    if (!sliderExist) {
      throw new NotFoundRequestError("Không tìm thấy slider với id " + id);
    }

    unlink(sliderExist.image);

    sliderExist.destroy();

    return true;
  };

  static update = async (id, data) => {
    const sliderExist = await db.Sliders.findByPk(id, { raw: false });

    if (!sliderExist) {
      throw new NotFoundRequestError("Không tìm thấy slider với id " + id);
    }

    if (data.imageUpdate) {
      unlink(sliderExist.image);
      sliderExist.image = data.imageUpdate;
    }

    sliderExist.text1 = data.text1;
    sliderExist.text2 = data.text2;

    await sliderExist.save();

    return sliderExist;
  };
}

module.exports = SliderService;
