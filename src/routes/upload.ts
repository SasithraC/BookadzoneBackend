import { Router } from "express";
import {upload} from "../utils/fileUpload";

const router = Router();

router.post(
  "/Uploads/image",
  upload.single("image"), // multer field name "image"
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file Uploaded" });
    }

    const fileUrl = `/Uploads/default/image/${req.file.filename}`; // adjust if needed
    res.json({
      success: true,
      data: {
        files: [fileUrl], // Jodit expects array of urls
      },
    });
  }
);

export default router;

