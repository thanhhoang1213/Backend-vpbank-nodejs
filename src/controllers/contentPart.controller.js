// controllers/contentPart.controller.js

const ContentPartService = require("../services/contentPart.service");

class ContentPartController {
  static async getByContentIdAndPartNumber(req, res, next) {
    const contentId = req.params.contentId;
    const partNumber = req.params.partNumber;
    console.log("check part number: ", partNumber)
    try {
      const contentParts = await ContentPartService.getByContentIdAndPartNumber(contentId, partNumber);
      res.status(200).json({ success: true, data: contentParts });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContentPartController;
