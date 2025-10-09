// import categoryRepository from "../repositories/categoryRepository";
import blogsRepository from "../repositories/blogsRepository";
// import { ICategory } from "../models/categoryModel";
import { IBlogsModel } from "../models/blogsModel";
import { Types } from "mongoose";

class BlogService {
    async createBlog(data: Partial<IBlogsModel>): Promise<IBlogsModel> {
        //  Check if name already exists
        const existing = await blogsRepository.findByName(data.blogTitle as string);
        if (existing) {
            throw new Error("Blog Title already exists");
        }
        return await blogsRepository.createBlog(data);
    }

    async getAllBlogs(page = 1, limit = 10) {
        return await blogsRepository.getAllBlogs(page, limit);
    }

    async getBlogById(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
        return await blogsRepository.getBlogById(id);
    }

    async updateBlog(id: string | Types.ObjectId, data: Partial<IBlogsModel>): Promise<IBlogsModel | null> {
        return await blogsRepository.updateBlog(id, data);
    }

    async softDeleteBlog(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
        return await blogsRepository.softDeleteBlog(id);
    }

    async restoreBlog(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
        return await blogsRepository.restoreBlog(id);
    }

    async getAllTrashBlogs(page = 1, limit = 10) {
        return await blogsRepository.getAllTrashBlogs(page, limit);
    }

    async toggleStatus(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
        return await blogsRepository.toggleStatus(id);
    }

    async deleteBlogPermanently(id: string | Types.ObjectId): Promise<IBlogsModel | null> {
        return await blogsRepository.deleteBlogPermanently(id);
    }
}

export default new BlogService();
