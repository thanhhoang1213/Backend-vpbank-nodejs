"use strict";

const { Router } = require("express");
const contentPartController = require("../../controllers/contentPart.controller");
const asyncHandler = require("../../helpers/asyncHandler.helper");
const Authorization = require("../../middlewares/auth.middleware");
const UserRoles = require("../../constants/role.constant");

const route = Router();

route
  .route("/:contentId/:partNumber")
  .get(asyncHandler(contentPartController.getByContentIdAndPartNumber));

module.exports = route;
