"use strict";

const { Router } = require("express");
const newsController = require("../../controllers/news.controller");
const { upload } = require("../../helpers/storage.helper");
const asyncHandler = require("../../helpers/asyncHandler.helper");
const Authorization = require("../../middlewares/auth.middleware");
const UserRoles = require("../../constants/role.constant");

const route = Router();

route
  .route("/")
  .post(
    asyncHandler(Authorization(UserRoles.admin)),
    [upload.single("image")],
    asyncHandler(newsController.create)
  )
  .get(asyncHandler(newsController.get));

route
  .route("/:id")
  .patch(
    asyncHandler(Authorization(UserRoles.admin)),
    [upload.single("image")],
    asyncHandler(newsController.update)
  )
  .get(asyncHandler(newsController.getById))
  .delete(asyncHandler(Authorization(UserRoles.admin)), asyncHandler(newsController.delete));

module.exports = route;
