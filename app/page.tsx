'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { IProduct } from '@/models/Product';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    // After products update, scroll to products grid for better UX
    if (!loading) {
      const el = document.getElementById('products-grid');
      if (el) {
        const rect = el.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        // Adjust for fixed header approximate height
        const offset = 80;
        window.scrollTo({ top: Math.max(absoluteTop - offset, 0), behavior: 'smooth' });
      }
    }
  }, [selectedCategory, currentPage, loading]);

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
      let url = `/api/products?page=${currentPage}&limit=20`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset về trang 1 khi đổi category
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <Header />

      <main className="main-content">
        <div className="hero-banner">
          <div className="container">
            <h1 className="hero-title">🎊 Chào Đón Xuân 2026 🎊</h1>
            <p className="hero-subtitle">Mua sắm hàng Tết - Rước lộc về nhà</p>
          </div>
        </div>

        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            <button
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat._id)}
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
            <>
              <div className="products-grid" id="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product as IProduct & { category?: { name: string } | string }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    ← Trang trước
                  </button>

                  <div className="pagination-info">
                    Trang {currentPage} / {totalPages}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Trang sau →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

