"use strict";

const { Router } = require("express");
const authController = require("../../controllers/auth.controller");
const asyncHandler = require("../../helpers/asyncHandler.helper");
const Authorization = require("../../middlewares/auth.middleware");

const route = Router();

route.post("/register", asyncHandler(authController.register));
route.post("/login", asyncHandler(authController.login));
route.get("/current-user", asyncHandler(Authorization()), asyncHandler(authController.currentUser));

module.exports = route;
