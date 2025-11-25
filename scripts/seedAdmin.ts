import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User';

dotenv.config();

async function seedAdminUser() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            await mongoose.disconnect();
            return;
        }

        // Tạo tài khoản admin demo
        const admin = await User.create({
            email: 'admin@example.com',
            password: 'admin123456',
            name: 'Admin Tết',
            role: 'admin',
        });

        console.log('Admin user created successfully:');
        console.log('Email: admin@example.com');
        console.log('Password: admin123456');
        console.log('User ID:', admin._id);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
}

seedAdminUser();
