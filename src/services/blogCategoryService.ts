import blogCategoryRepository from "../repositories/blogCategoryRepository";
import { IBlogCategory } from "../models/blogCategoryModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { BlogCategoryModel } from "../models/blogCategoryModel";
import { CommonService } from "./common.service";

class BlogCategoryService {
  private commonService = new CommonService<IBlogCategory>(BlogCategoryModel);

  private validateBlogCategoryData(data: Partial<IBlogCategory>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 500) : null),

      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

      (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 100) : null),

      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),

      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules.flat().filter(Boolean) as any);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createBlogCategory(data: IBlogCategory): Promise<IBlogCategory> {
    this.validateBlogCategoryData(data);

    // Check duplicate slug
    const exists = await this.commonService.existsByField("slug", data.slug);
    if (exists) {
      throw new Error("BlogCategory with this slug already exists");
    }

    return await blogCategoryRepository.createBlogCategory(data);
  }

  async getAllBlogCategories(page = 1, limit = 10, filter?: string) {
    return await blogCategoryRepository.getAllBlogCategories(page, limit, filter);
  }

  async getBlogCategoryById(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.getBlogCategoryById(id);
  }

  async updateBlogCategory(id: string | Types.ObjectId, data: Partial<IBlogCategory>): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateBlogCategoryData(data, true);

    // Check if slug is updated and ensure uniqueness
    if (data.slug) {
      const currentCategory = await blogCategoryRepository.getBlogCategoryById(id);
      if (currentCategory && currentCategory.slug !== data.slug) {
        const exists = await this.commonService.existsByField("slug", data.slug);
        if (exists) {
          throw new Error("BlogCategory with this slug already exists");
        }
      }
    }

    return await blogCategoryRepository.updateBlogCategory(id, data);
  }

  async softDeleteBlogCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.softDeleteBlogCategory(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.toggleStatus(id);
  }

  async getAllTrashBlogCategories(page = 1, limit = 10, filter?: string) {
    return await blogCategoryRepository.getAllTrashBlogCategories(page, limit, filter);
  }

  async restoreBlogCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.restoreBlogCategory(id);
  }

  async deleteBlogCategoryPermanently(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await blogCategoryRepository.deleteBlogCategoryPermanently(id);
  }
}

export default new BlogCategoryService();
