import categoryService from '../categoryService';
import categoryRepository from '../../repositories/categoryRepository';

jest.mock('../../repositories/categoryRepository');

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create category', async () => {
    (categoryRepository.findByName as jest.Mock).mockResolvedValue(null);
    (categoryRepository.createCategory as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await categoryService.createCategory({ name: 'Books' });
    expect(result).toEqual({ id: '1' });
  });

  it('should throw error if category name exists', async () => {
    (categoryRepository.findByName as jest.Mock).mockResolvedValue({ id: '1', name: 'Books' });
    await expect(categoryService.createCategory({ name: 'Books' })).rejects.toThrow('Category name already exists');
  });

  it('should get all categories', async () => {
    (categoryRepository.getCategory as jest.Mock).mockResolvedValue({ categories: [], total: 0, page: 1, limit: 10 });
    const result = await categoryService.getCategory(1, 10);
    expect(result).toHaveProperty('categories');
  });

  it('should get category by id', async () => {
    (categoryRepository.getCategoryById as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await categoryService.getCategoryById('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should update category', async () => {
    (categoryRepository.updateCategory as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await categoryService.updateCategory('1', { name: 'Updated Books' });
    expect(result).toEqual({ id: '1' });
  });

  it('should soft delete category', async () => {
    (categoryRepository.softDeleteCategory as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await categoryService.softDeleteCategory('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should restore category', async () => {
    (categoryRepository.restoreCategory as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await categoryService.restoreCategory('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should get all trash categories', async () => {
    (categoryRepository.getAllTrashCategorys as jest.Mock).mockResolvedValue({ categories: [], total: 0, page: 1, limit: 10 });
    const result = await categoryService.getAllTrashCategorys(1, 10);
    expect(result).toHaveProperty('categories');
  });

  it('should toggle status', async () => {
    (categoryRepository.toggleStatus as jest.Mock).mockResolvedValue({ id: '1', status: 'inactive' });
    const result = await categoryService.toggleStatus('1');
    expect(result).toEqual({ id: '1', status: 'inactive' });
  });

  it('should delete category permanently', async () => {
    (categoryRepository.deleteCategoryPermanently as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await categoryService.deleteCategoryPermanently('1');
    expect(result).toEqual({ id: '1' });
  });
});