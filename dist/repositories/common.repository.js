"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class CommonRepository {
    constructor(model) {
        this.model = model;
    }
    // Check if a document exists by field value
    async existsByField(field, value) {
        const query = {};
        query[field] = value;
        query.isDeleted = false;
        const count = await this.model.countDocuments(query);
        return count > 0;
    }
    // Toggle status by ID
    async toggleStatus(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return null;
        const doc = await this.model.findById(id);
        if (!doc)
            return null;
        const currentStatus = doc.get("status");
        doc.set("status", currentStatus === "active" ? "inactive" : "active");
        return await doc.save();
    }
    // Get stats (total, active, inactive)
    async getStats() {
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
exports.CommonRepository = CommonRepository;
