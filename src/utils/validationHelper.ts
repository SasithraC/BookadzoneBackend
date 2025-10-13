import { Types } from "mongoose";

interface ValidationResult {
  field: string;
  message: string;
}

class ValidationHelper {
  static isRequired(value: any, field: string): ValidationResult | null {
    if (value === undefined || value === null || value === "") {
      return { field, message: `${field} is required` };
    }
    return null;
  }

  static isNonEmptyString(value: string, field: string): ValidationResult | null {
    if (typeof value !== "string" || value.trim() === "") {
      return { field, message: `${field} must be a non-empty string` };
    }
    return null;
  }

  static maxLength(value: string, field: string, max: number): ValidationResult | null {
    if (typeof value === "string" && value.length > max) {
      return { field, message: `${field} must not exceed ${max} characters` };
    }
    return null;
  }

  static minLength(value: string, field: string, min: number): ValidationResult | null {
    if (typeof value === "string" && value.length < min) {
      return { field, message: `${field} must be at least ${min} characters` };
    }
    return null;
  }

  static isValidEnum(value: any, field: string, enums: string[]): ValidationResult | null {
    if (value !== undefined && !enums.includes(value)) {
      return { field, message: `${field} must be one of: ${enums.join(", ")}` };
    }
    return null;
  }

  static isBoolean(value: any, field: string): ValidationResult | null {
    if (value !== undefined && typeof value !== "boolean") {
      return { field, message: `${field} must be a boolean` };
    }
    return null;
  }

  static isValidObjectId(value: any, field: string): ValidationResult | null {
    if (!value || !/^[0-9a-fA-F]{24}$/.test(value)) {
      return { field, message: `Invalid ${field}` };
    }
    return null;
  }

  static isArray(value: any, field: string): ValidationResult | null {
    if (value !== undefined && !Array.isArray(value)) {
      return { field, message: `${field} must be an array` };
    }
    return null;
  }

  static isValidEmail(value: any, field: string): ValidationResult | null {
    if (value !== undefined && typeof value === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { field, message: `${field} must be a valid email address` };
      }
    }
    return null;
  }

  static isNumber(value: any, field: string): ValidationResult | null {
    if (typeof value !== "number" || isNaN(value)) {
      return { field, message: `${field} must be a numeric value` };
    }
    return null;
  }

  static isNonEmptyArray(value: any, field: string): ValidationResult | null {
    if (!Array.isArray(value) || value.length === 0) {
      return { field, message: `${field} must be a non-empty array` };
    }
    return null;
  }

  static isValidArrayOfStrings(value: any, field: string): ValidationResult | null {
    if (!Array.isArray(value) || !value.every(item => typeof item === "string" && item.trim() !== "")) {
      return { field, message: `${field} must be an array of non-empty strings` };
    }
    return null;
  }

  static validate(rules: (ValidationResult | null)[]): ValidationResult[] {
    return rules.filter((rule): rule is ValidationResult => rule !== null);
  }
}

export default ValidationHelper;