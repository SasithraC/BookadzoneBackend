import { NewsLetter, ILetter } from "../models/newsLettermodel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class NewsLetterRepository {
  private commonRepository: CommonRepository<ILetter>;

  constructor() {
    this.commonRepository = new CommonRepository(NewsLetter);
  }

  async createNewsLetter(data: ILetter): Promise<ILetter> {
    return await NewsLetter.create(data);
  }

  async getAllNewsLetters(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, stats] = await Promise.all([
      NewsLetter.find(query).skip(skip).limit(limit),
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

  async getNewsLetterById(id: string | Types.ObjectId): Promise<ILetter | null> {
    return await NewsLetter.findById(id);
  }

  async updateNewsLetter(id: string | Types.ObjectId, data: Partial<ILetter>): Promise<ILetter | null> {
    return await NewsLetter.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteNewsLetter(id: string | Types.ObjectId): Promise<ILetter | null> {
    return await NewsLetter.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<ILetter | null> {
    // Ensure id is a string for CommonRepository
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }

  async restoreNewsLetter(id: string | Types.ObjectId): Promise<ILetter | null> {
    return await NewsLetter.findByIdAndUpdate(
      id,
      { isDeleted: false, status: "active" },
      { new: true }
    );
  }

  async deleteNewsLetterPermanently(id: string | Types.ObjectId): Promise<ILetter | null> {
    return await NewsLetter.findByIdAndDelete(id);
  }
  async getAllTrashNewsLetters(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      NewsLetter.find(query).skip(skip).limit(limit),
      NewsLetter.countDocuments(query),
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

export default new NewsLetterRepository();