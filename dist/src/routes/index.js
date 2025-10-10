"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerRoutes;
// Routes >
const authenticationRoutes_1 = __importDefault(require("./authenticationRoutes"));
const faqRoutes_1 = __importDefault(require("./faqRoutes"));
const blogCategoryRoutes_1 = __importDefault(require("./blogCategoryRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const newLetterRoutes_1 = __importDefault(require("./newLetterRoutes"));
const pagesRoutes_1 = __importDefault(require("./pagesRoutes"));
const footerInfoRoutes_1 = __importDefault(require("./footerInfoRoutes"));
const configRoutes_1 = __importDefault(require("./configRoutes"));
const settingsRoutes_1 = __importDefault(require("./settingsRoutes"));
const authentication_1 = require("../middleware/authentication");
const bannerRoutes_1 = __importDefault(require("./bannerRoutes"));
const uploadEditorImages_1 = __importDefault(require("./uploadEditorImages"));
const agencyRoutes_1 = __importDefault(require("./agencyRoutes"));
function registerRoutes(app) {
    app.use("/api/v1/auth", authenticationRoutes_1.default);
    app.use("/api/v1/faqs", authentication_1.authenticate, faqRoutes_1.default);
    app.use("/api/v1/blogcategory", authentication_1.authenticate, blogCategoryRoutes_1.default);
    app.use("/api/v1/category", authentication_1.authenticate, categoryRoutes_1.default); // Protected: requires authentication
    app.use("/api/v1/newsletters", authentication_1.authenticate, newLetterRoutes_1.default);
    app.use("/api/v1/pages", authentication_1.authenticate, pagesRoutes_1.default);
    app.use("/api/v1/footerinfo", authentication_1.authenticate, footerInfoRoutes_1.default);
    app.use("/api/v1/configs", authentication_1.authenticate, configRoutes_1.default);
    app.use("/api/v1/settings", authentication_1.authenticate, settingsRoutes_1.default);
    app.use("/api/v1/banners", authentication_1.authenticate, bannerRoutes_1.default);
    app.use("/api/v1/editer/image", authentication_1.authenticate, uploadEditorImages_1.default);
    app.use("/api/v1/agencies", authentication_1.authenticate, agencyRoutes_1.default);
}
