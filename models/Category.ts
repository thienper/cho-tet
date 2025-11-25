import mongoose from 'mongoose';

export interface ICategory {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CategorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên danh mục'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
