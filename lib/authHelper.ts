import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Verify token từ Authorization header hoặc cookies
 * Format: Bearer <token> hoặc từ cookies.admin_token
 */
export function verifyToken(request: NextRequest): AuthPayload | null {
    try {
        // Cố gắng lấy token từ Authorization header
        let token = request.headers.get('authorization')?.replace('Bearer ', '');

        // Nếu không có header, thử lấy từ cookies
        if (!token) {
            token = request.cookies.get('admin_token')?.value;
        }

        if (!token) {
            return null;
        }

        const decoded = verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key-change-this'
        ) as AuthPayload;

        return decoded;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

/**
 * Verify token và kiểm tra admin role
 */
export function verifyAdminToken(request: NextRequest): AuthPayload | null {
    const decoded = verifyToken(request);
    if (!decoded || decoded.role !== 'admin') {
        return null;
    }
    return decoded;
}

/**
 * Verify token (admin hoặc staff)
 */
export function verifyUserToken(request: NextRequest): AuthPayload | null {
    const decoded = verifyToken(request);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'staff')) {
        return null;
    }
    return decoded;
}
