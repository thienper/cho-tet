'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/products?category=${selectedCategory}`
        : '/api/products';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="main-content">
        <div className="hero-banner">
          <div className="container">
            <h1 className="hero-title">🎊 Chào Đón Xuân 2025 🎊</h1>
            <p className="hero-subtitle">Mua sắm hàng Tết - Rước lộc về nhà</p>
          </div>
        </div>

        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            <button
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="loading">Đang tải sản phẩm...</div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

