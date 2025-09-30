import { PageModel, IPage } from "../models/pageModel";
import { Types } from "mongoose";
import { CommonRepository } from "./common.repository";

class PagesRepository {
  private commonRepository: CommonRepository<IPage>;

  constructor() {
    this.commonRepository = new CommonRepository(PageModel);
  }

  async createPage(data: IPage): Promise<IPage> {
    return await PageModel.create(data);
  }

  async getAllPages(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, stats] = await Promise.all([
      PageModel.find(query).skip(skip).limit(limit),
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

  async getPageById(id: string | Types.ObjectId): Promise<IPage | null> {
    return await PageModel.findById(id);
  }

  async updatePage(id: string | Types.ObjectId, data: Partial<IPage>): Promise<IPage | null> {
    return await PageModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeletePage(id: string | Types.ObjectId): Promise<IPage | null> {
    return await PageModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IPage | null> {
    // Ensure id is a string for CommonRepository
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }

  async restorePage(id: string | Types.ObjectId): Promise<IPage | null> {
    return await PageModel.findByIdAndUpdate(
      id,
      { isDeleted: false, status: "active" },
      { new: true }
    );
  }

  async deletePagePermanently(id: string | Types.ObjectId): Promise<IPage | null> {
    return await PageModel.findByIdAndDelete(id);
  }
  async getAllTrashPages(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      PageModel.find(query).skip(skip).limit(limit),
      PageModel.countDocuments(query),
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

export default new PagesRepository();
