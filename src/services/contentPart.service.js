const { db } = require("../../config/db/mssql.config");
const { NotFoundRequestError } = require("../utils/error.response");

class ContentPartService {
  static async getByContentIdAndPartNumber(contentId, partNumber) {
    try {
      // Lấy thông tin content part từ bảng ContentParts
      const contentPart = await db.ContentParts.findOne({ 
        where: { 
          contentId: contentId,
          partNumber: partNumber 
        } 
      });
      if (!contentPart) {
        throw new NotFoundRequestError("Content part not found");
      }

      // Lấy thông tin category name từ bảng Content
      const content = await db.Contents.findOne({
        where: {
          id: contentId
        }
      });

      // Kiểm tra xem content có tồn tại không trước khi thêm categoryName
      if (content) {
        // Sao chép đối tượng contentPart
        const contentPartWithCategory = { ...contentPart.dataValues };
        // Thêm thuộc tính categoryName vào đối tượng mới
        contentPartWithCategory.categoryName = content.dataValues.categoryName;
        return contentPartWithCategory;
      }

      return contentPart;
    } catch (error) {
      throw new Error("Error while fetching content part by contentId and partNumber");
    }
  }
}

module.exports = ContentPartService;
