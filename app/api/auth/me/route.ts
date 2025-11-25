import User from '@/models/User';
import { verify } from 'jsonwebtoken';
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

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Lấy token từ cookie
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy token' },
                { status: 401 }
            );
        }

        // Kiểm tra và decode token
        const decoded = verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key-change-this'
        ) as { userId: string };

        // Lấy thông tin user
        const user = await User.findById(decoded.userId).select(
            '-password'
        );

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User không tồn tại' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { success: false, error: 'Token không hợp lệ' },
            { status: 401 }
        );
    }
}
