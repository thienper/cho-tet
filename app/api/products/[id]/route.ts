import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// GET single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const product = await Product.findById(id).populate('category');

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy sản phẩm' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// PUT update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { id } = await params;

        console.log('PUT request - Product ID:', id);
        console.log('PUT request - Body:', body);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'ID sản phẩm không hợp lệ' },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        console.log('Updated product:', product);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy sản phẩm' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error: unknown) {
        console.error('PUT error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }
}

// DELETE product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy sản phẩm' },
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
