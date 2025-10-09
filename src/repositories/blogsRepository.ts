import { BlogsModel,IBlogsModel } from "../models/blogsModel";
import { Types } from "mongoose";

class BlogRepository {
   async findByName(blogTitle: string): Promise<IBlogsModel | null> {
    return BlogsModel.findOne({ blogTitle }).exec();
  }
  async createBlog(data: Partial<IBlogsModel>): Promise<IBlogsModel> {
    return BlogsModel.create(data);
  }

  async getAllBlogs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const blogs = await BlogsModel.find({ isDeleted: false }).skip(skip).limit(limit);
    const total = await BlogsModel.countDocuments({ isDeleted: false });
    return { blogs, total, page, limit };
  }

  async getBlogById(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
    return await BlogsModel.findById(id);
  }

  async updateBlog(id: string | Types.ObjectId, data: Partial<IBlogsModel>): Promise<IBlogsModel | null> {
    return await BlogsModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteBlog(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
    return await BlogsModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async restoreBlog(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
    return await BlogsModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
  }

  async getAllTrashBlogs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const blogs = await BlogsModel.find({ isDeleted: true }).skip(skip).limit(limit);
    const total = await BlogsModel.countDocuments({ isDeleted: true });
    return { blogs, total, page, limit };
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
    const blog = await BlogsModel.findById(id);
    if (!blog) return null;
    const newStatus = blog.status === "active" ? "inactive" : "active";
    return await BlogsModel.findByIdAndUpdate(id, { status: newStatus }, { new: true });
  }

  async deleteBlogPermanently(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
    return await BlogsModel.findByIdAndDelete(id);
  }
}

export default new BlogRepository();

