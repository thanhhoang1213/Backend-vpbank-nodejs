"use strict";

const statusCodesCore = require("../core/statusCodes.core");
const reasonPhrasesCore = require("../core/reasonPhrases.core");
const { NotFoundRequestError } = require("../utils/error.response");
const fs = require("fs");

/**
 * @description Catch all endpoint not found
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const catchNotFoundResources = (req, res, next) => {
  const error = new NotFoundRequestError("Resource not found!");
  return next(error);
};

/**
 *
 * @param {ErrorResponse} error
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const catchInternalServerError = (error, req, res, next) => {
  console.log("ERROR:::", error);

  const statusCode = error.status || statusCodesCore.INTERNAL_SERVER_ERROR;
  const message = error.message || reasonPhrasesCore.INTERNAL_SERVER_ERROR;

  if (req.file) {
    fs.unlinkSync(req.file.path);
  }

  if (req.files) {
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
  }

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: message,
    // exception: error.stack,
  });
};

module.exports = {
  catchNotFoundResources,
  catchInternalServerError,
};
