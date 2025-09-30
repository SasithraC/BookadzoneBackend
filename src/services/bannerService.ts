import { BannerRepository } from '../repositories/bannerRepository';
import { IBanner } from '../models/bannerModel';

export class BannerService {
  private repository: BannerRepository;
  constructor(repository?: BannerRepository) {
    this.repository = repository || new BannerRepository();
  }

  async getAllBanners() {
    // Return the first (or only) banner management document
    // Model structure: aboutBanner.bannerFour is object with title and history array
    const banners = await this.repository.findAll();
    return banners[0] || null;
  }

  async updateBanner(data: Partial<IBanner>) {
    // Deep merge update for banner management document
    // Model structure: aboutBanner.bannerFour is object with title and history array
    const updated = await this.repository.updateBannerDeep(data);
    if (!updated) throw new Error('Banner management not found');
    return updated;
  }
}
