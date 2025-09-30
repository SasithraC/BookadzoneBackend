// import { Schema, model, Document } from "mongoose";

// export interface ICategory extends Document {
//   name: string;
//   slug: string;
//   description: string;
//   status: "active" | "inactive";
//   isDeleted: boolean;
//   photo: string;
//   isFeatured?: boolean;
// }

// const categorySchema = new Schema<ICategory>(
//   {
//     name: { type: String, required: true },
//     slug: { type: String, required: true },
//     description: { type: String, required: true },
//     photo: { type: String, required: true, maxlength: 100000  },
//     status: { type: String, enum: ["active", "inactive"], default: "active" },
//     isFeatured: { type: Boolean, default: true },
//     isDeleted: { type: Boolean, default: false },

//   },
//   { timestamps: true }
// );

// export const CategoryModel = model<ICategory>("CATEGORY", categorySchema);


import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
  photo: string;
  isFeatured: boolean;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: false, default: "" },
    photo: { type: String, required: false, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },

  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>("Category", categorySchema);
