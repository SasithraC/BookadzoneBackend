import { BlogCategoryModel as BlogCategoryModel, IBlogCategory } from "../models/blogCategoryModel";
import { Types } from "mongoose";
import { CommonRepository } from "./common.repository";

class BlogCategoryRepository {
  private commonRepository: CommonRepository<IBlogCategory>;

  constructor() {
    this.commonRepository = new CommonRepository(BlogCategoryModel);
  }

  async createBlogCategory(data: IBlogCategory): Promise<IBlogCategory> {
    return await BlogCategoryModel.create(data);
  }

  async getAllBlogCategories(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, stats] = await Promise.all([
      BlogCategoryModel.find(query).skip(skip).limit(limit),
      this.commonRepository.getStats(),
    ]);

    const totalPages = Math.ceil(stats.total / limit) || 1;
    return {
      data,
      meta: {
        ...stats,
        totalPages,
        page,
        limit
      }
    };
  }

  async getBlogCategoryById(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findById(id);
  }

  async updateBlogCategory(id: string | Types.ObjectId, data: Partial<IBlogCategory>): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteBlogCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    // Ensure id is a string for CommonRepository
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }

  async restoreBlogCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findByIdAndUpdate(
      id,
      { isDeleted: false, status: "active" },
      { new: true }
    );
  }

  async deleteBlogCategoryPermanently(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findByIdAndDelete(id);
  }
  async getAllTrashBlogCategories(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      BlogCategoryModel.find(query).skip(skip).limit(limit),
      BlogCategoryModel.countDocuments(query),
      this.commonRepository.getStats(),
    ]);

    const totalPages = Math.max(1, Math.ceil(count / limit));
    return {
      data,
      meta: {
        ...stats,
        total: count,
        totalPages,
        page,
        limit
      }
    };
  }
}

export default new BlogCategoryRepository();