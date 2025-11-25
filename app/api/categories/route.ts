import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextRequest, NextResponse } from 'next/server';

// GET all categories
export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: categories });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const category = await Category.create(body);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
