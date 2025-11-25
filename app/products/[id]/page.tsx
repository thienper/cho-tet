'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaFacebook, FaPhone } from 'react-icons/fa';
import { SiMessenger, SiZalo } from 'react-icons/si';
import { toast, Toaster } from 'sonner';

export default function ProductDetail() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${params.id}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.data);
                setSelectedImage(data.data.images?.[0]);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const addToFavorites = () => {
        const favorites = JSON.parse(sessionStorage.getItem('favorites') || '[]');
        const existingItem = favorites.find((item: any) => item._id === product._id);

        if (existingItem) {
            toast.info('Sản phẩm đã có trong danh sách yêu thích!');
        } else {
            favorites.push({ ...product });
            sessionStorage.setItem('favorites', JSON.stringify(favorites));
            toast.success('Đã thêm vào yêu thích!');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    if (loading) {
        return (
            <>
                <Toaster position="top-right" richColors />
                <Header />
                <main className="main-content">
                    <div className="container">
                        <div className="loading">Đang tải...</div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Toaster position="top-right" richColors />
                <Header />
                <main className="main-content">
                    <div className="container">
                        <div className="loading">Không tìm thấy sản phẩm</div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const finalPrice = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    return (
        <>
            <Toaster position="top-right" richColors />
            <Header />

            <main className="main-content">
                <div className="container">
                    <div className="product-detail-wrapper">
                        <div className="product-detail-images-section">
                            <div className="product-detail-image">
                                <Image
                                    src={selectedImage || product.image || '/placeholder.jpg'}
                                    alt={product.name}
                                    width={500}
                                    height={500}
                                    className="detail-image"
                                />
                            </div>

                            {product.images && product.images.length > 0 && (
                                <div className="product-thumbnails">
                                    {product.images.map((img: string, index: number) => (
                                        <div
                                            key={index}
                                            className={`thumbnail-item ${selectedImage === img ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="thumbnail-image"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="product-detail-info">
                            <div className="product-category-badge">{product.category?.name}</div>
                            <h1 className="product-detail-title">{product.name}</h1>

                            <div className="product-detail-price-section">
                                {product.discount > 0 ? (
                                    <>
                                        <span className="detail-price-original">{formatPrice(product.price)}</span>
                                        <span className="detail-price">{formatPrice(finalPrice)}</span>
                                        <span className="discount-percent">Giảm {product.discount}%</span>
                                    </>
                                ) : (
                                    <span className="detail-price">{formatPrice(product.price)}</span>
                                )}
                            </div>

                            <div className="product-detail-description">
                                <h3>Mô tả sản phẩm:</h3>
                                <p>{product.description}</p>
                            </div>

                            <div className="product-stock">
                                <span>Tình trạng: </span>
                                {product.stock > 0 ? (
                                    <span className="in-stock">Còn hàng ({product.stock} sản phẩm)</span>
                                ) : (
                                    <span className="out-of-stock">Hết hàng</span>
                                )}
                            </div>

                            <button
                                className="add-to-cart-btn"
                                onClick={addToFavorites}
                                disabled={product.stock === 0}
                            >
                                ❤️ Thêm vào yêu thích
                            </button>

                            <div className="contact-seller">
                                <h3>Liên hệ người bán:</h3>
                                <div className="contact-buttons">
                                    <a href="tel:0123456789" className="contact-btn phone">
                                        <FaPhone /> Điện thoại
                                    </a>
                                    <a href="https://zalo.me/0123456789" target="_blank" rel="noopener noreferrer" className="contact-btn zalo">
                                        <SiZalo /> Zalo
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact-btn facebook">
                                        <FaFacebook /> Facebook
                                    </a>
                                    <a href="https://m.me/username" target="_blank" rel="noopener noreferrer" className="contact-btn messenger">
                                        <SiMessenger /> Messenger
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
