import { BannerModel } from '../models//bannerModel';

const defaultBanner = {
  adminId: '01',
  homepage: {
    bannerOne: {
      title: 'Banner One Title',
      highlightedText: 'Highlighted Text',
      image1: '/uploads/banner/image1.png',
      subHead1: 'Sub Head 1',
      subDescription1: 'Sub Description 1',
      image2: '/uploads/banner/image2.png',
      subHead2: 'Sub Head 2',
      subDescription2: 'Sub Description 2',
      image3: '/uploads/banner/image3.png',
      subHead3: 'Sub Head 3',
      subDescription3: 'Sub Description 3',
    },
    bannerTwo: {
      backgroundImage: '/uploads/banner/background.png',
      title: 'Banner Two Title',
      description: 'Banner Two Description',
      features: [
        { icon: 'icon1', title: 'Feature 1' },
        { icon: 'icon2', title: 'Feature 2' }
      ],
      buttonName: 'Click Me',
      buttonUrl: 'https://example.com',
    },
  },
  aboutBanner: {
    bannerOne: {
      backgroundImage: '/uploads/banner/about-bg.png',
      title: 'About Us',
      description: 'Welcome to bookadzone. Where Ideas Meet the Skyline. We believe every brand deserves to be seen and celebrated. bookadzone makes it easier than ever to launch outdoor campaigns that inspire and engage.',
      images: [
        { id: 1, url: '/uploads/banner/about1.png' },
        { id: 2, url: '/uploads/banner/about2.png' },
        { id: 3, url: '/uploads/banner/about3.png' },
        { id: 4, url: '/uploads/banner/about4.png' }
      ],
    },
    bannerTwo: {
      backgroundImage: '/uploads/banner/about-bg.png',
      title: 'Our Story',
      description: 'Welcome to bookadzone. Where Ideas Meet the Skyline',
      images: [
        { id: 1, url: '/uploads/banner/about1.png' },
        { id: 2, url: '/uploads/banner/about2.png' },
        { id: 3, url: '/uploads/banner/about3.png' },
        { id: 4, url: '/uploads/banner/about4.png' }
      ],
    },
    bannerThree: {
      title: 'Banner Three Title',
      description: 'Banner Three Description',
      smallBoxes: [
        { count: '15,000+', label: 'Successful Campaigns', description: 'Launched' },
        { count: '97%', label: 'Client Retention Rate', description: '' },
        { count: '9,200+', label: 'Verified AdSpaces', description: '' },
        { count: '500+', label: 'Verified Agencies', description: '' },
      ],
    },
    bannerFour: {
      title: 'A Brief History',
      history: [
        { year: '2024', month: 'January', description: 'bookadzone launched with a mission to transform outdoor media booking online.' },
        { year: '2024', month: 'April', description: 'Pilot test agencies partnered, unlocking access to 8,000+ premium ad spaces.' },
        { year: '2024', month: 'August', description: 'Introduced real-time mock-up previews, making ad evaluations seamless for advertisers.' }
      ]
    }
  },
};

const seedBanner = async (): Promise<void> => {
  try {
    await BannerModel.deleteMany();
    await BannerModel.create(defaultBanner);
    console.log('Banner management data seeded successfully');
  } catch (error) {
    console.error('Seeding banner management failed:', error);
  }
};

export default seedBanner;
