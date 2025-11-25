import { verifyUserToken } from '@/lib/authHelper';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextRequest, NextResponse } from 'next/server';

// GET single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy danh mục' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id } = await params;

        const category = await Category.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy danh mục' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id } = await params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy danh mục' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
