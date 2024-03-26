"use strict";

const { Router } = require("express");
const userController = require("../../controllers/user.controller");
const asyncHandler = require("../../helpers/asyncHandler.helper");
const Authorization = require("../../middlewares/auth.middleware");
const UserRoles = require("../../constants/role.constant");

const route = Router();

route.route("/").get(asyncHandler(userController.get));

route
  .route("/:id")
  .patch(asyncHandler(Authorization()), asyncHandler(userController.update))
  .get(asyncHandler(Authorization()), asyncHandler(userController.getById))
  .delete(asyncHandler(Authorization(UserRoles.admin)), asyncHandler(userController.delete));

module.exports = route;
