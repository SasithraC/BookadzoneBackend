import mongoose from "mongoose";
import footerInfoRepository from "../footerInfoRepository";
import { ENV } from "../../config/env";
import { IFooterInfo } from "../../models/footerinfoModel";

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("FooterInfoRepository", () => {
  let footerInfoId: string = "";

  it("createFooterInfo creates FooterInfo", async () => {
    const footerInfo = await footerInfoRepository.createFooterInfo({
      logo: "test-logo.png",
      description: "Test description",
      socialmedia: "facebook",
      socialmedialinks: "https://facebook.com/test",
      google: "https://google.com/test",
      appstore: "https://appstore.com/test",
      status: "active",
      priority: 1,
      isDeleted: false,
    } as IFooterInfo);

    expect(footerInfo.logo).toBe("test-logo.png");
    expect(footerInfo.description).toBe("Test description");
    // @ts-ignore
    footerInfoId = (footerInfo._id as any).toString();
  });

  it("getFooterInfoById finds FooterInfo", async () => {
    const found = await footerInfoRepository.getFooterInfoById(footerInfoId);
    expect(found && (found._id as any).toString()).toBe(footerInfoId);
  });

  it("updateFooterInfo updates FooterInfo", async () => {
    const updated = await footerInfoRepository.updateFooterInfo(footerInfoId, {
      description: "Updated description",
    });
    expect(updated?.description).toBe("Updated description");
  });

  it("softDeleteFooterInfo marks FooterInfo as deleted", async () => {
    const deleted = await footerInfoRepository.softDeleteFooterInfo(footerInfoId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it("restoreFooterInfo recovers FooterInfo", async () => {
    const restored = await footerInfoRepository.restoreFooterInfo(footerInfoId);
    expect(restored?.isDeleted).toBe(false);
    expect(restored?.status).toBe("active");
  });

  it("toggleStatus switches FooterInfo status", async () => {
    const toggled = await footerInfoRepository.toggleStatus(footerInfoId);
    expect(["active", "inactive"]).toContain(toggled?.status);
  });

  it("getFooterInfo returns paginated FooterInfos", async () => {
    const result = await footerInfoRepository.getFooterInfo(1, 10);
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("getAllTrashFooterInfos returns deleted FooterInfos", async () => {
    // First soft delete to make sure it's in trash
    await footerInfoRepository.softDeleteFooterInfo(footerInfoId);
    const result = await footerInfoRepository.getAllTrashFooterInfos(1, 10);
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("deleteFooterInfoPermanently removes FooterInfo", async () => {
    const del = await footerInfoRepository.deleteFooterInfoPermanently(footerInfoId);
    expect(del).not.toBeNull();
  });
});
