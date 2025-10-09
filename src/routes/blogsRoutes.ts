import { Router, Request, Response, NextFunction } from "express";
interface blogRequest extends Request {
  managementName?: string;
}
import blogsController from "../controllers/blogsController";
import { upload } from "../utils/fileUpload"; 
const router = Router();

const setBannerManagementName = (req: blogRequest, res: Response, next: NextFunction) => {
    req.managementName = 'blog';
    next();
};

router.post(
  "/",
    setBannerManagementName,
  upload.fields([
    { name: "blogImg", maxCount: 1 },
  ]),
  (req, res, next) => blogsController.createBlog(req, res, next)
);
router.get("/", (req, res, next) => blogsController.getAllBlogs(req, res, next));
router.get("/trash", (req, res, next) => blogsController.getAllTrashBlogs(req, res, next));
router.get("/:id", (req, res, next) => blogsController.getBlogById(req, res, next));
router.put(
  "/:id",
    setBannerManagementName,
  upload.fields([
    { name: "blogImg", maxCount: 1 },
  ]),
  (req, res, next) => blogsController.updateBlog(req, res, next)
);

router.delete("/softDelete/:id", (req, res, next) => blogsController.softDeleteBlog(req, res, next));
router.patch("/restore/:id", (req, res, next) => blogsController.restoreBlog(req, res, next));
router.patch("/toggleStatus/:id", (req, res, next) => blogsController.toggleBlogStatus(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => blogsController.deleteBlogPermanently(req, res, next));

export default router;
