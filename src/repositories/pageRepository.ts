import { PageModel, IPage } from "../models/pageModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

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
    const [data, count, stats] = await Promise.all([
      PageModel.find(query).skip(skip).limit(limit).exec(),
      PageModel.countDocuments(query).exec(),
      this.commonRepository.getStats()
    ]);

    const totalPages = Math.ceil(count / limit) || 1;
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

  async getPageById(id: string | Types.ObjectId): Promise<IPage | undefined> {
    const result = await PageModel.findById(id).exec();
    return result || undefined;
  }

  async updatePage(id: string | Types.ObjectId, data: Partial<IPage>): Promise<IPage | undefined> {
    const result = await PageModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return result || undefined;
  }

  async softDeletePage(id: string | Types.ObjectId): Promise<IPage | undefined> {
    const result = await PageModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).exec();
    return result || undefined;
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IPage | undefined> {
    const stringId = typeof id === 'string' ? id : id.toString();
    const page = await this.getPageById(stringId);
    if (!page) return undefined;

    const newStatus = page.status === 'active' ? 'inactive' : 'active';
    const result = await PageModel.findByIdAndUpdate(
      stringId,
      { status: newStatus },
      { new: true }
    ).exec();
    return result || undefined;
  }

  async restorePage(id: string | Types.ObjectId): Promise<IPage | undefined> {
    const result = await PageModel.findByIdAndUpdate(
      id,
      { isDeleted: false, status: "active" },
      { new: true }
    ).exec();
    return result || undefined;
  }

  async deletePagePermanently(id: string | Types.ObjectId): Promise<IPage | undefined> {
    const result = await PageModel.findByIdAndDelete(id).exec();
    return result || undefined;
  }
  async getAllTrashPages(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      PageModel.find(query).skip(skip).limit(limit).exec(),
      PageModel.countDocuments(query).exec(),
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
