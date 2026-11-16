import multer from "multer";
import path from "node:path";
const imageStorage = multer.diskStorage({
  destination: "uploads/",

  filename: (request, imageFile, done) => {
    const fileExtension = path.extname(imageFile.originalname).toLowerCase();
    done(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${fileExtension}`);
  },
});

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, imageFile, done) => {
    const imageTypes = {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    };
    const fileExtension = path.extname(imageFile.originalname).toLowerCase();
    if (imageTypes[imageFile.mimetype]?.includes(fileExtension)) {
      return done(null, true);
    }

    const problem = new Error("Please upload a JPEG, PNG, or WebP image");
    problem.status = 400;
    done(problem);
  },
});

export default upload;
