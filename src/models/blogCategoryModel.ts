import { Schema, model, Document } from "mongoose";

export interface IBlogCategory extends Document {
    name:string;
    status:"active"|"inactive";
}

const blogSchema = new Schema <IBlogCategory>(
    {
        name:{type:String,required:true},
        status:{type:String,enum:["active","inactive"],default:"active"}
    },
    {timestamps:true}
);

export const blogCategoryModel =model <IBlogCategory>("Blog",blogSchema)