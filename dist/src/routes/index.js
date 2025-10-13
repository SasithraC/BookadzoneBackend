"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerRoutes;
const authenticationRoutes_1 = __importDefault(require("./authenticationRoutes"));
const faqRoutes_1 = __importDefault(require("./faqRoutes"));
const footerInfoRoutes_1 = __importDefault(require("./footerInfoRoutes"));
const configRoutes_1 = __importDefault(require("./configRoutes"));
const settingsRoutes_1 = __importDefault(require("./settingsRoutes"));
const useroleRoutes_1 = __importDefault(require("./useroleRoutes"));
function registerRoutes(app) {
    app.use("/api/v1/auth", authenticationRoutes_1.default);
    app.use("/api/v1/faqs", faqRoutes_1.default);
    app.use("/api/v1/footerinfo", footerInfoRoutes_1.default);
    app.use("/api/v1/configs", configRoutes_1.default);
    app.use("/api/v1/settings", settingsRoutes_1.default);
    app.use("/api/v1/userrole", useroleRoutes_1.default);
}
