import { CategoryModel,ICategory } from "../models/categoryModel";
import { Types } from "mongoose";

class CategoryRepository {
   async findByName(name: string): Promise<ICategory | null> {
    return CategoryModel.findOne({ name }).exec();
  }
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    return CategoryModel.create(data);
  }

  async getCategory(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({ isDeleted: false }).skip(skip).limit(limit);
    const total = await CategoryModel.countDocuments({ isDeleted: false });
    return { categories, total, page, limit };
  }

  async getCategoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findById(id);
  }

  async updateCategory(id: string | Types.ObjectId, data: Partial<ICategory>): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async restoreCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
  }

  async getAllTrashCategorys(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({ isDeleted: true }).skip(skip).limit(limit);
    const total = await CategoryModel.countDocuments({ isDeleted: true });
    return { categories, total, page, limit };
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<ICategory | null> {
    const category = await CategoryModel.findById(id);
    if (!category) return null;
    const newStatus = category.status === "active" ? "inactive" : "active";
    return await CategoryModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
  }

  async deleteCategoryPermanently(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndDelete(id);
  }
}

export default new CategoryRepository();

