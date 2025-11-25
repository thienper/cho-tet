import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export interface IUser {
    _id?: string;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'staff';
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Vui lòng nhập email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Vui lòng nhập email hợp lệ',
            ],
        },
        password: {
            type: String,
            required: [true, 'Vui lòng nhập mật khẩu'],
            minlength: 6,
            select: false, // Không trả về mật khẩu mặc định
        },
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['admin', 'staff'],
            default: 'staff',
        },
    },
    { timestamps: true }
);

// Hash mật khẩu trước khi lưu
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức so sánh mật khẩu
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
