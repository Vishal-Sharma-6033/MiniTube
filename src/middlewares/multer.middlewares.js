import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure upload directory exists
const uploadDir = "./public/temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // ✅ keep original filename
  },
});

export const upload = multer({
  storage,
});

