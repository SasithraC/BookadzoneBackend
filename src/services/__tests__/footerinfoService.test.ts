import footerInfoService from "../footerInfoService";

describe("FooterService", () => {
  it("throws if logo missing", async () => {
    await expect(
      footerInfoService.createFooterInfo({
        description: "test",
        isDeleted: false,
      } as any)
    ).rejects.toThrow("Logo file is required for creation");
  });

  it("throws if description missing", async () => {
    await expect(
      footerInfoService.createFooterInfo({ isDeleted: false } as any, { filename: "logo.png" } as any)
    ).rejects.toThrow("description is required");
  });

  it("throws on invalid status", async () => {
    await expect(
      footerInfoService.createFooterInfo(
        { description: "test", status: "wrong" } as any,
        { filename: "logo.png" } as any
      )
    ).rejects.toThrow(/status must be one of/);
  });
});
