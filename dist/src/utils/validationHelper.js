"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationHelper = void 0;
// utils/validationHelper.ts
const mongoose_1 = require("mongoose");
class ValidationHelper {
    // Check if a value is required (not null, undefined, or empty string)
    static isRequired(value, field) {
        if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
            return { field, message: `${field} is required` };
        }
        return null;
    }
    static isNumber(value, field) {
        if (typeof value !== "number" || isNaN(value)) {
            return { field, message: `${field} must be a numeric value` };
        }
        return null;
    }
    // Check if a value is a non-empty string
    static isNonEmptyString(value, field) {
        if (typeof value !== "string" || value.trim() === "") {
            return { field, message: `${field} must be a non-empty string` };
        }
        return null;
    }
    // Check if a value is a boolean
    static isBoolean(value, field) {
        if (value !== undefined && typeof value !== "boolean") {
            return { field, message: `${field} must be a boolean` };
        }
        return null;
    }
    // Check if a value is a valid MongoDB ObjectId
    static isValidObjectId(value, field) {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            return { field, message: `${field} must be a valid ObjectId` };
        }
        return null;
    }
    // Check if a value is a valid email
    static isValidEmail(value, field) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value !== "string" || !emailRegex.test(value)) {
            return { field, message: `${field} must be a valid email address` };
        }
        return null;
    }
    // Check if a value meets minimum length
    static minLength(value, field, min) {
        if (typeof value !== "string" || value.trim().length < min) {
            return { field, message: `${field} must be at least ${min} characters long` };
        }
        return null;
    }
    // Check if a value meets maximum length
    static maxLength(value, field, max) {
        if (typeof value !== "string" || value.trim().length > max) {
            return { field, message: `${field} must not exceed ${max} characters` };
        }
        return null;
    }
    // Check if a value is one of the allowed enum values
    static isValidEnum(value, field, allowedValues) {
        if (value !== undefined && !allowedValues.includes(value)) {
            return { field, message: `${field} must be one of: ${allowedValues.join(", ")}` };
        }
        return null;
    }
    // Validate multiple rules and collect errors
    static validate(rules) {
        return rules.filter((error) => error !== null);
    }
}
exports.ValidationHelper = ValidationHelper;
exports.default = ValidationHelper;
