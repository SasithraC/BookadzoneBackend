"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationController_1 = __importDefault(require("../controllers/authenticationController"));
const router = (0, express_1.Router)();
router.post("/login", (req, res, next) => authenticationController_1.default.authLogin(req, res, next));
router.get("/refresh", (req, res, next) => authenticationController_1.default.refreshToken(req, res, next));
exports.default = router;
