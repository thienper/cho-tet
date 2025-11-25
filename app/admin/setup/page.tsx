'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSetup = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/setup', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                toast.success('✓ Tài khoản admin đã được tạo');
                setDone(true);
            } else {
                toast.error(data.error || 'Lỗi tạo tài khoản');
            }
        } catch (error) {
            console.error('Setup error:', error);
            toast.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Tự động setup khi load trang
        handleSetup();
    }, []);

    return (
        <div className="setup-container">
            <div className="setup-card">
                <h1>⚙️ Thiết Lập Admin</h1>

                {loading && (
                    <div className="setup-loading">
                        <p>Đang tạo tài khoản admin...</p>
                    </div>
                )}

                {done && (
                    <div className="setup-success">
                        <h2>✅ Thiết Lập Thành Công!</h2>
                        <p>Tài khoản admin đã được tạo</p>
                        <div className="credentials">
                            <p>
                                <strong>Email:</strong> admin@example.com
                            </p>
                            <p>
                                <strong>Password:</strong> admin123456
                            </p>
                        </div>
                        <a href="/admin/login" className="btn-login">
                            Đi đến Trang Đăng Nhập
                        </a>
                    </div>
                )}

                {!done && !loading && (
                    <div className="setup-error">
                        <p>Tài khoản admin đã tồn tại hoặc có lỗi xảy ra</p>
                        <a href="/admin/login" className="btn-login">
                            Đi đến Trang Đăng Nhập
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
