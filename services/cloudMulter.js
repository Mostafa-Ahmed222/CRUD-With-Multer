import multer from "multer";
export const validationTypes = {
  image: ["image/jpeg", "image/png", "image/jif"],
  video: ["video/mp4"],
  pdf : ["application/pdf"]
};
export const HME = (err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: "Multer error", err });
  } else {
    next();
  }
};
export const myMulter = (customValidation) => {
  if (!customValidation) {
    customValidation = validationTypes.image;
  }
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("In-Valid Format", false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};
