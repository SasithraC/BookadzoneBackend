import configRepository from "../repositories/configRepository";
import { IConfig } from "../models/configModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { ConfigModel } from "../models/configModel";
import { CommonService } from "./common.service";

class ConfigService {
  private commonService = new CommonService<IConfig>(ConfigModel);

  private validateConfigData(data: Partial<IConfig>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 100) : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

      (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 100) : null),
      (data.configFields !== undefined ? ValidationHelper.isArray(data.configFields, "configFields") : null),
      data.configFields && data.configFields.length > 0 ? 
        data.configFields.map((field, index) => [
          ValidationHelper.isRequired(field.key, `configFields[${index}].key`),
          ValidationHelper.isRequired(field.value, `configFields[${index}].value`),
          ValidationHelper.maxLength(field.key, `configFields[${index}].key`, 50),
          ValidationHelper.maxLength(field.value, `configFields[${index}].value`, 500),
        ]).flat() : null,

      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),

      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules.flat().filter(Boolean) as any);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createConfig(data: IConfig): Promise<IConfig> {
    this.validateConfigData(data);
    const exists = await this.commonService.existsByField("slug", data.slug);
    if (exists) {
      throw new Error("Config with this slug already exists");
    }
    return await configRepository.createConfig(data);
  }

  async getAllConfigs(page = 1, limit = 10, filter?: string) {
    return await configRepository.getAllConfigs(page, limit, filter);
  }

  async getConfigById(id: string | Types.ObjectId): Promise<IConfig | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await configRepository.getConfigById(id);
  }

  async updateConfig(id: string | Types.ObjectId, data: Partial<IConfig>): Promise<IConfig | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateConfigData(data, true);

    // Check if slug changed and exists
    if (data.slug) {
      const currentConfig = await configRepository.getConfigById(id);
      if (currentConfig && currentConfig.slug !== data.slug) {
        const exists = await this.commonService.existsByField("slug", data.slug);
        if (exists) {
          throw new Error("Config with this slug already exists");
        }
      }
    }

    return await configRepository.updateConfig(id, data);
  }

  async softDeleteConfig(id: string | Types.ObjectId): Promise<IConfig | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await configRepository.softDeleteConfig(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IConfig | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await configRepository.toggleStatus(id);
  }

  async getAllTrashConfigs(page = 1, limit = 10, filter?: string) {
    return await configRepository.getAllTrashConfigs(page, limit, filter);
  }

  async restoreConfig(id: string | Types.ObjectId): Promise<IConfig | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await configRepository.restoreConfig(id);
  }

  async deleteConfigPermanently(id: string | Types.ObjectId): Promise<IConfig | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await configRepository.deleteConfigPermanently(id);
  }
}

export default new ConfigService();