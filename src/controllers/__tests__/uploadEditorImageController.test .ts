import request from "supertest";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadEditorImageController } from "../uploadEditorImageController";

const app = express();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/editor/upload", upload.single("image"), uploadEditorImageController);

describe("uploadEditorImageController", () => {
  it("should return 400 if no file is uploaded", async () => {
    const res = await request(app).post("/editor/upload");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "No file uploaded");
  });

  it("should upload a file and return 200 with file url", async () => {
    const testImage = path.join(__dirname, "test-image.png");

    // create dummy test image if not exists
    if (!fs.existsSync(testImage)) {
      fs.writeFileSync(testImage, "dummy content");
    }

    const res = await request(app)
      .post("/editor/upload")
      .attach("image", testImage);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(1);
    expect(res.body.data.files[0].url).toMatch(/\/uploads\//);
  });
});
