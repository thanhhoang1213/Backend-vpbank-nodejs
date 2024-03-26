const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirUpload = "src/assets/upload/";
    if (!fs.existsSync(dirUpload)) {
      fs.mkdirSync(dirUpload, { recursive: true });
    }
    cb(null, dirUpload);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".");
    const newExt = ext[ext.length - 1];
    cb(null, `${Date.now()}.${newExt}`);
  },
});

const upload = multer({ storage: storage });

const unlink = (filename) => fs.unlinkSync("src\\assets\\upload\\" + filename);

module.exports = {
  upload,
  unlink,
};
