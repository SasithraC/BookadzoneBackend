// agencyRepository.ts
import AgencyModel, { IAgency, ILeanAgency } from "../models/agencyModel";
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

  async getAgencyById(id: string | Types.ObjectId): Promise<ILeanAgency | null> {
    const result = await AgencyModel.aggregate<ILeanAgency>([
      { 
        $match: { 
          _id: typeof id === 'string' ? new Types.ObjectId(id) : id,
          isDeleted: false 
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          yourEmail: '$user.email',
          userId: '$user._id',
        },
      },
      {
        $project: {
          user: 0,
        },
      },
    ]);
    return result[0] || null;
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

  async findOne(query: any) {
    return await AgencyModel.findOne(query);
  }

  async checkCompanyEmailExists(email: string, currentId?: string | null): Promise<boolean> {
    const query: any = { 
      companyEmail: email, 
      isDeleted: false 
    };
    if (currentId) {
      query._id = { $ne: new Types.ObjectId(currentId) };
    }
    return !!(await this.findOne(query));
  }
}

export default new AgencyRepository();