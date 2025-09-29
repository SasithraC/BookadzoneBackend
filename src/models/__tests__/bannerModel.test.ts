import { BannerModel } from '../bannerModel';
import { ENV } from "../../config/env";
import mongoose from 'mongoose';

describe('BannerModel', () => {
  beforeAll(async () => {
    await mongoose.connect(ENV.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a banner with default values', async () => {
    const banner = new BannerModel();
    expect(banner.adminId).toBe('01');
    expect(banner.homepage.bannerOne.title).toBe('');
    expect(banner.homepage.bannerTwo.title).toBe('');
     expect(banner.aboutBanner.bannerOne.title).toBe('');
     expect(banner.aboutBanner.bannerTwo.title).toBe('');
  });

  it('should save and retrieve a banner', async () => {
    const banner = new BannerModel({
      adminId: 'test',
      homepage: {
        bannerOne: {
          title: 'Banner One',
          highlightedText: 'Highlight',
          image1: 'img1.jpg',
          subHead1: 'Sub1',
          subDescription1: 'Desc1',
          image2: 'img2.jpg',
          subHead2: 'Sub2',
          subDescription2: 'Desc2',
          image3: 'img3.jpg',
          subHead3: 'Sub3',
          subDescription3: 'Desc3',
        },
        bannerTwo: {
          backgroundImage: 'bg.jpg',
          title: 'Banner Two',
          description: 'Desc',
          features: [{ icon: 'icon.png', title: 'Feature' }],
          buttonName: 'Click',
          buttonUrl: '/url',
        },
      },
      aboutBanner: {
        bannerOne: {
          backgroundImage: 'bg1.jpg',
          title: 'BannerOne',
          description: 'Desc1',
          images: [{ id: 1, url: 'img1.jpg' }],
        },
        bannerTwo: {
          backgroundImage: 'bg2.jpg',
          title: 'BannerTwo',
          description: 'Desc2',
          images: [{ id: 2, url: 'img2.jpg' }],
        },
      },
    });
    await banner.save();
    const found = await BannerModel.findById(banner._id);
    expect(found).not.toBeNull();
    expect(found?.adminId).toBe('test');
    expect(found?.homepage.bannerOne.title).toBe('Banner One');
    expect(found?.aboutBanner.bannerOne.title).toBe('BannerOne');
  });
});
