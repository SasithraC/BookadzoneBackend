import footerInfoRepository from "../repositories/footerInfoRepository";
import { IFooterInfo } from "../models/footerinfoModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { FooterInfoModel } from "../models/footerinfoModel";
import { CommonService } from "./common.service";

class FooterInfoService {
  private commonService = new CommonService<IFooterInfo>(FooterInfoModel);

  private validateFooterInfoData(data: Partial<IFooterInfo>, file?: Express.Multer.File, isUpdate: boolean = false): void {

    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(file, "logo") // Check if file object exists for creation
        : (file ? ValidationHelper.isNonEmptyString(file.filename, "logo") : null),
      (file ? ValidationHelper.maxLength(file.filename, "logo", 500) : null),

      !isUpdate
        ? ValidationHelper.isRequired(data.description, "description")
        : (data.description !== undefined ? ValidationHelper.isNonEmptyString(data.description, "description") : null),
      (data.description !== undefined ? ValidationHelper.maxLength(data.description, "description", 2000) : null),

      // Optional fields
      (data.socialmedia !== undefined ? ValidationHelper.maxLength(data.socialmedia, "socialmedia", 200) : null),
      (data.socialmedialinks !== undefined ? ValidationHelper.maxLength(data.socialmedialinks, "socialmedialinks", 200) : null),
      (data.google !== undefined ? ValidationHelper.maxLength(data.google, "google", 200) : null),
      (data.appstore !== undefined ? ValidationHelper.maxLength(data.appstore, "appstore", 200) : null),

      data.status !== undefined ? ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]) : null,
      (typeof data.priority === 'number' ? ValidationHelper.isNumber(data.priority, "priority") : null),

      data.isDeleted !== undefined ? ValidationHelper.isBoolean(data.isDeleted, "isDeleted") : null,
    ].filter(Boolean);

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createFooterInfo(data: Partial<IFooterInfo>, file?: Express.Multer.File): Promise<IFooterInfo> {
    if (!file) {
      throw new Error("Logo file is required for creation");
    }

    const createData: Partial<IFooterInfo> = { ...data, logo: file.filename };
    this.validateFooterInfoData(createData, file);

    const footerInfoData: Partial<IFooterInfo> = {
      logo: file.filename,
      description: createData.description!,
      socialmedia: createData.socialmedia ?? "",
      socialmedialinks: createData.socialmedialinks ?? "",
      google: createData.google ?? "",
      appstore: createData.appstore ?? "",
      status: createData.status || 'active',
      priority: createData.priority ? parseInt(createData.priority as any) : 1,
      isDeleted: false,
    };

    const exists = await this.commonService.existsByField("logo", footerInfoData.logo);
    if (exists) {
      throw new Error("Footer Info with this logo already exists");
    }
    const result = await footerInfoRepository.createFooterInfo(footerInfoData);
    return result;
  }

  async getFooterInfo(page = 1, limit = 10, filter?: string) {
    return await footerInfoRepository.getFooterInfo(page, limit, filter);
  }

  async getFooterInfoById(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await footerInfoRepository.getFooterInfoById(id);
  }

  async updateFooterInfo(id: string | Types.ObjectId, data: Partial<IFooterInfo>, file?: Express.Multer.File): Promise<IFooterInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    this.validateFooterInfoData(data, file, true);
    const updateData: Partial<IFooterInfo> = { ...data };
    if (file?.filename) {
      updateData.logo = file.filename;
    }
    const result = await footerInfoRepository.updateFooterInfo(id, updateData);
    return result;
  }

  async softDeleteFooterInfo(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await footerInfoRepository.softDeleteFooterInfo(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await footerInfoRepository.toggleStatus(id);
  }

  async getAllTrashFooterInfos(page = 1, limit = 10, filter?: string) {
    return await footerInfoRepository.getAllTrashFooterInfos(page, limit, filter);
  }

  async restoreFooterInfo(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await footerInfoRepository.restoreFooterInfo(id);
  }

  async deleteFooterInfoPermanently(id: string | Types.ObjectId): Promise<IFooterInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await footerInfoRepository.deleteFooterInfoPermanently(id);
  }
}

export default new FooterInfoService();