import { BannerService } from '../../services/bannerService';
import { BannerRepository } from '../../repositories/bannerRepository';
import { IBanner } from '../../models/bannerModel';

jest.mock('../../repositories/bannerRepository');

describe('BannerService', () => {
  let service: BannerService;
  let mockRepo: jest.Mocked<BannerRepository>;

  beforeEach(() => {
    mockRepo = new BannerRepository() as jest.Mocked<BannerRepository>;
    service = new BannerService(mockRepo);
    mockRepo.findAll.mockResolvedValue([]); // Always return an array by default
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBanners', () => {
    it('should return the first banner if exists', async () => {
      const banner = { adminId: '01' };
      mockRepo.findAll.mockResolvedValue([banner as any]);
      const result = await service.getAllBanners();
      expect(result).toBe(banner);
      expect(mockRepo.findAll).toHaveBeenCalled();
    });

    it('should return null if no banners', async () => {
      mockRepo.findAll.mockResolvedValue([]);
      const result = await service.getAllBanners();
      expect(result).toBeNull();
      expect(mockRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('updateBanner', () => {
    it('should update and return the banner', async () => {
      const data = { adminId: '02' };
      const updatedBanner = { adminId: '02' };
      mockRepo.updateBannerDeep.mockResolvedValue(updatedBanner as any);
      const result = await service.updateBanner(data);
      expect(result).toBe(updatedBanner);
      expect(mockRepo.updateBannerDeep).toHaveBeenCalledWith(data);
    });

    it('should throw error if banner not found', async () => {
      mockRepo.updateBannerDeep.mockResolvedValue(null);
      await expect(service.updateBanner({})).rejects.toThrow('Banner management not found');
      expect(mockRepo.updateBannerDeep).toHaveBeenCalledWith({});
    });
  });
  });

