"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationHelper {
    static isRequired(value, field) {
        if (value === undefined || value === null || value === "") {
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
    static isNonEmptyString(value, field) {
        if (typeof value !== "string" || value.trim() === "") {
            return { field, message: `${field} must be a non-empty string` };
        }
        return null;
    }
    static maxLength(value, field, max) {
        if (typeof value === "string" && value.length > max) {
            return { field, message: `${field} must not exceed ${max} characters` };
        }
        return null;
    }
    static minLength(value, field, min) {
        if (typeof value === "string" && value.length < min) {
            return { field, message: `${field} must be at least ${min} characters` };
        }
        return null;
    }
    static isValidEnum(value, field, enums) {
        if (value !== undefined && !enums.includes(value)) {
            return { field, message: `${field} must be one of: ${enums.join(", ")}` };
        }
        return null;
    }
    static isBoolean(value, field) {
        if (value !== undefined && typeof value !== "boolean") {
            return { field, message: `${field} must be a boolean` };
        }
        return null;
    }
    static isValidObjectId(value, field) {
        if (!value || !/^[0-9a-fA-F]{24}$/.test(value)) {
            return { field, message: `Invalid ${field}` };
        }
        return null;
    }
    static isArray(value, field) {
        if (value !== undefined && !Array.isArray(value)) {
            return { field, message: `${field} must be an array` };
        }
        return null;
    }
    static isValidEmail(value, field) {
        if (value !== undefined && typeof value === "string") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return { field, message: `${field} must be a valid email address` };
            }
        }
        return null;
    }
    static validate(rules) {
        return rules.filter((rule) => rule !== null);
    }
}
exports.default = ValidationHelper;
