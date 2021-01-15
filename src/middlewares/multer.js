const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 10000) + "" + Date.now());
  },
});
const uploadFile = multer({ storage: storage })
module.exports = { uploadFile };
