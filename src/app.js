const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const {
  catchNotFoundResources,
  catchInternalServerError,
} = require("./middlewares/app.middleware");
const { connectDB } = require("../config/db/mssql.config");
const cors = require("cors");
const { upload } = require("./helpers/storage.helper");
const { NotFoundRequestError } = require("./utils/error.response");
const { mapperImage } = require("./utils/mapper.util");

const app = express();

// Set static resources
app.use(express.static(__dirname + "/assets/upload"));

console.log("====================================");
console.log(process.env.BASE_FE);
console.log("====================================");

// Init middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.BASE_FE,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type, Accept,Authorization,Origin",
      "x-client-id",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// * upload image
// app.use(upload.array("files"));

app.post("/v1/api/upload", upload.array("files"), (req, res, next) => {
  const tempFile = req.files;

  if (!tempFile && tempFile?.length < 0) {
    throw new NotFoundRequestError("Không có ảnh");
  }

  res.json(mapperImage(req.files[0].filename));
});

// Init Route
app.use(require("./routes"));

app.use(catchNotFoundResources);
app.use(catchInternalServerError);

connectDB();

module.exports = app;
