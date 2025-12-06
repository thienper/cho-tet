'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCopy, FaFacebook, FaPhone, FaTrash } from 'react-icons/fa';
import { SiMessenger, SiZalo } from 'react-icons/si';
import { toast, Toaster } from 'sonner';

export default function Favorites() {
    type FavoriteItem = {
        _id: string;
        name: string;
        price: number;
        discount?: number;
        images?: string[];
        quantity: number;
    };
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    const loadFavorites = () => {
        const raw = sessionStorage.getItem('favorites') || '[]';
        const parsed: Array<Partial<FavoriteItem>> = JSON.parse(raw);
        const favoritesData: FavoriteItem[] = parsed.map((item) => ({
            _id: String(item._id ?? ''),
            name: String(item.name ?? ''),
            price: Number(item.price ?? 0),
            discount: typeof item.discount !== 'undefined' ? Number(item.discount) : undefined,
            images: Array.isArray(item.images) ? item.images as string[] : undefined,
            quantity: typeof item.quantity !== 'undefined' ? Math.max(1, Number(item.quantity)) : 1,
        }));
        setFavorites(favoritesData);
        sessionStorage.setItem('favorites', JSON.stringify(favoritesData));
    };

    useEffect(() => {
        // Defer state update to avoid synchronous setState inside effect
        const id = setTimeout(loadFavorites, 0);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeFavorite = (id: string) => {
        const updatedFavorites = favorites.filter(item => item._id !== id);
        setFavorites(updatedFavorites);
        sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        window.dispatchEvent(new Event('favorites-updated'));
    };

    const changeQuantity = (id: string, delta: number) => {
        const updatedFavorites = favorites.map(item => {
            if (item._id === id) {
                const nextQty = Math.max(1, (item.quantity ?? 1) + delta);
                return { ...item, quantity: nextQty };
            }
            return item;
        });
        setFavorites(updatedFavorites);
        sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        window.dispatchEvent(new Event('favorites-updated'));
    };

    const clearFavorites = () => {
        setFavorites([]);
        sessionStorage.removeItem('favorites');
        window.dispatchEvent(new Event('favorites-updated'));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const generateFavoritesList = () => {
        let text = '❤️ DANH SÁCH SẢN PHẨM YÊU THÍCH TẾT ❤️\n\n';
        favorites.forEach((item, index) => {
            const itemPrice = item.discount
                ? item.price - (item.price * item.discount) / 100
                : item.price;
            const qty = item.quantity ?? 1;
            text += `${index + 1}. ${item.name} (SL: ${qty})\n`;
            text += `   Giá mỗi sản phẩm: ${formatPrice(itemPrice)}\n`;
            text += `   Thành tiền: ${formatPrice(itemPrice * qty)}\n\n`;
        });
        return text;
    };

    const copyToClipboard = async () => {
        const favoritesList = generateFavoritesList();
        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                await navigator.clipboard.writeText(favoritesList);
            } else {
                // Fallback for some mobile browsers
                const textarea = document.createElement('textarea');
                textarea.value = favoritesList;
                textarea.style.position = 'fixed';
                textarea.style.top = '0';
                textarea.style.left = '0';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                    document.execCommand('copy');
                } finally {
                    document.body.removeChild(textarea);
                }
            }
            toast.success('Đã sao chép danh sách yêu thích!');
        } catch {
            toast.error('Sao chép không thành công. Hãy chọn và sao chép thủ công.');
        }
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            <Header />

            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">❤️ Sản Phẩm Yêu Thích</h1>

                    {favorites.length === 0 ? (
                        <div className="empty-cart">
                            <p>Chưa có sản phẩm yêu thích</p>
                            <Link href="/" className="back-to-shop-btn">Khám phá sản phẩm</Link>
                        </div>
                    ) : (
                        <div className="cart-wrapper">
                            <div className="cart-items">
                                {favorites.map((item) => {
                                    const itemPrice = item.discount
                                        ? item.price - (item.price * item.discount) / 100
                                        : item.price;

                                    return (
                                        <div key={item._id} className="cart-item">
                                            <div className="cart-item-image">
                                                <Image
                                                    src={item.images?.[0] || '/placeholder.jpg'}
                                                    alt={item.name}
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>

                                            <div className="cart-item-info">
                                                <h3>{item.name}</h3>
                                                <p className="cart-item-price">{formatPrice(itemPrice)}</p>
                                                <div className="cart-item-quantity">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => changeQuantity(item._id, -1)}
                                                        aria-label="Giảm số lượng"
                                                    >
                                                        −
                                                    </button>
                                                    <span>{item.quantity ?? 1}</span>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => changeQuantity(item._id, 1)}
                                                        aria-label="Tăng số lượng"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeFavorite(item._id)}
                                                className="remove-item-btn"
                                                title="Xóa khỏi yêu thích"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="cart-summary">
                                <h3>❤️ Danh Sách Yêu Thích</h3>
                                <div className="order-text-box">
                                    <textarea
                                        value={generateFavoritesList()}
                                        readOnly
                                        rows={10}
                                        className="order-textarea"
                                    />
                                </div>
                                <button onClick={copyToClipboard} className="copy-btn">
                                    <FaCopy /> Sao Chép Danh Sách
                                </button>

                                <div className="contact-seller-section">
                                    <h3>📞 Liên Hệ Đặt Hàng</h3>
                                    <p className="contact-note">Sao chép danh sách trên và gửi cho chúng tôi qua:</p>
                                    <div className="contact-buttons">
                                        <a
                                            href="http://zaloapp.com/qr/p/kuhf5gyvg7sw"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-btn zalo-btn"
                                        >
                                            <SiZalo /> Zalo
                                        </a>
                                        <a
                                            href="https://m.me/thienperr"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-btn messenger-btn"
                                        >
                                            <SiMessenger /> Messenger
                                        </a>
                                        <a
                                            href="https://www.facebook.com/thienperr"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-btn facebook-btn"
                                        >
                                            <FaFacebook /> Facebook
                                        </a>
                                        <a
                                            href="tel:0974122850"
                                            className="contact-btn phone-btn"
                                        >
                                            <FaPhone /> Gọi Điện
                                        </a>
                                    </div>
                                </div>

                                <button onClick={clearFavorites} className="clear-cart-btn">
                                    Xóa Tất Cả Yêu Thích
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
