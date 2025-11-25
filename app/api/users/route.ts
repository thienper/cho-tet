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

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const isAdmin = await checkAdminRole(request);
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền truy cập' },
                { status: 403 }
            );
        }

        // Lấy tất cả users (không phân biệt role)
        const users = await User.find({}).select('-password');

        return NextResponse.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi lấy danh sách' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const isAdmin = await checkAdminRole(request);
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền truy cập' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { email, name, password, role = 'staff' } = body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Email đã tồn tại' },
                { status: 400 }
            );
        }

        // Tạo user mới
        const user = await User.create({
            email,
            name,
            password,
            role,
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                message: 'Tạo tài khoản thành công',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi tạo tài khoản' },
            { status: 500 }
        );
    }
}
