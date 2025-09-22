import { CategoryModel,ICategory } from "../models/catrgoryModel";
import { Types } from "mongoose";
import { CommonRepository } from "./common.repository";

class CategoryRepository {
  private commonRepository: CommonRepository<ICategory>;

  constructor() {
    this.commonRepository = new CommonRepository(CategoryModel);
  }

  async createCategory(data: ICategory): Promise<ICategory> {
    return await CategoryModel.create(data);
  }

  async getAllCategory(page = 1, limit = 10, filter?: string) {
    const query: any = {};
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit; 
    const [data, stats] = await Promise.all([
      CategoryModel.find(query).skip(skip).limit(limit),
      this.commonRepository.getStats(),
    ]);
    console.log("data from db",data);
    

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

  async getCategoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findById(id);
  }

  async updateCategory(id: string | Types.ObjectId, data: Partial<ICategory>): Promise<ICategory | null> {
    console.log("id,data",id,data);
    
    return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<ICategory | null> {
    // Ensure id is a string for CommonRepository
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }

  async restoreCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndUpdate(
      id,
      { isDeleted: false, status: "active" },
      { new: true }
    );
  }

  async deleteCategoryPermanently(id: string | Types.ObjectId): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndDelete(id);
  }
  async getAllTrashCategorys(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      CategoryModel.find(query).skip(skip).limit(limit),
      CategoryModel.countDocuments(query),
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

export default new CategoryRepository();