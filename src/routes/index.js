"use strict";

const { Router } = require("express");
const sliderRoute = require("./slider");
const newsRoute = require("./news");
const userRoute = require("./user");
const authRoute = require("./auth");
const contentRoute = require("./content");

const route = Router();

route.use("/v1/api/auth", authRoute);
route.use("/v1/api/sliders", sliderRoute);
route.use("/v1/api/news", newsRoute);
route.use("/v1/api/users", userRoute);
route.use("/v1/api/contents", contentRoute);

module.exports = route;
