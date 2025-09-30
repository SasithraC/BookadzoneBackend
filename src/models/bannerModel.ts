import { Schema, model, Document } from "mongoose";

export interface IBanner extends Document {
  adminId: string;
  homepage: {
    bannerOne: {
      title: string;
      highlightedText: string;
      image1: string;
      subHead1: string;
      subDescription1: string;
      image2: string;
      subHead2: string;
      subDescription2: string;
      image3: string;
      subHead3: string;
      subDescription3: string;
    };
    bannerTwo: {
      backgroundImage: string;
      title: string;
      description: string;
      features: { icon: string; title: string }[];
      buttonName: string;
      buttonUrl: string;
    };
  };
  aboutBanner: {
    bannerOne: {
      backgroundImage: string;
      title: string;
      description: string;
      images: { id: number; url: string }[];
    };
    bannerTwo: {
      backgroundImage: string;
      title: string;
      description: string;
      images: { id: number; url: string }[];
    };
    bannerThree: {
      title: string;
      description: string;
      smallBoxes: {
        count: string;
        label: string;
        description: string;
      }[];
    };
     bannerFour:{
      title: string;
      history:{
        year:string;
        month:string;
        description: string;
      }[]
    } 
  };
}

const bannerSchema = new Schema<IBanner>({
  adminId: { type: String, default: "01" },
  homepage: {
    bannerOne: {
      title: { type: String, default: "" },
      highlightedText: { type: String, default: "" },
      image1: { type: String, default: "" },
      subHead1: { type: String, default: "" },
      subDescription1: { type: String, default: "" },
      image2: { type: String, default: "" },
      subHead2: { type: String, default: "" },
      subDescription2: { type: String, default: "" },
      image3: { type: String, default: "" },
      subHead3: { type: String, default: "" },
      subDescription3: { type: String, default: "" },
    },
    bannerTwo: {
      backgroundImage: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      features: [{
        icon: { type: String, default: "" },
        title: { type: String, default: "" }
      }],
      buttonName: { type: String, default: "" },
      buttonUrl: { type: String, default: "" },
    },
  },
  aboutBanner: {
    bannerOne: {
      backgroundImage: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      images: [{
        id: { type: Number, required: true },
        url: { type: String, required: true }
      }],
    },
    bannerTwo: {
      backgroundImage: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      images: [{
        id: { type: Number, required: true },
        url: { type: String, required: true }
      }],
    },
    bannerThree: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      smallBoxes: [{
      count: { type: String, default: "" },
      label: { type: String, default: "" },
    }],
    },
   
    bannerFour:{
      title: { type: String, default: "" },
      history:[{
        year: { type: String, default: "" },
        month: { type: String, default: "" },
        description: { type: String, default: "" }
      }]
    } 
  },
}, { timestamps: true });

export const BannerModel = model<IBanner>("Banners", bannerSchema);