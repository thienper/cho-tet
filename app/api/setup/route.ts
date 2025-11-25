import User from '@/models/User';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

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

export async function POST() {
    try {
        await connectDB();

        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            return NextResponse.json(
                { success: false, error: 'Admin user already exists' },
                { status: 400 }
            );
        }

        // Tạo tài khoản admin demo
        const admin = await User.create({
            email: 'admin@example.com',
            password: 'admin123456',
            name: 'Admin Tết',
            role: 'admin',
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            user: {
                _id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
            credentials: {
                email: 'admin@example.com',
                password: 'admin123456',
            },
        });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi tạo tài khoản admin' },
            { status: 500 }
        );
    }
}
