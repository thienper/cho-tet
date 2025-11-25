'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';

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

export default function AdminProducts() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: 0,
        discount: 0,
        image: '',
        images: [] as string[],
        category: '',
        stock: 0,
    });

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                console.log('Fetched products:', data.data);
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages,
            image: index === 0 && newImages.length > 0 ? newImages[0] : formData.image,
        });
        toast.success('Đã xóa ảnh!');
    };

    const setMainImage = (url: string) => {
        setFormData({ ...formData, image: url });
        toast.success('Đã đặt làm ảnh chính!');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });

                const data = await res.json();
                return data.success ? data.url : null;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            const validUrls = uploadedUrls.filter((url): url is string => url !== null);

            if (validUrls.length > 0) {
                const newImages = [...formData.images, ...validUrls];
                setFormData({
                    ...formData,
                    image: formData.image || validUrls[0],
                    images: newImages,
                });
                toast.success(`Đã tải lên ${validUrls.length} ảnh!`);
            } else {
                toast.error('Không thể tải ảnh lên!');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi tải ảnh!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug || !formData.image || !formData.category) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const url = editingProduct
                ? `/api/products/${editingProduct._id}`
                : '/api/products';

            const method = editingProduct ? 'PUT' : 'POST';

            console.log('Submitting to:', url);
            console.log('Method:', method);
            console.log('Form data:', formData);
            console.log('Editing product ID:', editingProduct?._id);

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            console.log('Response:', data);

            if (data.success) {
                toast.success(editingProduct ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
                fetchProducts();
                resetForm();
            } else {
                toast.error('Có lỗi xảy ra: ' + data.error);
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Có lỗi xảy ra khi lưu sản phẩm!');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Xóa thành công!');
                fetchProducts();
            } else {
                toast.error('Có lỗi xảy ra: ' + data.error);
            }
        } catch {
            toast.error('Có lỗi xảy ra khi xóa sản phẩm!');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);

        // Lấy category ID từ product
        let categoryId = '';
        if (product.category) {
            if (typeof product.category === 'object' && product.category._id) {
                categoryId = product.category._id;
            } else if (typeof product.category === 'string') {
                categoryId = product.category;
            }
        }

        console.log('Editing product:', product);
        console.log('Category ID extracted:', categoryId);
        console.log('Available categories:', categories);

        setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            discount: product.discount || 0,
            image: product.images?.[0] || '',
            images: product.images || [],
            category: categoryId,
            stock: product.stock,
        });
        setShowForm(true);
    };

    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return products.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        return Math.ceil(products.length / itemsPerPage);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            price: 0,
            discount: 0,
            image: '',
            images: [],
            category: '',
            stock: 0,
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

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

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="admin-content">
                <div className="admin-header">
                    <h1>Quản Lý Sản Phẩm</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            <FaPlus /> Thêm Sản Phẩm
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="modal-overlay" onClick={() => resetForm()}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>

                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-group">
                                    <label>Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const slug = name
                                                .toLowerCase()
                                                .normalize('NFD')
                                                .replace(/[\u0300-\u036f]/g, '')
                                                .replace(/đ/g, 'd')
                                                .replace(/Đ/g, 'd')
                                                .replace(/[^a-z0-9\s-]/g, '')
                                                .replace(/\s+/g, '-')
                                                .replace(/-+/g, '-')
                                                .trim();
                                            setFormData({ ...formData, name, slug });
                                        }}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Slug (đường dẫn tự động)</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        placeholder="Tự động tạo từ tên sản phẩm"
                                        readOnly
                                        className="readonly-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Mô tả *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Giá (VNĐ) *</label>
                                        <input
                                            type="number"
                                            value={formData.price || ''}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : 0 })}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Giảm giá (%)</label>
                                        <input
                                            type="number"
                                            value={formData.discount || ''}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value ? Number(e.target.value) : 0 })}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Hình ảnh * (Ảnh đầu tiên sẽ là ảnh chính)</label>
                                    <div className="image-upload-section">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            id="imageUpload"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="imageUpload" className="upload-btn">
                                            <FaUpload /> {uploading ? 'Đang tải...' : 'Chọn nhiều ảnh để tải lên'}
                                        </label>

                                        {formData.images.length > 0 && (
                                            <div className="images-gallery">
                                                {formData.images.map((img, index) => (
                                                    <div key={index} className="image-preview-item">
                                                        <Image src={img} alt={`Image ${index + 1}`} width={150} height={150} />
                                                        {index === 0 && <div className="main-badge">Ảnh chính</div>}
                                                        {formData.image === img && index !== 0 && (
                                                            <div className="main-badge">Ảnh chính</div>
                                                        )}
                                                        <div className="image-actions">
                                                            {formData.image !== img && (
                                                                <button
                                                                    type="button"
                                                                    className="set-main-btn"
                                                                    onClick={() => setMainImage(img)}
                                                                    title="Đặt làm ảnh chính"
                                                                >
                                                                    ⭐
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className="remove-image-btn"
                                                                onClick={() => removeImage(index)}
                                                                title="Xóa ảnh"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Danh mục *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Tồn kho *</label>
                                        <input
                                            type="number"
                                            value={formData.stock || ''}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value ? Number(e.target.value) : 0 })}
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={uploading}>
                                        {editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
                                    </button>
                                    <button type="button" className="btn-secondary" onClick={resetForm}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="admin-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Giảm giá</th>
                                <th>Tồn kho</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                                        Chưa có sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                getPaginatedProducts().map((product) => (
                                    <tr key={product._id}>
                                        <td>
                                            <Image src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} width={60} height={60} className="table-image" />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{typeof product.category === 'object' ? product.category.name : 'N/A'}</td>
                                        <td>{formatPrice(product.price)}</td>
                                        <td>{product.discount}%</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {products.length > 0 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                ← Trước
                            </button>
                            <div className="pagination-info">
                                Trang {currentPage} / {getTotalPages()}
                            </div>
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                                disabled={currentPage === getTotalPages()}
                            >
                                Tiếp →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
