import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === "fileUrl") {
      cb(null, "public/files/");
      return;
    }
    if (file.fieldname === "coverImage") {
      cb(null, "public/coverImage/");
      return;
    }
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadResources = multer({ storage }).fields([
  { name: "fileUrl", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
