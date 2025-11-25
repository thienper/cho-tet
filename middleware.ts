import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Chỉ kiểm tra các route /admin (không bao gồm /admin/login)
    if (
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
        const token = request.cookies.get('admin_token')?.value;

        // Nếu không có token, redirect đến login
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Kiểm tra token có hợp lệ không
        try {
            verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key-change-this'
            );
        } catch (error) {
            console.error('Token verification failed:', error);
            // Token không hợp lệ, xóa cookie và redirect
            const response = NextResponse.redirect(
                new URL('/admin/login', request.url)
            );
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
    runtime: 'nodejs',
};
