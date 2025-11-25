import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Đăng xuất thành công',
        });

        response.cookies.set('admin_token', '', {
            httpOnly: true,
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi đăng xuất' },
            { status: 500 }
        );
    }
}
