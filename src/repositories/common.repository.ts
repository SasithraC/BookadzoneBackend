import mongoose, { Model, Document } from "mongoose";

export class CommonRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Check if a document exists by field value
  async existsByField(field: string, value: any): Promise<boolean> {
    const query: any = {};
    query[field] = value;
    query.isDeleted = false;
    const count = await this.model.countDocuments(query);
    return count > 0;
  }

  // Toggle status by ID
  async toggleStatus(id: string): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const doc = await this.model.findById(id);
    if (!doc) return null;

    const currentStatus = doc.get("status");
    doc.set("status", currentStatus === "active" ? "inactive" : "active");
    return await doc.save();
  }

  // Get stats (total, active, inactive)
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const [total, active, inactive] = await Promise.all([
      this.model.countDocuments({ isDeleted: false }),
      this.model.countDocuments({ status: "active", isDeleted: false }),
      this.model.countDocuments({ status: "inactive", isDeleted: false }),
    ]);

    // Validate stats consistency
    if (total !== active + inactive) {
      console.warn('Statistics mismatch: total !== active + inactive');
    }

    return { total, active, inactive };
  }
}