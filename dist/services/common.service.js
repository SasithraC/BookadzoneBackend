"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const common_repository_1 = require("../repositories/common.repository");
class CommonService {
    constructor(model) {
        this.repository = new common_repository_1.CommonRepository(model);
    }
    // Toggle status
    async toggleStatus(id) {
        return await this.repository.toggleStatus(id);
    }
    // Get stats
    async getStats() {
        return await this.repository.getStats();
    }
    // Check if a document exists by field value
    async existsByField(field, value) {
        return await this.repository.existsByField(field, value);
    }
}
exports.CommonService = CommonService;
