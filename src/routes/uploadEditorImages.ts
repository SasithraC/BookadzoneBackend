import { Router } from "express";
import { upload } from "../utils/fileUpload";
import { uploadEditorImageController } from "../controllers/uploadEditorImageController";

const router = Router();

// POST /api/v1/editer/image
router.post("/", upload.single("image"), uploadEditorImageController);

export default router;
