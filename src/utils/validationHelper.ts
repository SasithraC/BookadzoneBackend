// utils/validationHelper.ts
import { Types } from "mongoose";

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationHelper {
  // Check if a value is required (not null, undefined, or empty string)
  static isRequired(value: any, field: string): ValidationError | null {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return { field, message: `${field} is required` };
    }
    return null;
  }

  // Check if a value is a non-empty string
  static isNonEmptyString(value: any, field: string): ValidationError | null {
    if (typeof value !== "string" || value.trim() === "") {
      return { field, message: `${field} must be a non-empty string` };
    }
    return null;
  }

  // Check if a value is a boolean
  static isBoolean(value: any, field: string): ValidationError | null {
    if (value !== undefined && typeof value !== "boolean") {
      return { field, message: `${field} must be a boolean` };
    }
    return null;
  }

  // Check if a value is a valid MongoDB ObjectId
  static isValidObjectId(value: any, field: string): ValidationError | null {
    if (!Types.ObjectId.isValid(value)) {
      return { field, message: `${field} must be a valid ObjectId` };
    }
    return null;
  }

  // Check if a value is a valid email
  static isValidEmail(value: any, field: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== "string" || !emailRegex.test(value)) {
      return { field, message: `${field} must be a valid email address` };
    }
    return null;
  }

  // Check if a value meets minimum length
  static minLength(value: string, field: string, min: number): ValidationError | null {
    if (typeof value !== "string" || value.trim().length < min) {
      return { field, message: `${field} must be at least ${min} characters long` };
    }
    return null;
  }

  // Check if a value meets maximum length
  static maxLength(value: string, field: string, max: number): ValidationError | null {
    if (typeof value !== "string" || value.trim().length > max) {
      return { field, message: `${field} must not exceed ${max} characters` };
    }
    return null;
  }

  // Check if a value is one of the allowed enum values
  static isValidEnum(value: any, field: string, allowedValues: string[]): ValidationError | null {
    if (value !== undefined && !allowedValues.includes(value)) {
      return { field, message: `${field} must be one of: ${allowedValues.join(", ")}` };
    }
    return null;
  }

  // Validate multiple rules and collect errors
  static validate(rules: (ValidationError | null)[]): ValidationError[] {
    return rules.filter((error): error is ValidationError => error !== null);
  }
}

export default ValidationHelper;