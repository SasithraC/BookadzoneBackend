import blogCategoryRepository from "../repositories/blogCategoryRepository";
import { IBlogCategory } from "../models/blogCategoryModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { blogCategoryModel } from "../models/blogCategoryModel";
import { CommonService } from "./common.service";

class BlogCategoryService {
  private commonService = new CommonService<IBlogCategory>(blogCategoryModel);

  private validateCategoryData(data: Partial<IBlogCategory>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 100) : null),

      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createCategory(data: IBlogCategory): Promise<IBlogCategory> {
    this.validateCategoryData(data);
    const exists = await this.commonService.existsByField("name", data.name);
    if (exists) {
      throw new Error("Category with this name already exists");
    }
    return await blogCategoryRepository.createCategory(data);
  }

  async getAllCategories(page = 1, limit = 10, filter?: string) {
    return await blogCategoryRepository.getAllCategories(page, limit, filter);
  }

  async getCategoryById(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.getCategoryById(id);
  }

  async updateCategory(id: string | Types.ObjectId, data: Partial<IBlogCategory>): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateCategoryData(data, true);
    return await blogCategoryRepository.updateCategory(id, data);
  }

  async deleteCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.deleteCategory(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.toggleStatus(id);
  }
}

export default new BlogCategoryService();