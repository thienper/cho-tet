'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBars, FaBox, FaHome, FaList, FaTimes } from 'react-icons/fa';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
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
                        href="/"
                        className="admin-nav-item"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FaHome /> Về trang chủ
                    </Link>

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
                </nav>
            </aside>

            {menuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
