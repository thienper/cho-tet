import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'Không có file được tải lên' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'tet-market',
            resource_type: 'auto',
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Lỗi khi tải ảnh lên' },
            { status: 500 }
        );
    }
}
