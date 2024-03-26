"use strict";

const { StatusCodes, ReasonPhrases } = require("../core");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = message || reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }

  /**
   * @description Response
   * @param {import("express").Response} res
   * @param {Object} headers
   * @returns
   */
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor({ message, metadata, options = {} }) {
    super({ message, metadata });
    this.options = options;
  }
}

class Created extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata = {},
  }) {
    super({ message, reasonStatusCode, statusCode, metadata });
  }
}

module.exports = {
  Ok,
  Created,
};
