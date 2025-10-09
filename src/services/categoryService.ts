import categoryRepository from "../repositories/categoryRepository";
import { ICategory } from "../models/categoryModel";
import { Types } from "mongoose";

class CategoryService {
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    //  Check if name already exists
    const existing = await categoryRepository.findByName(data.name as string);
    if (existing) {
      throw new Error("Category name already exists");
    }

    return await categoryRepository.createCategory(data);
  }

  async getCategory(page = 1, limit = 10) {
    return await categoryRepository.getCategory(page, limit);
  }

  async getCategoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await categoryRepository.getCategoryById(id);
  }

  async updateCategory(id: string | Types.ObjectId, data: Partial<ICategory>): Promise<ICategory | null> {
    return await categoryRepository.updateCategory(id, data);
  }

  async softDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
      return await categoryRepository.softDeleteCategory(id);
  }

    async restoreCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
      return await categoryRepository.restoreCategory(id);
    }

    async getAllTrashCategorys(page = 1, limit = 10) {
      return await categoryRepository.getAllTrashCategorys(page, limit);
    }

    async toggleStatus(id: string | Types.ObjectId): Promise<ICategory | null> {
      return await categoryRepository.toggleStatus(id);
    }

    async deleteCategoryPermanently(id: string | Types.ObjectId): Promise<ICategory | null> {
      return await categoryRepository.deleteCategoryPermanently(id);
    }
}

export default new CategoryService();
