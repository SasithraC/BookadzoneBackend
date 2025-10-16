import { ConfigModel, IConfig } from "../models/configModel";
import { PageModel } from "../models/pageModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

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
    const stringId = typeof id === "string" ? id : id.toString();
    const existingConfig = await ConfigModel.findById(stringId);
    if (!existingConfig) return null;

    if (existingConfig.slug === "pages" && data.configFields) {
      // Find removed fields: fields in existing but not in new data
      const existingValues = existingConfig.configFields.map(f => f.value);
      const newValues = data.configFields.map(f => f.value);
      const removedValues = existingValues.filter(val => !newValues.includes(val));

      if (removedValues.length > 0) {
        const inUse = await PageModel.find({ title: { $in: removedValues }, status: "active", isDeleted: false });
        if (inUse.length > 0) {
          throw new Error("Unable to remove field because it's already in use.");
        }
      }
    }

    return await ConfigModel.findByIdAndUpdate(stringId, data, { new: true });
  }

  async softDeleteConfig(id: string | Types.ObjectId): Promise<IConfig | null> {
    const stringId = typeof id === "string" ? id : id.toString();
    const config = await ConfigModel.findById(stringId);
    if (!config) return null;

    if (config.slug === "pages") {
      const fieldValues = config.configFields.map(f => f.value.trim().toLowerCase());
      const inUse = await PageModel.find({ title: { $in: fieldValues.map(f => new RegExp(`^${f.trim()}$`, "i")) }, status: "active", isDeleted: false });
      if (inUse.length > 0) {
        throw new Error("unable to delete because this  config is in use.");
      }
    }

    return await ConfigModel.findByIdAndUpdate(
      stringId,
      { isDeleted: true },
      { new: true }
    );
  }
   async toggleStatus(id: string | Types.ObjectId): Promise<IConfig | null> {
    const stringId = typeof id === "string" ? id : id.toString();
    const config = await ConfigModel.findById(stringId);
    if (!config) return null;

    if (config.slug === "pages") {
      const fieldValues = config.configFields.map(f => f.value);
      const inUse = await PageModel.find({ title: { $in: fieldValues }, status: "active", isDeleted: false });
      if (inUse.length > 0) {
        throw new Error("Unable to change status because this  config is in use.");
      }
    }

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

  async getAllPageConfig(): Promise<IConfig | null> {
    return await ConfigModel.findOne({ slug: "pages", isDeleted: false, status: "active" });
  }
}

export default new ConfigRepository();