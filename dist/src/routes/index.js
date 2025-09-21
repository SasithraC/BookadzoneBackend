"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerRoutes;
const authenticationRoutes_1 = __importDefault(require("./authenticationRoutes"));
const faqRoutes_1 = __importDefault(require("./faqRoutes"));
const footerInfo_1 = __importDefault(require("./footerInfo"));
const configRoutes_1 = __importDefault(require("./configRoutes"));
const authentication_1 = require("../middleware/authentication");
function registerRoutes(app) {
    app.use("/api/v1/auth", authenticationRoutes_1.default);
    app.use("/api/v1/faqs", authentication_1.authenticate, faqRoutes_1.default);
    app.use("/api/v1/footerinfo", authentication_1.authenticate, footerInfo_1.default);
    app.use("/api/v1/configs", authentication_1.authenticate, configRoutes_1.default);
}
