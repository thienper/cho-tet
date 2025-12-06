'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaHeart, FaSearch } from 'react-icons/fa';

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount: number;
    images?: string[];
    category: Category | string;
    stock: number;
}

export default function Header() {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const computeCount = () => {
            try {
                const raw = sessionStorage.getItem('favorites') || '[]';
                const arr: Array<{ quantity?: number }> = JSON.parse(raw);
                const total = arr.length;
                setFavoritesCount(total);
            } catch {
                setFavoritesCount(0);
            }
        };
        computeCount();
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'favorites') computeCount();
        };
        const onCustom = () => computeCount();
        window.addEventListener('storage', onStorage);
        window.addEventListener('favorites-updated', onCustom as EventListener);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('favorites-updated', onCustom as EventListener);
        };
    }, []);

    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
                const data = await res.json();
                if (data.success) {
                    setSuggestions(data.data.slice(0, 5));
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleSuggestionClick = (productId: string) => {
        setShowSuggestions(false);
        setSearchQuery('');
        window.location.href = `/products/${productId}`;
    };

    const formatPrice = (price: number, discount?: number) => {
        const finalPrice = discount ? price - (price * discount) / 100 : price;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(finalPrice);
    };

    return (
        <header className="header-tet">

            <div className="container">
                <div className="header-content">
                    <Link href="/" className="logo">
                        <div className="logo-tet">
                            <span className="logo-text">🧧 Chợ tết</span>
                        </div>
                    </Link>

                    <div className="search-wrapper" ref={searchRef}>
                        <form onSubmit={handleSearch} className="search-box">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm Tết..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                            />
                            <button type="submit" className="search-btn">
                                <FaSearch />
                            </button>
                        </form>

                        {showSuggestions && (
                            <div className="search-suggestions">
                                {loading ? (
                                    <div className="suggestion-loading">Đang tìm kiếm...</div>
                                ) : suggestions.length > 0 ? (
                                    <>
                                        {suggestions.map((product) => (
                                            <div
                                                key={product._id}
                                                className="suggestion-item"
                                                onClick={() => handleSuggestionClick(product._id)}
                                            >
                                                <Image
                                                    src={product.images?.[0] || '/placeholder.jpg'}
                                                    alt={product.name}
                                                    width={80}
                                                    height={80}
                                                    className="suggestion-image"
                                                />
                                                <div className="suggestion-info">
                                                    <div className="suggestion-name">{product.name}</div>
                                                    <div className="suggestion-details">
                                                        <span className="suggestion-category">{typeof product.category === 'object' ? product.category?.name : product.category}</span>
                                                        <span className="suggestion-price">
                                                            {formatPrice(product.price, product.discount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="suggestion-empty">Không tìm thấy sản phẩm phù hợp</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {pathname !== '/cart' && (
                <Link href="/cart" className="floating-favorites-btn" title="Danh sách yêu thích">
                    <FaHeart />
                    {favoritesCount > 0 && (
                        <span className="favorites-badge">{favoritesCount}</span>
                    )}
                </Link>
            )}
        </header>
    );
}
