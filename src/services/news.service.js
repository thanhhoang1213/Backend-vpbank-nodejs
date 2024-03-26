"use strict";

const { db } = require("../../config/db/mssql.config");
const { unlink } = require("../helpers/storage.helper");
const { NotFoundRequestError } = require("../utils/error.response");
const { mapperImage } = require("../utils/mapper.util");

class NewsService {
  static get = async () => {
    const response = await db.News.findAll();

    if (!response.length) return [];

    return response.map((t) => {
      const item = t.get();
      return { ...item, image: mapperImage(item.image) };
    });
  };

  static create = async (data) => {
    const response = await db.News.create(data);
    return response;
  };

  static getById = async (id) => {
    const response = await db.News.findByPk(id);

    if (!response) throw new NotFoundRequestError("Không tìm thấy tin tức với id " + id);

    const data = response.get();

    return { ...data, image: mapperImage(response.image) };
  };

  static delete = async (id) => {
    const newsExist = await db.News.findByPk(id, { raw: false });

    if (!newsExist) {
      throw new NotFoundRequestError("Không tìm thấy tin tức với id " + id);
    }

    unlink(newsExist.image);

    newsExist.destroy();

    return true;
  };

  static update = async (id, data) => {
    const newsExist = await db.News.findByPk(id, { raw: false });

    if (!newsExist) {
      throw new NotFoundRequestError("Không tìm thấy tin tức với id " + id);
    }

    if (data.imageUpdate) {
      unlink(newsExist.image);
      newsExist.image = data.imageUpdate;
    }

    newsExist.title = data.title;
    newsExist.link = data.link;

    await newsExist.save();

    return newsExist;
  };
}

module.exports = NewsService;
