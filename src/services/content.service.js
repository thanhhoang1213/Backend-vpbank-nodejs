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
    const { categoryName, summarizeContent, content, contentParts } = data;

    try {
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
        const mainContent = await db.Contents.create(
            { categoryName, summarizeContent, content, slug }
        );

        // Lưu các phần nội dung nhỏ vào bảng ContentParts
        const createdContentParts = [];
        for (const part of contentParts) {
            const contentPart = await db.ContentParts.create(
                {
                    contentId: mainContent.id,
                    partNumber: part.partNumber,
                    partContent: part.partContent,
                }
            );
            createdContentParts.push(contentPart);
        }

        return { mainContent, contentParts: createdContentParts };
    } catch (error) {
        throw error;
    }
};





  /**
   * @description Cập nhật nội dung
   * @param {number} id ID của nội dung cần cập nhật
   * @param {Object} data Dữ liệu mới cần cập nhật
   * @returns {Promise<Object>} Promise với dữ liệu nội dung đã được cập nhật
   */
  static update = async (id, data) => {

    console.log("check id: ", id);

      // Kiểm tra xem id có hợp lệ không
    if (!id) {
      throw new BadRequestError("Id không được gửi lên từ client.");
    }
    const { categoryName, summarizeContent, content, contentParts } = data;
  
    try {
      // Tìm nội dung cần cập nhật
      let contentExist = await db.Contents.findByPk(id);
  
      if (!contentExist) {
        throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);
      }
  
      // Kiểm tra xem categoryName đã tồn tại chưa (nếu trường categoryName thay đổi)
      const categoryExist = await db.Contents.findOne({
        where: {
          categoryName: {
            [Op.like]: categoryName,
          },
          id: {
            [Op.ne]: id // Không so sánh với chính nó
          }
        },
      });
  
      // Nếu categoryName đã tồn tại, thì throw lỗi
      if (categoryExist) {
        throw new ConflictRequestError("Tên danh mục đã tồn tại");
      }
  
      // Cập nhật các trường dữ liệu mới
      await contentExist.update({
        categoryName: categoryName,
        summarizeContent: summarizeContent,
        content: content,
        slug: mapperSlug(categoryName),
      });
  
      // Xóa các phần nội dung nhỏ hiện tại
      await db.ContentParts.destroy({ where: { contentId: id } });
  
      // Lưu các phần nội dung nhỏ mới vào bảng ContentParts
      const updatedContentParts = [];
      for (const part of contentParts) {
        const contentPart = await db.ContentParts.create({
          contentId: id,
          partNumber: part.partNumber,
          partContent: part.partContent,
        });
        updatedContentParts.push(contentPart);
      }
  
      return { mainContent: contentExist, contentParts: updatedContentParts };
    } catch (error) {
      throw error;
    }
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
  // static getById = async (id) => {
  //   const response = await db.Contents.findByPk(id);

  //   if (!response) throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);

  //   return response;
  // };

  static getById = async (id) => {
    try {
      const content = await db.Contents.findByPk(id, { raw: true });
      if (!content) throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);
  
      const contentParts = await db.ContentParts.findAll({
        where: {
          contentId: id
        },
        raw: true
      });
  
      return { content, contentParts };
    } catch (error) {
      throw error;
    }
  };
  

  /**
   * @description Lấy nội dung theo Slug
   * @param {string} slug Slug của nội dung cần lấy
   * @returns {Promise<Object>} Promise với dữ liệu nội dung được lấy theo Slug
   */
  // static getBySlug = async (slug) => {
  //   const response = await db.Contents.findOne({ where: { slug } });

  //   if (!response) throw new NotFoundRequestError("Không tìm thấy nội dung với slug " + slug);

  //   return response;
  // };

  // static getBySlug = async (slug) => {
  //   const response = await db.Contents.findOne({ 
  //     where: { slug },
  //     include: { model: db.ContentParts } // Lấy cả contentParts
  //   });
  
  //   if (!response) throw new NotFoundRequestError("Không tìm thấy nội dung với slug " + slug);
  
  //   return response;
  // };

  static getBySlug = async (slug) => {
    try {
      // Tìm nội dung với slug tương ứng
      const content = await db.Contents.findOne({ where: { slug } });
      
      if (!content) {
        throw new NotFoundRequestError("Không tìm thấy nội dung với slug " + slug);
      }
  
      // Tìm tất cả các phần nội dung (contentParts) liên quan đến nội dung trên
      const contentParts = await db.ContentParts.findAll({ where: { contentId: content.id } });
  
      // Tạo đối tượng response kết hợp thông tin từ cả nội dung và contentParts
      const responseData = {
        id: content.id,
        categoryName: content.categoryName,
        summarizeContent: content.summarizeContent,
        content: content.content,
        slug: content.slug,
        contentParts: contentParts.map(part => ({
          partNumber: part.partNumber,
          partContent: part.partContent
        }))
      };
  
      return responseData;
    } catch (error) {
      throw error; // Re-throw lỗi để được xử lý bởi middleware xử lý lỗi global
    }
  };
  
  
  

  /**
   * @description Xóa nội dung theo ID
   * @param {number} id ID của nội dung cần xóa
   * @returns {Promise<boolean>} Promise với kết quả xóa nội dung
   */
  // static delete = async (id) => {
  //   const contentExist = await db.Contents.findByPk(id, { raw: false });

  //   if (!contentExist) {
  //     throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);
  //   }

  //   // Xóa nội dung khỏi cơ sở dữ liệu
  //   await contentExist.destroy();

  //   return true;
  // };

  // static delete = async (id) => {
  //   const contentExist = await db.Contents.findByPk(id, { include: db.ContentParts });
  
  //   if (!contentExist) {
  //     throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);
  //   }
  
  //   // Xóa tất cả các content part liên quan trước
  //   await Promise.all(contentExist.ContentParts.map(part => part.destroy()));
  
  //   // Sau đó xóa nội dung khỏi cơ sở dữ liệu
  //   await contentExist.destroy();
  
  //   return true;
  // };

  static delete = async (id) => {
    const contentExist = await db.Contents.findByPk(id);
  
    if (!contentExist) {
      throw new NotFoundRequestError("Không tìm thấy nội dung với id " + id);
    }
  
    // Xóa tất cả các content part liên quan trước
    await db.ContentParts.destroy({ where: { contentId: id } });
  
    // Sau đó xóa nội dung khỏi cơ sở dữ liệu
    await contentExist.destroy();
  
    return true;
  };
}

module.exports = ContentService;
