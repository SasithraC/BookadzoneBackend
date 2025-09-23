import { Schema, model, Document } from "mongoose";

export interface IConfigField {
  key: string;
  value: string;
}

export interface IConfig extends Document {
  name: string;
  slug: string;
  configFields: IConfigField[];
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const configSchema = new Schema<IConfig>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    configFields: [{
      key: { type: String, required: true },
      value: { type: String, required: true }
    }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ConfigModel = model<IConfig>("Config", configSchema);