'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Vui lòng nhập email và mật khẩu');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            console.log('Login response:', data);
            console.log('Response status:', res.status);

            if (data.success) {
                toast.success('Đăng nhập thành công');
                console.log('Login successful, redirecting...');
                // Dùng window.location.href như fallback
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 800);
            } else {
                toast.error(data.error || 'Lỗi đăng nhập');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">🎄 Trang Quản Trị</h1>
                <p className="login-subtitle">Đăng nhập để quản lý sản phẩm</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="forgot-password">
                    <p>Quên mật khẩu?</p>
                    <a
                        href="https://zalo.me/0974122850"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="zalo-link"
                    >
                        💬 Liên hệ Zalo: 0974122850
                    </a>
                </div>
            </div>
        </div>
    );
}
