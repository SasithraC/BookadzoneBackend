import agencyRepository from "../repositories/agencyRepository";
import { IAgency } from "../models/agencyModel";
import { Types } from "mongoose";

class AgencyService {
  async createAgency(data: Partial<IAgency>): Promise<IAgency> {
    // Add validation as needed
    return await agencyRepository.createAgency(data);
  }

  async getAllAgencies(page = 1, limit = 10) {
    return await agencyRepository.getAllAgencies(page, limit);
  }

  async getAgencyById(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await agencyRepository.getAgencyById(id);
  }

  async updateAgency(id: string | Types.ObjectId, data: Partial<IAgency>): Promise<IAgency | null> {
    return await agencyRepository.updateAgency(id, data);
  }

  async deleteAgency(id: string | Types.ObjectId): Promise<IAgency | null> {
      return await agencyRepository.softDeleteAgency(id);
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
      return await agencyRepository.deleteAgencyPermanently(id);
    }
}

export default new AgencyService();
