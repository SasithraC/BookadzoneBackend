import { blogCategoryModel, IBlogCategory } from "../models/blogCategoryModel";
import { Types } from "mongoose";

class BlogCategoryRepository {
  async createCategory(data: IBlogCategory): Promise<IBlogCategory> {
    return await blogCategoryModel.create(data);
  }

  async getAllCategories(page = 1, limit = 10, filter?: string) {
    const query: any = {};
    if (filter === "active") query.status = "active";
    if (filter === "inactive") query.status = "inactive";

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      blogCategoryModel.find(query).skip(skip).limit(limit),
      blogCategoryModel.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
      data,
      meta: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  }

  async getCategoryById(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await blogCategoryModel.findById(id);
  }

  async updateCategory(id: string | Types.ObjectId, data: Partial<IBlogCategory>): Promise<IBlogCategory | null> {
    return await blogCategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await blogCategoryModel.findByIdAndDelete(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const category = await blogCategoryModel.findById(id);
    if (!category) return null;
    category.status = category.status === "active" ? "inactive" : "active";
    await category.save();
    return category;
  }
}

export default new BlogCategoryRepository();