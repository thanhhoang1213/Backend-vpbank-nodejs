"use strict";

const { db } = require("../../config/db/mssql.config");
const { NotFoundRequestError, ConflictRequestError } = require("../utils/error.response");
const { Op } = require("sequelize");
const { mapperSlug } = require("../utils/mapper.util");

class ContentService {
  /**
   * @description Tạo nội dung mới
   * @param {Object} data Dữ liệu nội dung mới
   * @returns {Promise<Object>} Promise với dữ liệu nội dung mới được tạo
   */
  static create = async (data) => {
    const { categoryName, summarizeContent, content } = data;

    // Kiểm tra xem categoryName đã tồn tại chưa
    const categoryExist = await db.Contents.findOne({
      where: {
        categoryName: {
          [Op.like]: categoryName,
        },
      },
    });

    if (categoryExist) {
      throw new ConflictRequestError("Tên danh mục đã tồn tại");
    }

    // Tạo slug từ categoryName
    const slug = mapperSlug(categoryName);

    // Tạo nội dung mới với các trường dữ liệu đã được cung cấp
    const response = await db.Contents.create({ categoryName, summarizeContent, content, slug });

    return response;
  };

  /**
   * @description Cập nhật nội dung
   * @param {number} id ID của nội dung cần cập nhật
   * @param {Object} data Dữ liệu mới cần cập nhật
   * @returns {Promise<Object>} Promise với dữ liệu nội dung đã được cập nhật
   */
  static update = async (id, data) => {
    const { categoryName, summarizeContent, content } = data;

    // Tìm nội dung cần cập nhật
    const contentExist = await db.Contents.findByPk(id, { raw: false });

    if (!contentExist) {
      throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);
    }

    // Kiểm tra xem categoryName đã tồn tại chưa (nếu trường categoryName thay đổi)
    const categoryExist = await db.Contents.findOne({
      where: {
        categoryName: {
          [Op.like]: categoryName,
        },
      },
    });

    // Nếu categoryName đã tồn tại và không phải là nội dung hiện tại đang cập nhật, thì throw lỗi
    if (categoryExist && categoryExist.get().id !== +id) {
      throw new ConflictRequestError("Tên danh mục đã tồn tại");
    }

    // Cập nhật các trường dữ liệu mới
    contentExist.categoryName = categoryName;
    contentExist.summarizeContent = summarizeContent;
    contentExist.content = content;
    contentExist.slug = mapperSlug(categoryName);

    // Lưu thay đổi vào cơ sở dữ liệu
    await contentExist.save();

    return contentExist;
  };

  /**
   * @description Lấy tất cả nội dung
   * @returns {Promise<Array>} Promise với mảng các bản ghi nội dung
   */
  static get = async () => {
    const response = await db.Contents.findAll();

    return response;
  };

  /**
   * @description Lấy nội dung theo ID
   * @param {number} id ID của nội dung cần lấy
   * @returns {Promise<Object>} Promise với dữ liệu nội dung được lấy theo ID
   */
  static getById = async (id) => {
    const response = await db.Contents.findByPk(id);

    if (!response) throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);

    return response;
  };

  /**
   * @description Lấy nội dung theo Slug
   * @param {string} slug Slug của nội dung cần lấy
   * @returns {Promise<Object>} Promise với dữ liệu nội dung được lấy theo Slug
   */
  static getBySlug = async (slug) => {
    const response = await db.Contents.findOne({ where: { slug } });

    if (!response) throw new NotFoundRequestError("Không tìm thấy nội dung với slug " + slug);

    return response;
  };

  /**
   * @description Xóa nội dung theo ID
   * @param {number} id ID của nội dung cần xóa
   * @returns {Promise<boolean>} Promise với kết quả xóa nội dung
   */
  static delete = async (id) => {
    const contentExist = await db.Contents.findByPk(id, { raw: false });

    if (!contentExist) {
      throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);
    }

    // Xóa nội dung khỏi cơ sở dữ liệu
    await contentExist.destroy();

    return true;
  };
}

module.exports = ContentService;
