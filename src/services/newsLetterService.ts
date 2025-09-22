import newsLetterRepository from "../repositories/newsLetterRepository";
import { ILetter } from "../models/newsLettermodel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import {NewsLetter} from "../models/newsLettermodel";
import { CommonService } from "./common.service";

class NewsLetterService {
  private commonService = new CommonService<ILetter>(NewsLetter);
  private validateNewsLetterData(data: Partial<ILetter>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 500) : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

      (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 2000) : null),
      (data.template !== undefined ? ValidationHelper.maxLength(data.template, "template", 2000) : null),

      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),

      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }
  async createNewsLetter(data:ILetter): Promise<ILetter> {
    this.validateNewsLetterData(data);
    const exists = await this.commonService.existsByField("name", data.name);
    if (exists) {
      throw new Error("NewsLetter with this question already exists");
    }
    return await newsLetterRepository.createNewsLetter(data);
  }

  async getAllNewsLetters(page = 1, limit = 10, filter?: string) {
    return await newsLetterRepository.getAllNewsLetters(page, limit, filter);
  }

  async getNewsLetterById(id: string | Types.ObjectId): Promise<ILetter | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await newsLetterRepository.getNewsLetterById(id);
  }

  async updateNewsLetter(id: string | Types.ObjectId, data: Partial<ILetter>): Promise<ILetter | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateNewsLetterData(data, true);
    return await newsLetterRepository.updateNewsLetter(id, data);
  }

  async softDeleteNewsLetter(id: string | Types.ObjectId): Promise<ILetter | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await newsLetterRepository.softDeleteNewsLetter(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<ILetter | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await newsLetterRepository.toggleStatus(id);
  }
  async getAllTrashNewsLetters(page = 1, limit = 10, filter?: string) {
    return await newsLetterRepository.getAllTrashNewsLetters(page, limit, filter);
  }

    async restoreNewsLetter(id: string | Types.ObjectId): Promise<ILetter | null> {
      const error = ValidationHelper.isValidObjectId(id, "id");
      if (error) {
        throw new Error(error.message);
      }
      return await newsLetterRepository.restoreNewsLetter(id);
    }

    async deleteNewsLetterPermanently(id: string | Types.ObjectId): Promise<ILetter | null> {
      const error = ValidationHelper.isValidObjectId(id, "id");
      if (error) {
        throw new Error(error.message);
      }
      return await newsLetterRepository.deleteNewsLetterPermanently(id);
    }
}

export default new NewsLetterService();