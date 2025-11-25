import { verifyAdminToken } from '@/lib/authHelper';
import User from '@/models/User';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    await mongoose.connect(MONGODB_URI);
}

async function checkAdminRole(request: NextRequest) {
    try {
        const auth = verifyAdminToken(request);
        return auth !== null;
    } catch {
        return false;
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const isAdmin = await checkAdminRole(request);
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền truy cập' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { name, email, password, role } = body;

        // Kiểm tra user tồn tại
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Tài khoản không tồn tại' },
                { status: 404 }
            );
        }

        // Cập nhật thông tin
        if (name) user.name = name;
        if (email) {
            const existingEmail = await User.findOne({
                email,
                _id: { $ne: id },
            });
            if (existingEmail) {
                return NextResponse.json(
                    { success: false, error: 'Email đã tồn tại' },
                    { status: 400 }
                );
            }
            user.email = email;
        }
        if (password) {
            user.password = password;
        }
        if (role) {
            user.role = role;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            data: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            message: 'Cập nhật tài khoản thành công',
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi cập nhật tài khoản' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const isAdmin = await checkAdminRole(request);
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền truy cập' },
                { status: 403 }
            );
        }

        const { id } = await params;

        // Kiểm tra user tồn tại
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Tài khoản không tồn tại' },
                { status: 404 }
            );
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Xóa tài khoản thành công',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi xóa tài khoản' },
            { status: 500 }
        );
    }
}
