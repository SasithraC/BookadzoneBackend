import { ConfigModel, IConfig } from "../models/configModel";
import { Types } from "mongoose";
import { CommonRepository } from "./common.repository";

class ConfigRepository {
  private commonRepository: CommonRepository<IConfig>;

  constructor() {
    this.commonRepository = new CommonRepository(ConfigModel);
  }

  async createConfig(data: IConfig): Promise<IConfig> {
    return await ConfigModel.create(data);
  }

  async getAllConfigs(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, stats] = await Promise.all([
      ConfigModel.find(query).skip(skip).limit(limit),
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

  async getConfigById(id: string | Types.ObjectId): Promise<IConfig | null> {
    return await ConfigModel.findById(id);
  }

  async updateConfig(id: string | Types.ObjectId, data: Partial<IConfig>): Promise<IConfig | null> {
    return await ConfigModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteConfig(id: string | Types.ObjectId): Promise<IConfig | null> {
    return await ConfigModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IConfig | null> {
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }

  async restoreConfig(id: string | Types.ObjectId): Promise<IConfig | null> {
    return await ConfigModel.findByIdAndUpdate(
      id,
      { isDeleted: false, status: "active" },
      { new: true }
    );
  }

  async deleteConfigPermanently(id: string | Types.ObjectId): Promise<IConfig | null> {
    return await ConfigModel.findByIdAndDelete(id);
  }

  async getAllTrashConfigs(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      ConfigModel.find(query).skip(skip).limit(limit),
      ConfigModel.countDocuments(query),
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

export default new ConfigRepository();