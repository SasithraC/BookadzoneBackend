"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve Swagger UI
const swaggerDocument = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Register routes with prefixes
(0, routes_1.default)(app);
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Centralized error handler
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(err);
    }
    res.status(err.status || 500).json({
        status: 'fail',
        message: err.message || 'Internal Server Error',
    });
});
exports.default = app;
