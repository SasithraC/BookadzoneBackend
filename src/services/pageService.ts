import pagesRepository from "../repositories/pageRepository";
import { IPage } from "../models/pageModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { PageModel } from "../models/pageModel";
import { CommonService } from "./common.service";

class PagesService {
  private commonService = new CommonService<IPage>(PageModel);
  private validatePageData(data: Partial<IPage>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.title, "title")
        : (data.title !== undefined ? ValidationHelper.isNonEmptyString(data.title, "title") : null),

      (data.title !== undefined ? ValidationHelper.maxLength(data.title, "title", 200) : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 500) : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

      (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 200) : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.type, "type")
        : null,
      ValidationHelper.isValidEnum(data.type, "type", ["link", "template"]),

      (data.url !== undefined ? ValidationHelper.maxLength(data.url, "url", 500) : null),

      (data.description !== undefined ? ValidationHelper.maxLength(data.description, "description", 1000) : null),

      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),

      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }



  async createPage(data: IPage): Promise<IPage> {
    this.validatePageData(data);
    const exists = await this.commonService.existsByField("slug", data.slug);
    if (exists) {
      throw new Error("Page with this slug already exists");
    }
    return await pagesRepository.createPage(data);
  }

  async getAllPages(page = 1, limit = 10, filter?: string) {
    return await pagesRepository.getAllPages(page, limit, filter);
  }

  async getPageById(id: string | Types.ObjectId): Promise<IPage | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await pagesRepository.getPageById(id);
  }

  async updatePage(id: string | Types.ObjectId, data: Partial<IPage>): Promise<IPage | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validatePageData(data, true);
    return await pagesRepository.updatePage(id, data);
  }

  async softDeletePage(id: string | Types.ObjectId): Promise<IPage | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await pagesRepository.softDeletePage(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IPage | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await pagesRepository.toggleStatus(id);
  }
  async getAllTrashPages(page = 1, limit = 10, filter?: string) {
    return await pagesRepository.getAllTrashPages(page, limit, filter);
  }

    async restorePage(id: string | Types.ObjectId): Promise<IPage | null> {
      const error = ValidationHelper.isValidObjectId(id, "id");
      if (error) {
        throw new Error(error.message);
      }
      return await pagesRepository.restorePage(id);
    }

    async deletePagePermanently(id: string | Types.ObjectId): Promise<IPage | null> {
      const error = ValidationHelper.isValidObjectId(id, "id");
      if (error) {
        throw new Error(error.message);
      }
      return await pagesRepository.deletePagePermanently(id);
    }
}

export default new PagesService();
