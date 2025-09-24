import categoryRepository from "../repositories/categoryRepository";
import { CategoryModel, ICategory } from "../models/catrgoryModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { CommonService } from "./common.service";

class CategoryService {
  private commonService = new CommonService<ICategory>(CategoryModel);

  private validateCategoryData(data: Partial<ICategory>, photo:any,isUpdate: boolean = false): void { 
    // Normalize isFeatured to boolean when sent as a string (e.g., from HTML forms)
    if (typeof (data as any).isFeatured === "string") {
      const v = ((data as any).isFeatured as string).toLowerCase();
      (data as any).isFeatured = v === "true" || v === "1" || v === "on";
    }
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 500) : null),

      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

      (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 500) : null),

      !isUpdate
        ? ValidationHelper.isRequired(data.description, "description")
        : (data.description !== undefined ? ValidationHelper.isNonEmptyString(data.description, "description") : null),

      (data.description !== undefined ? ValidationHelper.maxLength(data.description, "description", 2000) : null),

      !isUpdate
        ? ValidationHelper.isRequired(photo, "photo")
        : null,

      ValidationHelper.isBoolean((data as any).isFeatured, "isFeatured"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createCategory(data: ICategory,photo:any): Promise<ICategory> {
    this.validateCategoryData(data,photo);
    const exists = await this.commonService.existsByField("slug", data.slug);
    if (exists) {
      throw new Error("Category with this slug already exists");
    }
    // Map uploaded file details to the photo field before saving
    if (photo) {
      if (typeof photo === "object") {
        (data as any).photo = (photo as any).path || (photo as any).filename || String(((photo as any).originalname ?? ""));
      } else if (typeof photo === "string") {
        (data as any).photo = photo;
      }
    }
    return await categoryRepository.createCategory(data);
  }

  async getAllCategory(page = 1, limit = 10, filter?: string) {
    return await categoryRepository.getAllCategory(page, limit, filter);
  }

  async getCategoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await categoryRepository.getCategoryById(id);
  }

  async updateCategory(id: string | Types.ObjectId, data: Partial<ICategory>): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateCategoryData(data,  true);
    return await categoryRepository.updateCategory(id, data);
  }

  async softDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await categoryRepository.softDeleteCategory(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await categoryRepository.toggleStatus(id);
  }

  async getAllTrashCategorys(page = 1, limit = 10, filter?: string) {
    return await categoryRepository.getAllTrashCategorys(page, limit, filter);
  }

  async restoreCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await categoryRepository.restoreCategory(id);
  }

  async deleteCategoryPermanently(id: string | Types.ObjectId): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await categoryRepository.deleteCategoryPermanently(id);
  }
}

export default new CategoryService();
