import { BannerRepository } from '../bannerRepository';
import { BannerModel, IBanner } from '../../models/bannerModel';

// Mock BannerModel with chainable query methods
jest.mock('../../models/bannerModel', () => ({
  BannerModel: {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn()
    }),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    updateOne: jest.fn()
  }
}));

describe('BannerRepository', () => {
  let repo: BannerRepository;

  beforeEach(() => {
    repo = new BannerRepository();
  });

  describe('updateBannerDeep', () => {
    it('should deep merge and save banner', async () => {
      const mockBanner = {
        homepage: {
          bannerOne: { title: 'old', highlightedText: '', image1: '', subHead1: '', subDescription1: '', image2: '', subHead2: '', subDescription2: '', image3: '', subHead3: '', subDescription3: '' },
          bannerTwo: { backgroundImage: '', title: '', description: '', features: [], buttonName: '', buttonUrl: '' }
        },
        aboutBanner: {},
        adminId: '01',
        save: jest.fn().mockResolvedValue(true),
        markModified: jest.fn()
      };
      jest.spyOn(BannerModel, 'findOne').mockResolvedValue(mockBanner as any);
      const data = {
        homepage: {
          bannerOne: { title: 'new', highlightedText: '', image1: '', subHead1: '', subDescription1: '', image2: '', subHead2: '', subDescription2: '', image3: '', subHead3: '', subDescription3: '' },
          bannerTwo: { backgroundImage: '', title: '', description: '', features: [], buttonName: '', buttonUrl: '' }
        }
      };
      const result = await repo.updateBannerDeep(data);
      expect(mockBanner.homepage.bannerOne.title).toBe('new');
      expect(mockBanner.save).toHaveBeenCalled();
      expect(result).toBe(mockBanner);
    });

    it('should replace arrays in bannerThree.smallBoxes and bannerFour.history', async () => {
      const requiredBannerFields = {
        backgroundImage: '',
        title: '',
        description: '',
        images: []
      };
  const smallBox = { count: '1', label: 'Label', description: 'Desc' };
  const historyItem = { year: '2020', month: 'Jan', description: 'EventDesc' };
      const mockBanner = {
        homepage: {},
        aboutBanner: {
          bannerOne: { ...requiredBannerFields },
          bannerTwo: { ...requiredBannerFields },
          bannerThree: { smallBoxes: [smallBox], ...requiredBannerFields },
          bannerFour: { history: [historyItem], ...requiredBannerFields },
        },
        save: jest.fn().mockResolvedValue(true),
        markModified: jest.fn()
      };
      jest.spyOn(BannerModel, 'findOne').mockResolvedValue(mockBanner as any);
      const data = {
        aboutBanner: {
          bannerOne: { ...requiredBannerFields },
          bannerTwo: { ...requiredBannerFields },
          bannerThree: { smallBoxes: [{ count: '2', label: 'NewLabel', description: 'NewDesc' }], ...requiredBannerFields },
          bannerFour: { history: [{ year: '2021', month: 'Feb', description: 'NewEventDesc' }], ...requiredBannerFields }
        }
      };
      const result = await repo.updateBannerDeep(data);
      expect(mockBanner.aboutBanner.bannerThree.smallBoxes).toEqual([{ count: '2', label: 'NewLabel', description: 'NewDesc' }]);
      expect(mockBanner.aboutBanner.bannerFour.history).toEqual([{ year: '2021', month: 'Feb', description: 'NewEventDesc' }]);
      expect(mockBanner.save).toHaveBeenCalled();
      expect(result).toBe(mockBanner);
    });

    it('should remove non-model fields from aboutBanner', async () => {
      const requiredBannerFields = {
        backgroundImage: '',
        title: '',
        description: '',
        images: []
      };
  const smallBox = { count: '1', label: 'Label', description: 'Desc' };
  const historyItem = { year: '2020', month: 'Jan', description: 'EventDesc' };
      const mockBanner = {
        homepage: {},
        aboutBanner: {
          bannerOne: { ...requiredBannerFields },
          bannerTwo: { ...requiredBannerFields },
          bannerThree: { smallBoxes: [smallBox], ...requiredBannerFields },
          bannerFour: { history: [historyItem], ...requiredBannerFields },
          extraField: 'shouldBeRemoved'
        },
        save: jest.fn().mockResolvedValue(true),
        markModified: jest.fn()
      };
      jest.spyOn(BannerModel, 'findOne').mockResolvedValue(mockBanner as any);
      jest.spyOn(BannerModel, 'updateOne').mockResolvedValue({} as any);
      const data = {
        aboutBanner: {
          bannerOne: { ...requiredBannerFields },
          bannerTwo: { ...requiredBannerFields },
          bannerThree: { smallBoxes: [smallBox], ...requiredBannerFields },
          bannerFour: { history: [historyItem], ...requiredBannerFields }
        }
      };
      const result = await repo.updateBannerDeep(data);
      expect(mockBanner.aboutBanner.extraField).toBeUndefined();
      expect(mockBanner.save).toHaveBeenCalled();
      expect(result).toBe(mockBanner);
    });

    it('should update adminId if provided', async () => {
      const mockBanner = {
        homepage: {},
        aboutBanner: {},
        adminId: 'old',
        save: jest.fn().mockResolvedValue(true),
        markModified: jest.fn()
      };
      jest.spyOn(BannerModel, 'findOne').mockResolvedValue(mockBanner as any);
      const data = { adminId: 'new' };
      const result = await repo.updateBannerDeep(data);
      expect(mockBanner.adminId).toBe('new');
      expect(mockBanner.save).toHaveBeenCalled();
      expect(result).toBe(mockBanner);
    });
    it('should return null if no banner found', async () => {
      jest.spyOn(BannerModel, 'findOne').mockResolvedValue(null);
      const result = await repo.updateBannerDeep({});
      expect(result).toBeNull();
    });
  });

  it('should create banner', async () => {
  const mockBanner: Partial<IBanner> = { adminId: '01' };
  jest.spyOn(BannerModel, 'create').mockResolvedValue(mockBanner as any);
  const result = await repo.create({ adminId: '01' });
  expect(result).toEqual(mockBanner);
  });

  it('should find banner by id', async () => {
  const mockBanner: Partial<IBanner> = { adminId: '01' };
  jest.spyOn(BannerModel, 'findById').mockResolvedValue(mockBanner as any);
  const result = await repo.findById('id');
  expect(result).toEqual(mockBanner);
  });

  it('should find all banners', async () => {
    const mockBanner: Partial<IBanner> = { adminId: '01' };
    const mockQuery = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockBanner])
    };
    (BannerModel.find as jest.Mock).mockReturnValue(mockQuery);
    const result = await repo.findAll();
    expect(result).toEqual([mockBanner]);
  });

  it('should support pagination in findAll', async () => {
    const mockBanner: Partial<IBanner> = { adminId: '01' };
    const mockQuery = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockBanner])
    };
    (BannerModel.find as jest.Mock).mockReturnValue(mockQuery);
    await repo.findAll({ page: 2, limit: 10 });
    expect(mockQuery.skip).toHaveBeenCalledWith(10);
    expect(mockQuery.limit).toHaveBeenCalledWith(10);
  });

  it('should handle empty pagination params', async () => {
    const mockBanner: Partial<IBanner> = { adminId: '01' };
    const mockQuery = {
      exec: jest.fn().mockResolvedValue([mockBanner])
    };
    (BannerModel.find as jest.Mock).mockReturnValue(mockQuery);
    const result = await repo.findAll({});
    expect(result).toEqual([mockBanner]);
  });

  it('should update banner by id', async () => {
  const mockBanner: Partial<IBanner> = { adminId: '01' };
  jest.spyOn(BannerModel, 'findByIdAndUpdate').mockResolvedValue(mockBanner as any);
  const result = await repo.updateById('id', { adminId: '01' });
  expect(result).toEqual(mockBanner);
  });

  it('should delete banner by id', async () => {
  const mockBanner: Partial<IBanner> = { adminId: '01' };
  jest.spyOn(BannerModel, 'findByIdAndDelete').mockResolvedValue(mockBanner as any);
  const result = await repo.deleteById('id');
  expect(result).toEqual(mockBanner);
  });
});
