import mongoose, { Document } from "mongoose";
const { Schema } = mongoose;

export interface ILetter extends Document {
    name: string;
    slug : string;
    template : string;
    status: "active" | "inactive";
    isDeleted: boolean;
}

const newsLetterSchema = new Schema<ILetter>(
    {
        name: { type: String, required: true },
        slug : { type: String, required: true },
        template : { type: String, required:true },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const NewsLetter = mongoose.model<ILetter>("NewsLetter", newsLetterSchema);


