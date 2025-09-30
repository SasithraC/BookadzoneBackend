import { AgencyModel, IAgency } from "../models/agencyModel";
import { Types } from "mongoose";

class AgencyRepository {
  async createAgency(data: Partial<IAgency>): Promise<IAgency> {
    return await AgencyModel.create(data);
  }

  async getAllAgencies(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const agencies = await AgencyModel.find({ isDeleted: false }).skip(skip).limit(limit);
    const total = await AgencyModel.countDocuments({ isDeleted: false });
    return { agencies, total, page, limit };
  }

  async getAgencyById(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await AgencyModel.findById(id);
  }

  async updateAgency(id: string | Types.ObjectId, data: Partial<IAgency>): Promise<IAgency | null> {
    return await AgencyModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteAgency(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await AgencyModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async restoreAgency(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await AgencyModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
  }

  async getAllTrashAgencies(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const agencies = await AgencyModel.find({ isDeleted: true }).skip(skip).limit(limit);
    const total = await AgencyModel.countDocuments({ isDeleted: true });
    return { agencies, total, page, limit };
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IAgency | null> {
    const agency = await AgencyModel.findById(id);
    if (!agency) return null;
    const newStatus = agency.status === "active" ? "inactive" : "active";
    return await AgencyModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
  }

  async deleteAgencyPermanently(id: string | Types.ObjectId): Promise<IAgency | null> {
    return await AgencyModel.findByIdAndDelete(id);
  }
}

export default new AgencyRepository();
