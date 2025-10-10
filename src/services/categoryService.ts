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
    const rules: (any | null | undefined)[] = [];

    // Required fields - only for creation
    if (!isUpdate) {
      rules.push(ValidationHelper.isRequired(data.description, "description"));
      rules.push(ValidationHelper.isRequired(file, "photo"));
    }

    // Optional field validations
    if (data.description !== undefined) {
      rules.push(ValidationHelper.maxLength(data.description, "description", 2000));
    }
    if (data.name !== undefined) {
      rules.push(ValidationHelper.maxLength(data.name, "name", 200));
    }
    if (data.slug !== undefined) {
      rules.push(ValidationHelper.maxLength(data.slug, "slug", 200));
    }
    if (file?.filename !== undefined) {
      rules.push(ValidationHelper.maxLength(file.filename, "photo", 500));
    }
    if (data.status !== undefined) {
      rules.push(ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]));
    }
    if (data.isDeleted !== undefined) {
      rules.push(ValidationHelper.isBoolean(data.isDeleted, "isDeleted"));
    }

    const errors = ValidationHelper.validate(rules) || [];
    // Throw if any required field is missing or invalid
    if (!isUpdate) {
      if (!data.name) {
        throw new Error('name is required');
      }
      if (!data.slug) {
        throw new Error('slug is required');
      }
      if (!data.description) {
        throw new Error('description is required');
      }
      if (!file) {
        throw new Error('photo is required');
      }
    }
    // Validate status field if present
    if (data.status !== undefined && !['active', 'inactive', 'deleted'].includes(data.status)) {
      throw new Error('status must be one of: active, inactive, deleted');
    }
    if (Array.isArray(errors) && errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createCategory(data: Partial<ICategory>, file?: Express.Multer.File): Promise<ICategory> {
    console.log(`createCategory: data:`, data, `file:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : null);
    if (!file) {
      console.log(`createCategory: No Photo file provided`);
      throw new Error("Photo file is required for creation");
    }

    const createData: Partial<ICategory> = { ...data, photo: file.filename };
    this.validateCategoryData(createData, file);

    const CategoryData: Partial<ICategory> = {
      photo: file.filename,
      description: createData.description!,
      name: createData.name ?? "",
      slug: createData.slug ?? "",
      isFeatured: createData.isFeatured ?? true,
      // appstore: createData.appstore ?? "",/
      status: createData.status || 'active',
      // priority: createData.priority ? parseInt(createData.priority as any) : 1,
      isDeleted: false,
    };

    console.log(`createCategory: Creating Category with data:`, CategoryData);
    const exists = await this.commonService.existsByField("photo", CategoryData.photo);
    if (exists) {
      console.log(`createCategory: Photo already exists: ${CategoryData.photo}`);
      throw new Error("Category  with this photo already exists");
    }
    const result = await categoryRepository.createCategory(CategoryData);
    console.log(`createCategory: Photo  created successfully:`, result);
    return result;
  }

  async getCategory(page = 1, limit = 10, filter?: string) {
    return await categoryRepository.getCategory(page, limit, filter);
  }

  private validateId(id: string | Types.ObjectId): void {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
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
    if (file?.filename) {
      updateData.photo = file.filename;
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