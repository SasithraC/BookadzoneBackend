// import blogsRepository from "../blogsRepository";
// import { BlogsModel, IBlogsModel } from "../../models/blogsModel";
// import { Types } from "mongoose";

// // Mocking Mongoose Model methods
// jest.mock("../../models/blogsModel", () => ({
//   BlogsModel: {
//     create: jest.fn(),
//     find: jest.fn(),
//     findOne: jest.fn(),
//     findById: jest.fn(),
//     findByIdAndUpdate: jest.fn(),
//     findByIdAndDelete: jest.fn(),
//     countDocuments: jest.fn(),
//   },
// }));

// describe("BlogRepository", () => {
//   const repo = blogsRepository;

//   const mockBlog: IBlogsModel = {
//     _id: new Types.ObjectId(),
//     blogTitle: "Test Blog",
//     blogCategory: "Tech",
//     blogDescription: "This is a test blog",
//     blogImg: "image.png",
//     seoTitle: "SEO Title",
//     seoDescription: "SEO Description",
//     status: "active",
//     isDeleted: false,
//     length: 100,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   } as IBlogsModel;

//   it("should create a blog", async () => {
//     (BlogsModel.create as jest.Mock).mockResolvedValue(mockBlog);
//     const result = await repo.createBlog(mockBlog);
//     expect(result).toEqual(mockBlog);
//     expect(BlogsModel.create).toHaveBeenCalledWith(mockBlog);
//   });

//   it("should find blog by title", async () => {
//     (BlogsModel.findOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockBlog) });
//     const result = await repo.findByName("Test Blog");
//     expect(result).toEqual(mockBlog);
//     expect(BlogsModel.findOne).toHaveBeenCalledWith({ blogTitle: "Test Blog" });
//   });

//   it("should get all blogs", async () => {
//     (BlogsModel.find as jest.Mock).mockReturnValue({
//       skip: jest.fn().mockReturnThis(),
//       limit: jest.fn().mockResolvedValue([mockBlog]),
//     });
//     (BlogsModel.countDocuments as jest.Mock).mockResolvedValue(1);

//     const result = await repo.getAllBlogs(1, 10);
//     expect(result.blogs).toEqual([mockBlog]);
//     expect(result.total).toBe(1);
//     expect(result.page).toBe(1);
//     expect(result.limit).toBe(10);
//   });

//   it("should get blog by ID", async () => {
//     (BlogsModel.findById as jest.Mock).mockResolvedValue(mockBlog);
//     const result = await repo.getBlogById(mockBlog._id);
//     expect(result).toEqual(mockBlog);
//   });

//   it("should update blog", async () => {
//     const updated = { ...mockBlog, blogTitle: "Updated Blog" };
//     (BlogsModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
//     const result = await repo.updateBlog(mockBlog._id, { blogTitle: "Updated Blog" });
//     expect(result).toEqual(updated);
//   });

//   it("should soft delete blog", async () => {
//     const deleted = { ...mockBlog, isDeleted: true };
//     (BlogsModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(deleted);
//     const result = await repo.softDeleteBlog(mockBlog._id);
//     expect(result).toEqual(deleted);
//   });

//   it("should restore blog", async () => {
//     const restored = { ...mockBlog, isDeleted: false };
//     (BlogsModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(restored);
//     const result = await repo.restoreBlog(mockBlog._id);
//     expect(result).toEqual(restored);
//   });

//   it("should get all trash blogs", async () => {
//     (BlogsModel.find as jest.Mock).mockReturnValue({
//       skip: jest.fn().mockReturnThis(),
//       limit: jest.fn().mockResolvedValue([mockBlog]),
//     });
//     (BlogsModel.countDocuments as jest.Mock).mockResolvedValue(1);

//     const result = await repo.getAllTrashBlogs(1, 10);
//     expect(result.blogs).toEqual([mockBlog]);
//     expect(result.total).toBe(1);
//     expect(result.page).toBe(1);
//     expect(result.limit).toBe(10);
//   });

//   it("should toggle blog status", async () => {
//     (BlogsModel.findById as jest.Mock).mockResolvedValue(mockBlog);
//     const toggled = { ...mockBlog, status: "inactive" };
//     (BlogsModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(toggled);

//     const result = await repo.toggleStatus(mockBlog._id);
//     expect(result).toEqual(toggled);
//   });

//   it("should return null if toggleStatus blog not found", async () => {
//     (BlogsModel.findById as jest.Mock).mockResolvedValue(null);
//     const result = await repo.toggleStatus(mockBlog._id);
//     expect(result).toBeNull();
//   });

//   it("should permanently delete blog", async () => {
//     (BlogsModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockBlog);
//     const result = await repo.deleteBlogPermanently(mockBlog._id);
//     expect(result).toEqual(mockBlog);
//   });
// });