import { verifyUserToken } from '@/lib/authHelper';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

// GET all products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');

        // Phân trang: mặc định trang 1, 20 sản phẩm mỗi trang
        const page = Math.max(1, parseInt(pageParam || '1', 10));
        const limit = Math.min(100, parseInt(limitParam || '20', 10));
        const skip = (page - 1) * limit;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query)
            .populate('category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 400 }
        );
    }
}

// POST create new product
export async function POST(request: NextRequest) {
    try {
        // Verify token
        const auth = verifyUserToken(request);
        if (!auth) {
            return NextResponse.json(
                { success: false, error: 'Chưa đăng nhập' },
                { status: 401 }
            );
        }

        await connectDB();
        const body = await request.json();

        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 400 }
        );
    }
}
