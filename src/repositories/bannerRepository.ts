import { BannerModel, IBanner } from '../models/bannerModel';

// Utility to convert flat keys to nested object
function unflatten(data: any) {
  const result: any = {};
  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue;
    const value = data[key];
    const keys = key.split('.');
    let cur = result;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        // Try to parse JSON for arrays/objects
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            cur[k] = JSON.parse(value);
          } catch {
            cur[k] = value;
          }
        } else {
          cur[k] = value;
        }
      } else {
        if (!cur[k]) cur[k] = {};
        cur = cur[k];
      }
    }
  }
  return result;
}

export class BannerRepository {
  async updateBannerDeep(data: Partial<IBanner>) {
    const banner = await BannerModel.findOne();
    if (!banner) return null;

      console.log('[DEBUG] Existing banner before update:', JSON.stringify(banner, null, 2));
      console.log('[DEBUG] Incoming update data:', JSON.stringify(data, null, 2));
    // Helper to deep merge only provided fields, always replace arrays
    function deepMerge(target: any, source: any) {
      for (const key in source) {
        if (source[key] !== undefined && source[key] !== null) {
          if (Array.isArray(source[key])) {
            // Always replace arrays
            target[key] = source[key];
          } else if (typeof source[key] === 'object' && typeof target[key] === 'object' && target[key] !== null) {
            deepMerge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    }

    // Convert flat keys to nested object before merging
    const nestedData = unflatten(data);
    if (nestedData.homepage) {
      deepMerge(banner.homepage, nestedData.homepage);
    }
    if (nestedData.aboutBanner) {
      // Only update fields defined in IBanner model
      const aboutBannerKeys: (keyof IBanner['aboutBanner'])[] = ['bannerOne', 'bannerTwo', 'bannerThree', 'bannerFour'];
      for (const key of aboutBannerKeys) {
        if (nestedData.aboutBanner[key]) {
          if (key === 'bannerThree' && Array.isArray(nestedData.aboutBanner.bannerThree.smallBoxes)) {
            banner.aboutBanner.bannerThree.smallBoxes = nestedData.aboutBanner.bannerThree.smallBoxes;
          }
          if (key === 'bannerFour' && Array.isArray(nestedData.aboutBanner.bannerFour.history)) {
            banner.aboutBanner.bannerFour.history = nestedData.aboutBanner.bannerFour.history;
          }
          deepMerge(banner.aboutBanner[key], nestedData.aboutBanner[key]);
        }
      }
      // Remove any non-model fields from aboutBanner
      Object.keys(banner.aboutBanner).forEach((field) => {
        if (!aboutBannerKeys.includes(field as any)) {
          (banner.aboutBanner as any)[field] = undefined;
          banner.markModified('aboutBanner.' + field);
        }
      });
    }
    if (data.adminId) banner.adminId = data.adminId;
      console.log('[DEBUG] Banner after merge, before save:', JSON.stringify(banner, null, 2));
    await banner.save();
    // After saving, force removal of any non-model fields from aboutBanner in DB
    if (nestedData.aboutBanner) {
      const aboutBannerKeys: (keyof IBanner['aboutBanner'])[] = ['bannerOne', 'bannerTwo', 'bannerThree', 'bannerFour'];
      const fieldsToRemove = Object.keys(banner.aboutBanner).filter(
        (field) => !aboutBannerKeys.includes(field as any)
      );
      if (fieldsToRemove.length > 0) {
        await BannerModel.updateOne(
          { _id: banner._id },
          { $unset: fieldsToRemove.reduce((acc, field) => ({ ...acc, [`aboutBanner.${field}`]: "" }), {}) }
        );
        fieldsToRemove.forEach((field) => {
          delete (banner.aboutBanner as any)[field];
        });
      }
    }
    console.log('[DEBUG] Banner saved successfully.');
    return banner;
  }
  async create(data: Partial<IBanner>) {
    return BannerModel.create(data);
  }

  async findById(id: string) {
    return BannerModel.findById(id);
  }

  async findAll() {
    return BannerModel.find();
  }

  async updateById(id: string, data: Partial<IBanner>) {
    return BannerModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string) {
    return BannerModel.findByIdAndDelete(id);
  }
}
