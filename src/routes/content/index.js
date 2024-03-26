"use strict";

const { Router } = require("express");
const contentController = require("../../controllers/content.controller");
const asyncHandler = require("../../helpers/asyncHandler.helper");
const Authorization = require("../../middlewares/auth.middleware");
const UserRoles = require("../../constants/role.constant");

const route = Router();

route
  .route("/")
  .post(asyncHandler(Authorization(UserRoles.admin)), asyncHandler(contentController.create))
  .get(asyncHandler(contentController.get));

route.get("/slug/:slug", asyncHandler(contentController.getBySlug));

route
  .route("/:id")
  .patch(asyncHandler(Authorization(UserRoles.admin)), asyncHandler(contentController.update))
  .get(asyncHandler(contentController.getById))
  .delete(asyncHandler(Authorization(UserRoles.admin)), asyncHandler(contentController.delete));

module.exports = route;
