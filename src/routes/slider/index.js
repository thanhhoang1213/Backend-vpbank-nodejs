"use strict";

const { Router } = require("express");
const sliderController = require("../../controllers/slider.controller");
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
    asyncHandler(sliderController.create)
  )
  .get(asyncHandler(sliderController.get));

route
  .route("/:id")
  .patch(
    asyncHandler(Authorization(UserRoles.admin)),
    [upload.single("image")],
    asyncHandler(sliderController.update)
  )
  .get(asyncHandler(sliderController.getById))
  .delete(asyncHandler(Authorization(UserRoles.admin)), asyncHandler(sliderController.delete));

module.exports = route;
