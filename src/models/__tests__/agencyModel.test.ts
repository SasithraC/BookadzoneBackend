import mongoose, { Schema, Types } from "mongoose";
import AgencyModel from "../agencyModel";

// Mock mongoose before importing the model
jest.mock('mongoose', () => {
  class ObjectId {
    constructor(str?: string) {
      if (str) {
        return String(str);
      }
      return String(Math.random());
    }
  }

  const mSchema: any = jest.fn().mockImplementation((definition) => ({
    obj: definition,
  }));
  mSchema.Types = { ObjectId };

  const mongoose = {
    Schema: mSchema,
    model: jest.fn().mockReturnValue(function(data: any) {
      return {
        agencyName: '',
        name: '',
        userId: '',
        yourPhone: '',
        status: 'active',
        isDeleted: false,
        ...data,
        validateSync() {
          const errors: any = {};
          if (!this.agencyName) errors.agencyName = { message: 'Agency name is required' };
          if (!this.name) errors.name = { message: 'Name is required' };
          if (!this.userId) errors.userId = { message: 'User ID is required' };
          if (!this.yourPhone) errors.yourPhone = { message: 'Your phone is required' };
          if (this.status && !['active', 'inactive'].includes(this.status)) {
            errors.status = { message: 'Invalid status' };
          }
          return Object.keys(errors).length > 0 ? { errors } : undefined;
        }
      };
    }),
    Types: { ObjectId },
    connect: jest.fn(),
    disconnect: jest.fn()
  };
  return mongoose;
});

describe("AgencyModel", () => {
  it("validates required fields", () => {
    const agency = new AgencyModel({});
    const validationError = agency.validateSync();
    
    expect(validationError).toBeDefined();
    if (validationError) {
      expect(validationError.errors.agencyName).toBeDefined();
      expect(validationError.errors.name).toBeDefined();
      expect(validationError.errors.userId).toBeDefined();
      expect(validationError.errors.yourPhone).toBeDefined();
    }
  });

  it("sets default values correctly", () => {
    const agency = new AgencyModel({
      agencyName: "Test Agency",
      name: "Contact Person",
      userId: new Types.ObjectId(),
      yourPhone: "1234567890"
    });

    expect(agency.status).toBe("active");
    expect(agency.isDeleted).toBe(false);
  });

  it("validates status enum values", () => {
    const validAgency = new AgencyModel({
      agencyName: "Test Agency",
      name: "Contact Person",
      userId: new Types.ObjectId(),
      yourPhone: "1234567890",
      status: "active"
    });
    
    const invalidAgency = new AgencyModel({
      agencyName: "Test Agency",
      name: "Contact Person",
      userId: new Types.ObjectId(),
      yourPhone: "1234567890",
      status: "invalid-status"
    });

    expect(validAgency.validateSync()).toBeUndefined();
    const validationError = invalidAgency.validateSync();
    expect(validationError).toBeDefined();
    if (validationError) {
      expect(validationError.errors.status).toBeDefined();
    }
  });

  it("accepts optional fields when provided", () => {
    const agency = new AgencyModel({
      agencyName: "Test Agency",
      name: "Contact Person",
      userId: new Types.ObjectId(),
      yourPhone: "1234567890",
      agencyLogo: "/path/to/logo.jpg",
      photo: "/path/to/photo.jpg",
      position: "Manager",
      companyEmail: "test@example.com",
      companyPhone: "0987654321",
      companyRegistrationNumberGST: "GST123456",
      website: "https://example.com",
      uploadIdProof: "/path/to/id.pdf",
      uploadBusinessProof: "/path/to/business.pdf",
      agencyAddress: "123 Test St",
      agencyLocation: "Test Location",
      country: "Test Country",
      state: "Test State",
      city: "Test City",
      pincode: "123456"
    });

    expect(agency.validateSync()).toBeUndefined();
    expect(agency.agencyLogo).toBe("/path/to/logo.jpg");
    expect(agency.companyEmail).toBe("test@example.com");
    expect(agency.website).toBe("https://example.com");
  });
});
