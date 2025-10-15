// agencyService.ts
import agencyRepository from "../repositories/agencyRepository";
import { IAgency, ILeanAgency } from "../models/agencyModel";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError";
import { HTTP_STATUS_CODE } from "../utils/httpResponse";

class AgencyService {
  async createAgency(data: Partial<IAgency>): Promise<IAgency> {
    return await agencyRepository.createAgency(data);
  }

  async getAllAgencies(page = 1, limit = 10) {
    return await agencyRepository.getAllAgencies(page, limit);
  }

  async getAgencyById(id: string | Types.ObjectId): Promise<ILeanAgency | null> {
    return await agencyRepository.getAgencyById(id);
  }

  async updateAgency(id: string | Types.ObjectId, data: Partial<IAgency>): Promise<IAgency | null> {
    return await agencyRepository.updateAgency(id, data);
  }

  async deleteAgency(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await agencyRepository.softDeleteAgency(id);
  }

  async checkCompanyEmailExists(email: string, currentId?: string | null): Promise<boolean> {
    return await agencyRepository.checkCompanyEmailExists(email, currentId);
  }

  async restoreAgency(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await agencyRepository.restoreAgency(id);
  }

  async getAllTrashAgencies(page = 1, limit = 10) {
    return await agencyRepository.getAllTrashAgencies(page, limit);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await agencyRepository.toggleStatus(id);
  }

  async deleteAgencyPermanently(id: string | Types.ObjectId): Promise<IAgency | null> {
    const agency = await agencyRepository.getAgencyById(id);
    if (!agency || !agency.userId) {
      return await agencyRepository.deleteAgencyPermanently(id);
    }

    const authenticationService = (await import("../services/authenticationService")).default;
    await authenticationService.deleteUserPermanently(agency.userId);
    return await agencyRepository.deleteAgencyPermanently(id);
  }
}

export default new AgencyService();