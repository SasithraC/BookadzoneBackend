import { Router } from "express";
import { upload } from "../utils/fileUpload";
import { 
  uploadEditorImageController, 
  deleteEditorImageController 
} from "../controllers/uploadEditorImageController";

const router = Router();

// POST /api/v1/editer/image - Upload image
router.post("/", upload.single("image"), uploadEditorImageController);

// DELETE /api/v1/editer/image - Delete image
router.delete("/", deleteEditorImageController);

export default router;