import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  // Only accept PDF files
  const ext = path.extname(file.originalname);
  if (ext !== ".pdf") {
    cb(new Error("Only PDF files are allowed"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
