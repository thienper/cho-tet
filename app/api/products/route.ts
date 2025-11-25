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

        let query: any = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query)
            .populate('category')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: products });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// POST create new product
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
