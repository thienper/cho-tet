'use client';

import { IProduct } from '@/models/Product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    product: IProduct & { category: { name: string } };
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
        <div className="product-card">
            {(product.discount ?? 0) > 0 && (
                <div className="discount-badge">-{product.discount}%</div>
            )}

            <div className="product-image-wrapper">
                <Image
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="product-image"
                />
            </div>

            <div className="product-info">
                <div className="product-category">{product.category?.name || 'Chưa phân loại'}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description.substring(0, 80)}...</p>

                <div className="product-price-section">
                    {(product.discount ?? 0) > 0 ? (
                        <>
                            <span className="product-price-original">{formatPrice(product.price)}</span>
                            <span className="product-price">{formatPrice(discountedPrice)}</span>
                        </>
                    ) : (
                        <span className="product-price">{formatPrice(product.price)}</span>
                    )}
                </div>

                <Link href={`/products/${product._id}`} className="view-detail-btn">
                    🎊 Xem Chi Tiết
                </Link>
            </div>
        </div>
    );
}
