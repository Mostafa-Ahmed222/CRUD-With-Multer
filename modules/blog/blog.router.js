import { Router } from "express";
import { auth } from "./../../middlewares/Auth.js";
import validation from "./../../middlewares/Validation.js";
import * as validators from "./blog.validator.js";
import * as bc from "./controller/blog.js";
import {
  HME,
  myMulter,
  validationTypes,
} from "./../../services/cloudMulter.js";
const router = Router();

router.post("/", validation(validators.addBlog), auth(), bc.addBlog);
router.patch(
  "/pictures",
  myMulter(validationTypes.image).array("image", 3),
  HME,
  bc.addBlogPic
);
router.patch("/like/:id", validation(validators.likeBlog),auth(), bc.likeBlog);
router.patch("/unlike/:id", validation(validators.unlikeBlog),auth(), bc.unlikeBlog);
router.get('/', bc.getAllBlogs)
router.patch('/video', myMulter(validationTypes.video).single('video'), HME, bc.addVideo)
export default router;
