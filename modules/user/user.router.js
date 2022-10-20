import { Router } from "express";
import { auth } from "./../../middlewares/Auth.js";
import * as uc from "./controller/user.js";
import validation from "./../../middlewares/Validation.js";
import * as validators from "./user.validator.js";
import {
  HME,
  myMulter,
  validationTypes,
} from "./../../services/cloudMulter.js";
const router = Router();

router.patch(
  "/profile",
  validation(validators.updateProfile),
  auth(),
  uc.updateProfile
);
router.patch(
  "/softDelete",
  validation(validators.softDelete),
  auth(),
  uc.softDelete
);
router.patch(
  "/profile/pic",
  myMulter(validationTypes.image).single("image"),
  HME,
  auth(),
  uc.addProfilePic
);
router.patch(
  "/profile/cov",
  myMulter(validationTypes.image).array("image", 3),
  HME,
  auth(),
  uc.addProfileCov
);
router.post('/sendPdf',myMulter(validationTypes.pdf).single("pdf"), HME,uc.sendPdf)
router.post('/sendPdfInMail',myMulter(validationTypes.pdf).single("pdf"), HME,uc.sendPdfInMail)

export default router;
