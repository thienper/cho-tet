'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaCopy, FaFacebook, FaPhone, FaTrash } from 'react-icons/fa';
import { SiMessenger, SiZalo } from 'react-icons/si';
import { toast, Toaster } from 'sonner';

export default function Favorites() {
    const [favorites, setFavorites] = useState<any[]>([]);

    const loadFavorites = () => {
        const favoritesData = JSON.parse(sessionStorage.getItem('favorites') || '[]');
        setFavorites(favoritesData);
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const removeFavorite = (id: string) => {
        const updatedFavorites = favorites.filter(item => item._id !== id);
        setFavorites(updatedFavorites);
        sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const clearFavorites = () => {
        setFavorites([]);
        sessionStorage.removeItem('favorites');
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
            text += `${index + 1}. ${item.name}\n`;
            text += `   Giá: ${formatPrice(itemPrice)}\n\n`;
        });
        return text;
    };

    const copyToClipboard = () => {
        const favoritesList = generateFavoritesList();
        navigator.clipboard.writeText(favoritesList);
        toast.success('Đã sao chép danh sách yêu thích!');
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
                            <a href="/" className="back-to-shop-btn">Khám phá sản phẩm</a>
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
                                                    src={item.image || '/placeholder.jpg'}
                                                    alt={item.name}
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>

                                            <div className="cart-item-info">
                                                <h3>{item.name}</h3>
                                                <p className="cart-item-price">{formatPrice(itemPrice)}</p>
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
                                            href="https://zalo.me/0123456789"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-btn zalo-btn"
                                        >
                                            <SiZalo /> Zalo
                                        </a>
                                        <a
                                            href="https://www.facebook.com/messages/t/yourpage"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-btn messenger-btn"
                                        >
                                            <SiMessenger /> Messenger
                                        </a>
                                        <a
                                            href="https://www.facebook.com/yourpage"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-btn facebook-btn"
                                        >
                                            <FaFacebook /> Facebook
                                        </a>
                                        <a
                                            href="tel:0123456789"
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
