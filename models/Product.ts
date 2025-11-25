import mongoose from 'mongoose';

export interface IProduct {
    _id?: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount?: number;
    image: string;
    images?: string[];
    category: mongoose.Types.ObjectId | string;
    stock: number;
    featured?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên sản phẩm'],
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
            required: [true, 'Vui lòng nhập mô tả sản phẩm'],
        },
        price: {
            type: Number,
            required: [true, 'Vui lòng nhập giá sản phẩm'],
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        image: {
            type: String,
            required: [true, 'Vui lòng thêm hình ảnh sản phẩm'],
        },
        images: [
            {
                type: String,
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Vui lòng chọn danh mục'],
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
