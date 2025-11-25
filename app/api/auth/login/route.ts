import User from '@/models/User';
import { sign } from 'jsonwebtoken';
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

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng nhập email và mật khẩu' },
                { status: 400 }
            );
        }

        // Tìm user và lấy password (vì mặc định không trả về)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user: any = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Email hoặc mật khẩu không chính xác' },
                { status: 401 }
            );
        }

        // So sánh mật khẩu
        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return NextResponse.json(
                { success: false, error: 'Email hoặc mật khẩu không chính xác' },
                { status: 401 }
            );
        }

        // Kiểm tra role admin hoặc staff
        if (user.role !== 'admin' && user.role !== 'staff') {
            return NextResponse.json(
                { success: false, error: 'Bạn không có quyền truy cập' },
                { status: 403 }
            );
        }

        // Tạo JWT token
        const token = sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-change-this',
            { expiresIn: '30d' }
        );

        // Tạo response với cookie
        const response = NextResponse.json({
            success: true,
            message: 'Đăng nhập thành công',
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        });

        // Set HTTP-only cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi đăng nhập' },
            { status: 500 }
        );
    }
}
