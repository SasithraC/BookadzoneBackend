import blogCategoryService from '../blogCategoryService';
import { Types } from 'mongoose';

describe('BlogCategoryService', () => {
  let categoryId: string;

  // -------------------
  // Validation Errors
  // -------------------
  it('throws if name is missing on create', async () => {
    await expect(
      blogCategoryService.createBlogCategory({ slug: 'test', status: 'active', isDeleted: false } as any)
    ).rejects.toThrow(/name is required/);
  });

  it('throws if slug is missing on create', async () => {
    await expect(
      blogCategoryService.createBlogCategory({ name: 'Test', status: 'active', isDeleted: false } as any)
    ).rejects.toThrow(/slug is required/);
  });

  it('throws on too long name', async () => {
    await expect(
      blogCategoryService.createBlogCategory({
        name: 'a'.repeat(501),
        slug: 'test-slug',
        status: 'active',
        isDeleted: false
      } as any)
    ).rejects.toThrow(/name must not exceed 500/);
  });

  it('throws on too long slug', async () => {
    await expect(
      blogCategoryService.createBlogCategory({
        name: 'Test',
        slug: 'a'.repeat(101),
        status: 'active',
        isDeleted: false
      } as any)
    ).rejects.toThrow(/slug must not exceed 100/);
  });

  it('throws on invalid status', async () => {
    await expect(
      blogCategoryService.createBlogCategory({
        name: 'Test',
        slug: 'test-slug',
        status: 'wrong' as any,
        isDeleted: false
      } as any)
    ).rejects.toThrow(/status must be one of/);
  });

  it('throws on invalid isDeleted', async () => {
    await expect(
      blogCategoryService.createBlogCategory({
        name: 'Test',
        slug: 'test-slug',
        status: 'active',
        isDeleted: 'notboolean' as any
      } as any)
    ).rejects.toThrow(/isDeleted must be a boolean/);
  });

  // -------------------
  // Create / Read / Update / Delete
  // -------------------
  it('creates a BlogCategory', async () => {
    const category = await blogCategoryService.createBlogCategory({
      name: 'RepoTech',
      slug: 'repo-tech',
      status: 'active',
      isDeleted: false
    } as any);

    expect(category.name).toBe('RepoTech');
    expect(category.slug).toBe('repo-tech');
    expect(category.status).toBe('active');
    expect(category.isDeleted).toBe(false);

    categoryId = category._id!.toString(); // safe assertion
  });

  it('throws if invalid id passed to getBlogCategoryById', async () => {
    await expect(blogCategoryService.getBlogCategoryById('invalid-id')).rejects.toThrow(/id is invalid/);
  });

it('gets BlogCategory by ID', async () => {
  const category = await blogCategoryService.getBlogCategoryById(categoryId) as any;
  expect(category._id.toString()).toBe(categoryId);
});


  it('updates BlogCategory', async () => {
    const updated = await blogCategoryService.updateBlogCategory(categoryId, { name: 'Updated RepoTech' });
    expect(updated?.name).toBe('Updated RepoTech');
  });

  it('soft deletes BlogCategory', async () => {
    const deleted = await blogCategoryService.softDeleteBlogCategory(categoryId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it('restores BlogCategory', async () => {
    const restored = await blogCategoryService.restoreBlogCategory(categoryId);
    expect(restored?.isDeleted).toBe(false);
    expect(restored?.status).toBe('active');
  });

  it('toggles status', async () => {
    const toggled = await blogCategoryService.toggleStatus(categoryId);
    expect(['active', 'inactive']).toContain(toggled?.status);
  });

  it('gets all BlogCategories', async () => {
    const categories = await blogCategoryService.getAllBlogCategory();
    expect(Array.isArray(categories)).toBe(true);

    categories?.forEach(cat => {
      expect(['active', 'inactive']).toContain(cat.status);
      expect(typeof cat.isDeleted).toBe('boolean');
    });
  });
});
