import { FooterInfoModel, IFooterInfo } from "../models/footerinfoModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class FooterInfoRepository {
  private commonRepository: CommonRepository<IFooterInfo>;

  constructor() {
    this.commonRepository = new CommonRepository(FooterInfoModel);
  }

  async createFooterInfo(data: Partial<IFooterInfo>): Promise<IFooterInfo> {
    return await FooterInfoModel.create(data);
  }

  async getFooterInfo(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };
    if (filter === "active") query.status = "active";
    if (filter === "inactive") query.status = "inactive";
    const skip = (page - 1) * limit;
    const [data, stats] = await Promise.all([
      FooterInfoModel.find(query).skip(skip).limit(limit),
      this.commonRepository.getStats(),
    ]);
    const totalPages = Math.ceil(stats.total / limit) || 1;
    return {
      data,
      meta: {
        ...stats,
        totalPages,
        page,
        limit,
      },
    };
  }

  async getFooterInfoById(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    return await FooterInfoModel.findById(id);
  }

  async updateFooterInfo(id: string | Types.ObjectId, data: Partial<IFooterInfo>): Promise<IFooterInfo | null> {
    return await FooterInfoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteFooterInfo(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    return await FooterInfoModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }

  async restoreFooterInfo(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    return await FooterInfoModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
  }

  async deleteFooterInfoPermanently(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    return await FooterInfoModel.findByIdAndDelete(id);
  }

  async getAllTrashFooterInfos(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === "active") query.status = "active";
    if (filter === "inactive") query.status = "inactive";
    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      FooterInfoModel.find(query).skip(skip).limit(limit),
      FooterInfoModel.countDocuments(query),
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
        limit,
      },
    };
  }
}

export default new FooterInfoRepository();
