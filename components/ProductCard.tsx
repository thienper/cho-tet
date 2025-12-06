'use client';

import { IProduct } from '@/models/Product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    product: IProduct & { category?: { name: string } | string };
}

export default function ProductCard({ product }: ProductCardProps) {
    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <Link href={`/products/${product._id}`} className="product-card">
            {(product.discount ?? 0) > 0 && (
                <div className="discount-badge">-{product.discount}%</div>
            )}

            <div className="product-image-wrapper">
                <Image
                    src={product.images?.[0] || product.image || '/placeholder.jpg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="product-image"
                />
            </div>

            <div className="product-info">
                <div className="product-category">{typeof product.category === 'object' ? product.category?.name : 'Chưa phân loại'}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description.substring(0, 80)}...</p>

                <div className="product-price-section">
                    {(product.discount ?? 0) > 0 ? (
                        <>
                            <span className="product-price">{formatPrice(discountedPrice)}</span>
                            <span className="product-price-original">{formatPrice(product.price)}</span>
                        </>
                    ) : (
                        <span className="product-price">{formatPrice(product.price)}</span>
                    )}
                </div>

                <span className="view-detail-btn" role="button" tabIndex={0}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/products/${product._id}`;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/products/${product._id}`;
                        }
                    }}
                >
                    🎊 Xem Chi Tiết
                </span>

                {/* Quick favorite button */}
                <span
                    className="view-detail-btn"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                            if (!product._id) return;
                            const id = String(product._id);
                            const favorites: Array<{ _id: string } & Record<string, unknown>> = JSON.parse(sessionStorage.getItem('favorites') || '[]');
                            const exists = favorites.some((it) => it._id === id);
                            if (!exists) {
                                favorites.push({
                                    _id: id,
                                    name: product.name,
                                    price: product.price,
                                    discount: product.discount,
                                    images: product.images,
                                });
                                sessionStorage.setItem('favorites', JSON.stringify(favorites));
                            }
                        } catch { }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!product._id) return;
                            const id = String(product._id);
                            const favorites: Array<{ _id: string } & Record<string, unknown>> = JSON.parse(sessionStorage.getItem('favorites') || '[]');
                            const exists = favorites.some((it) => it._id === id);
                            if (!exists) {
                                favorites.push({
                                    _id: id,
                                    name: product.name,
                                    price: product.price,
                                    discount: product.discount,
                                    images: product.images,
                                });
                                sessionStorage.setItem('favorites', JSON.stringify(favorites));
                            }
                        }
                    }}
                >
                    ❤️ Thêm Yêu Thích
                </span>
            </div>
        </Link>
    );
}
