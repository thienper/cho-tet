'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBars, FaBox, FaList, FaSignOutAlt, FaTimes, FaUsers } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminRole, setIsAdminRole] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast.success('Đăng xuất thành công');
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Lỗi đăng xuất');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setIsAuthenticated(true);
                    setIsAdminRole(data.user?.role === 'admin');
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <>
                <Toaster position="top-right" richColors />
                <div className="loading-fullscreen">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <Toaster position="top-right" richColors />
                {children}
            </>
        );
    }

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="admin-layout">
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
                    <div className="admin-logo">
                        <h2>🧧 Admin Panel</h2>
                        <p>Quản trị Tết Market</p>
                    </div>

                    <nav className="admin-nav">

                        <Link
                            href="/admin"
                            className={`admin-nav-item ${pathname === '/admin' ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaBox /> Quản lý sản phẩm
                        </Link>

                        <Link
                            href="/admin/categories"
                            className={`admin-nav-item ${pathname === '/admin/categories' ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaList /> Quản lý danh mục
                        </Link>

                        {isAdminRole && (
                            <Link
                                href="/admin/users"
                                className={`admin-nav-item ${pathname === '/admin/users' ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                <FaUsers /> Quản lý tài khoản
                            </Link>
                        )}

                        <button
                            className="admin-nav-item logout-btn"
                            onClick={() => {
                                setMenuOpen(false);
                                handleLogout();
                            }}
                        >
                            <FaSignOutAlt /> Đăng Xuất
                        </button>
                    </nav>
                </aside>

                {menuOpen && (
                    <div
                        className="mobile-menu-overlay"
                        onClick={() => setMenuOpen(false)}
                    />
                )}

                <main className="admin-main"    >
                    {children}
                </main>
            </div>
        </>
    );
}
