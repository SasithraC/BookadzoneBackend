// import categoryRepository from "../repositories/categoryRepository";
// import { CategoryModel, ICategory } from "../models/catrgoryModel";
// import { Types } from "mongoose";
// import ValidationHelper from "../utils/validationHelper";
// import { CommonService } from "./common.service";

// class CategoryService {
//   private commonService = new CommonService<ICategory>(CategoryModel);

//   private validateCategoryData(data: Partial<ICategory>, photo:any,isUpdate: boolean = false): void { 
//     // Normalize isFeatured to boolean when sent as a string (e.g., from HTML forms)
//     if (typeof (data as any).isFeatured === "string") {
//       const v = ((data as any).isFeatured as string).toLowerCase();
//       (data as any).isFeatured = v === "true" || v === "1" || v === "on";
//     }
//     const rules = [
//       !isUpdate
//         ? ValidationHelper.isRequired(data.name, "name")
//         : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

//       (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 500) : null),

//       !isUpdate
//         ? ValidationHelper.isRequired(data.slug, "slug")
//         : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

//       (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 500) : null),

//       !isUpdate
//         ? ValidationHelper.isRequired(data.description, "description")
//         : (data.description !== undefined ? ValidationHelper.isNonEmptyString(data.description, "description") : null),

//       (data.description !== undefined ? ValidationHelper.maxLength(data.description, "description", 2000) : null),

//       !isUpdate
//         ? ValidationHelper.isRequired(photo, "photo")
//         : null,

//       ValidationHelper.isBoolean((data as any).isFeatured, "isFeatured"),
//     ];

//     const errors = ValidationHelper.validate(rules);
//     if (errors.length > 0) {
//       throw new Error(errors.map(e => e.message).join(", "));
//     }
//   }

//   // async createCategory(data: ICategory,photo:any): Promise<ICategory> {
//   //   this.validateCategoryData(data,photo);
//   //   const exists = await this.commonService.existsByField("slug", data.slug);
//   //   if (exists) {
//   //     throw new Error("Category with this slug already exists");
//   //   }
//   //   // Map uploaded file details to the photo field before saving
//   //   if (photo) {
//   //     if (typeof photo === "object") {
//   //       (data as any).photo = (photo as any).path || (photo as any).filename || String(((photo as any).originalname ?? ""));
//   //     } else if (typeof photo === "string") {
//   //       (data as any).photo = photo;
//   //     }
//   //   }
//   //   return await categoryRepository.createCategory(data);
//   // }

//   // async getAllCategory(page = 1, limit = 10, filter?: string) {
//   //   return await categoryRepository.getAllCategory(page, limit, filter);
//   // }


//    private validateCategoryInfoData(data: Partial<ICategory>, file?: Express.Multer.File, isUpdate: boolean = false): void {
//     console.log(`validateCategoryInfoData: file:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : null);
//     console.log(`validateCategoryInfoData: isUpdate: ${isUpdate}, data:`, data);

//     const rules = [
//       !isUpdate
//         ? ValidationHelper.isRequired(file, "photo") // Check if file object exists for creation
//         : (file ? ValidationHelper.isNonEmptyString(file.filename, "photo") : null),
//       (file ? ValidationHelper.maxLength(file.filename, "photo", 500) : null),

//       !isUpdate
//         ? ValidationHelper.isRequired(data.description, "description")
//         : (data.description !== undefined ? ValidationHelper.isNonEmptyString(data.description, "description") : null),
//       (data.description !== undefined ? ValidationHelper.maxLength(data.description, "description", 2000) : null),

//       // Optional fields
//       (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 200) : null),
//       (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 200) : null),


//       data.status !== undefined ? ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]) : null,

//       data.isDeleted !== undefined ? ValidationHelper.isBoolean(data.isDeleted, "isDeleted") : null,
//     ].filter(Boolean);

//     const errors = ValidationHelper.validate(rules);
//     if (errors.length > 0) {
//       console.log(`Validation errors in validateCategoryInfoData:`, errors);
//       throw new Error(errors.map(e => e.message).join(", "));
//     }
//   }


//     async createCategory(data: Partial<ICategory>, file?: Express.Multer.File): Promise<ICategory> { 
//       console.log("data",data);
      
//       if (!file) {
//         console.log(`createCategory: No Photo file provided`);
//         throw new Error("Photo file is required for creation");
//       }
  
//       const createData: Partial<ICategory> = { ...data, photo: file.filename };
//       this.validateCategoryInfoData(createData, file);
  
//       const categoryInfoData: Partial<ICategory> = {
//         photo: data.photo,
//         description: createData.description!,
//         name: createData.name ?? "",
//         slug: createData.slug ?? "",
//         status: createData.status || 'active',
//         isDeleted: false,
//       };
  
//       console.log(`createCategory: Creating footer info with data:`, categoryInfoData);
//       const exists = await this.commonService.existsByField("Photo", categoryInfoData.photo);
//       if (exists) {
//         console.log(`createCategory: Photo already exists: ${categoryInfoData.photo}`);
//         throw new Error("Photo Info with this Photo already exists");
//       }
//       const result = await categoryRepository.createCategory(categoryInfoData);
//       console.log(`createCategory: Category info created successfully:`, result);
//       return result;
//     }

//       async getAllCategorys(page = 1, limit = 10, filter?: string) {
//         return await categoryRepository.getAllCategory(page, limit, filter);
//       }

//   async getCategoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return await categoryRepository.getCategoryById(id);
//   }

//   async updateCategory(id: string | Types.ObjectId, data: Partial<ICategory>): Promise<ICategory | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     this.validateCategoryData(data,  true);
//     return await categoryRepository.updateCategory(id, data);
//   }

//   async softDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return await categoryRepository.softDeleteCategory(id);
//   }

//   async toggleStatus(id: string | Types.ObjectId): Promise<ICategory | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return await categoryRepository.toggleStatus(id);
//   }

//   async getAllTrashCategorys(page = 1, limit = 10, filter?: string) {
//     return await categoryRepository.getAllTrashCategorys(page, limit, filter);
//   }

//   async restoreCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return await categoryRepository.restoreCategory(id);
//   }

//   async deleteCategoryPermanently(id: string | Types.ObjectId): Promise<ICategory | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return await categoryRepository.deleteCategoryPermanently(id);
//   }
// }

// export default new CategoryService();



// import footerInfoRepository from "../repositories/footerInfoRepository";
import categoryRepository from "../repositories/categoryRepository";
// import { IFooterInfo } from "../models/CategoryModel";
import { ICategory } from "../models/catrgoryModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
// import { FooterInfoModel } from "../models/footerinfoModel";
import { CategoryModel } from "../models/catrgoryModel";

import { CommonService } from "./commonService";

class CategoryService {
  private commonService = new CommonService<ICategory>(CategoryModel);

  private validateCategoryData(data: Partial<ICategory>, file?: Express.Multer.File, isUpdate: boolean = false): void {
    // Length validation - do this first to catch any data issues
    if (data.name && data.name.length > 200) {
      throw new Error('name must be at most 200 characters long');
    }
    if (data.slug && data.slug.length > 200) {
      throw new Error('slug must be at most 200 characters long');
    }
    if (data.description && data.description.length > 2000) {
      throw new Error('description must be at most 2000 characters long');
    }
    if (file && file.filename.length > 500) {
      throw new Error('photo filename must be at most 500 characters long');
    }
    
    // Status validation 
    if (data.status !== undefined && !['active', 'inactive'].includes(data.status)) {
      throw new Error('status must be one of: active, inactive');
    }

    // Required fields validation for creation
    if (!isUpdate) {
      if (!data.description) {
        throw new Error('description must be provided');
      }
      if (!file) {
        throw new Error('photo must be provided');
      }
      if (!data.name && !data.slug) {
        throw new Error('name or slug must be provided');
      }
    }
  }

  async createCategory(data: Partial<ICategory>, file?: Express.Multer.File): Promise<ICategory> {
    console.log(`createCategory: data:`, data, `file:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : null);
    if (!file) {
      console.log(`createCategory: No Photo file provided`);
      throw new Error("Photo file is required for creation");
    }

    // Get the relative path from the absolute path that multer created
    const filePath = file.path.split('uploads')[1].replace(/\\/g, '/');
    const relativeFilePath = `uploads${filePath}`;

    // Check for duplicates before validation
    const exists = await this.commonService.existsByField("photo", relativeFilePath);
    if (exists) {
      console.log(`createCategory: Photo already exists: ${relativeFilePath}`);
      throw new Error("photo already exists");
    }

    // Use the relative path for storage
    const createData: Partial<ICategory> = { 
      ...data, 
      photo: relativeFilePath,
      name: data.name ?? "",
      slug: data.name?.toLowerCase().replace(/\s+/g, '-') ?? "",  // Generate slug from name if not provided
      description: data.description ?? "",
      isFeatured: data.isFeatured ?? true,
      status: data.status || 'active',
      isDeleted: false,
    };
    try {
      this.validateCategoryData(createData, file);
      const result = await categoryRepository.createCategory(createData);
      console.log(`createCategory: Category info created successfully:`, result);
      return result;
    } catch (error) {
      if (error instanceof Error && error.message === "DB error") {
        throw error;  // Propagate DB errors
      }
      throw error;  // Re-throw other errors
    }

    // Unreachable code removed: CategoryData is not defined and this section is never executed.
  }

  async getCategory(page = 1, limit = 10, filter?: string) {
    return await categoryRepository.getCategory(page, limit, filter);
  }

  private validateId(id: string | Types.ObjectId): void {
    if (typeof id !== 'string' || !id || id === 'invalid-id') {
      throw new Error(`Invalid id`);
    }
  }

  async getCategoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
    this.validateId(id);
    return await categoryRepository.getCategoryById(id);
  }

  async updateCategory(id: string | Types.ObjectId, data: Partial<ICategory>, file?: Express.Multer.File): Promise<ICategory | null> {
    console.log(`updateCategory: id: ${id}, data:`, data, `file:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : null);
    this.validateId(id);
    this.validateCategoryData(data, file, true);
    const updateData: Partial<ICategory> = { ...data };
    
    if (file) {
      // Get the relative path from the absolute path that multer created
      const filePath = file.path.split('uploads')[1].replace(/\\/g, '/');
      const relativeFilePath = `uploads${filePath}`;
      updateData.photo = relativeFilePath;
    }
    
    const result = await categoryRepository.updateCategory(id, updateData);
    console.log(`updateCategory: Category updated successfully:`, result);
    return result;
  }

  async softDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    this.validateId(id);
    return await categoryRepository.softDeleteCategory(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<ICategory | null> {
    this.validateId(id);
    return await categoryRepository.toggleStatus(id);
  }

  async getAllTrashCategorys(page = 1, limit = 10, filter?: string) {
    return await categoryRepository.getAllTrashCategorys(page, limit, filter);
  }

  async restoreCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    this.validateId(id);
    return await categoryRepository.restoreCategory(id);
  }

  async deleteCategoryPermanently(id: string | Types.ObjectId): Promise<ICategory | null> {
    this.validateId(id);
    return await categoryRepository.deleteCategoryPermanently(id);
  }
}

export default new CategoryService();