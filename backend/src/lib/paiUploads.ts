import multer from "multer";
import path from "path";

export const paidUploadUser = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "public/paidUploads/");
    },

    filename: (_req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),

  // max size 3MB
  limits: {
    fileSize: 1024 * 1024 * 3,
  },

  // filter
  fileFilter: (_req, file, cb) => {
    const allowedFileTypes = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = path.extname(file.originalname);
    if (allowedFileTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});
