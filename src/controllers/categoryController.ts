// import { Request, Response, NextFunction } from "express";
// import categoryService from "../services/categoryService";
// import { HTTP_RESPONSE } from "../utils/httpResponse";
// import multer from "multer";
// import path from 'path';
// import { log } from "console";

// class CategoryController {
//   // async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
//   //   console.log("inside createCategory", req.body, "req",);
//   //   console.log("Form Data (Text):", req.body);

//   //   // 👉 File(s) from form-data
//   //   console.log("Uploaded File:", req?.file);
//   //     let data = { ...req.body };
//   //     if (req.files) {
//   //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   //   // Define the expected file field names, e.g., ['image', 'icon']
//   //   const fileFields = ['image', 'icon'];
//   //   fileFields.forEach((field) => {
//   //     if (files[field]?.[0]) {
//   //       data[field] = normalizePath(files[field][0].path);
//   //     } else {
//   //       data[field] = data[field] || '';
//   //     }
//   //   });
//   // } 

//   //   try {
//   //     const category = await categoryService.createCategory(req.body, req?.file);
//   //     res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category created", data: category });
//   //   } catch (err: any) {
//   //     if (err.message && err.message.includes("already exists")) {
//   //       res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
//   //       return;
//   //     }
//   //     next(err);
//   //   }
//   // }


//   //


//   // async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
//   //   try {
//   //     let data = { ...req.body };
//   //     if (req.files) {
//   //       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   //       // Define fileFields or handle accordingly
//   //       const fileFields = ['photo']; // Example fields
//   //       fileFields.forEach((field) => {
//   //         if (files[field]?.[0]) {
//   //           data[field] = normalizePath(files[field][0].path);
//   //         } else {
//   //           data[field] = data[field] || '';
//   //         }
//   //       });
//   //     }
//   //     // Make sure createCategoryService is imported and implemented
//   //     const category = await categoryService.createCategory(data,data.photo);
//   //     res.status(201).json({ success: true, data: category });
//   //   } catch (err) {
//   //     next(err);
//   //   }
//   // }



//   async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       if (!req.file && !req.body.photo) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Photo file is required' });
//         return;
//       }
//       let photoUrl = req.body.photo;
//       let photoUrlTest = "";
//       if (req.file) {
//         photoUrl = `/uploads/category/photo/${req.file.filename}`; // Full path

//         photoUrlTest = path.join('uploads', req.file.filename + "." + req.file.mimetype.split('/')[1]) // Full path
//         console.log(">>>>>>>>photoUrl", photoUrl, photoUrlTest);

//         // Alternatively, use only filename: logoUrl = req.file.filename;
//       }

//         const photoinfo = await categoryService.createCategory({ ...req.body, photo: photoUrlTest }, req.file);
//         res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Photo Info created', data: photoinfo });
//       } catch (err: any) {
//         if (err.message && err.message.includes('already exists')) {
//           res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
//           return;
//         }
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
//       }

//     //   const photoinfo = await categoryService.createCategory(
//     //     { ...req.body, photo: photoUrl },
//     //     req.file
//     //   );

//     //   // return full URL to frontend
//     //   const fullPhotoUrl = `${req.protocol}://${req.get("host")}${photoUrl}`;

//     //   res.status(201).json({
//     //     status: HTTP_RESPONSE.SUCCESS,
//     //     message: "Photo Info created",
//     //     data: { ...photoinfo, photo: fullPhotoUrl }
//     //   });
//     // } catch (err: any) {
//     //   if (err.message && err.message.includes("already exists")) {
//     //     res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
//     //     return;
//     //   }
//     //   res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
//     // }
//   }







//   //


//   //



//   //

//   // async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
//   //   try {
//   //     const { name, slug, description, checkbox } = req.body;

//   //     const photoPath = req.file?.filename || "";

//   //     const categoryData = {
//   //       ...req.body,
//   //       checkbox: req.body.checkbox === "true"
//   //     };

//   //     const category = await categoryService.createCategory(categoryData, photoPath);

//   //     res.status(201).json({
//   //       status: HTTP_RESPONSE.SUCCESS,
//   //       message: "Category created",
//   //       data: category
//   //     });
//   //   } catch (err: any) {
//   //     if (err.message?.includes("already exists")) {
//   //       res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
//   //       return;
//   //     }
//   //     next(err);
//   //   }
//   // }

//   async getAllCategorys(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const filter = req.query.status as string | undefined;
//       const result = await categoryService.getAllCategorys(page, limit, filter);
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
//     } catch (err: any) {
//       next(err);
//     }
//   }

//   async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       if (!id) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
//         return;
//       }
//       const category = await categoryService.getCategoryById(id);
//       if (!category) {
//         res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
//         return;
//       }
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: category });
//     } catch (err: any) {
//       next(err);
//     }
//   }

//   async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       console.log("id", id);

//       if (!id) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
//         return;
//       }
//       const category = await categoryService.updateCategory(id, req.body);
//       console.log("req.body", req.body);

//       if (!category) {
//         res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
//         return;
//       }
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category updated", data: category });
//     } catch (err: any) {
//       next(err);
//     }
//   }

//   async softDeleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       if (!id) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
//         return;
//       }

//       const category = await categoryService.softDeleteCategory(id);
//       if (!category) {
//         res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
//         return;
//       }

//       // Include updated Category document in response data
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category deleted successfully", data: category });
//     } catch (err: any) {
//       next(err);
//     }
//   }

//   async toggleCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       if (!id) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
//         return;
//       }
//       const updated = await categoryService.toggleStatus(id);
//       if (!updated) {
//         res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
//         return;
//       }
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category status toggled", data: updated });
//     } catch (error) {
//       next(error);
//     }
//   }
//   async getAllTrashCategorys(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const filter = req.query.status as string | undefined;
//       const result = await categoryService.getAllTrashCategorys(page, limit, filter);
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
//     } catch (err: any) {
//       next(err);
//     }
//   }

//   async restoreCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       if (!id) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
//         return;
//       }

//       const category = await categoryService.restoreCategory(id);
//       if (!category) {
//         res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
//         return;
//       }

//       // Include updated Category document in response data
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category restored successfully", data: category });
//     } catch (err: any) {
//       next(err);
//     }
//   }

//   async deleteCategoryPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       if (!id) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
//         return;
//       }
//       const category = await categoryService.deleteCategoryPermanently(id);
//       if (!category) {
//         res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
//         return;
//       }
//       res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category permanently deleted" });
//     } catch (err: any) {
//       next(err);
//     }
//   }
// }

// export default new CategoryController();

// function normalizePath(path: string): string {
//   // Convert Windows backslashes to forward slashes for URLs
//   return path.replace(/\\/g, "/");
// }


import { Request, Response, NextFunction } from 'express';
// import footerInfoService from '../services/footerInfoService';
import categoryService from '../services/categoryService';
import { HTTP_RESPONSE } from '../utils/httpResponse';
import path from 'path';

class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file && !req.body.photo) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Photo file is required' });
        return;
      }
      // Just pass the request file directly, the service will handle the file path
      const categoryinfo = await categoryService.createCategory(req.body, req.file);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Category created', data: categoryinfo });
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err); // Pass error to global error handler
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const category = await categoryService.getCategory(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Category id is required' });
        return;
      }
      const category = await categoryService.getCategoryById(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Category Info not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Category id is required' });
        return;
      }
      // Let service handle file path management
      const category = await categoryService.updateCategory(id, req.body, req.file);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Category not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Category updated', data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Category id is required' });
        return;
      }
      const category = await categoryService.softDeleteCategory(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Category not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Category deleted successfully', data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Category id is required' });
        return;
      }
      const updated = await categoryService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Category not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Category status toggled', data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrashCategorys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await categoryService.getAllTrashCategorys(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Category  id is required' });
        return;
      }
      const category = await categoryService.restoreCategory(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Category  not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Category  restored successfully', data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteCategoryPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Category id is required' });
        return;
      }
      const category = await categoryService.deleteCategoryPermanently(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Category not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Category permanently deleted' });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new CategoryController();
