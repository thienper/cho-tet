'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });

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
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const url = editingCategory
                ? `/api/categories/${editingCategory._id}`
                : '/api/categories';

            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(editingCategory ? 'Cập nhật thành công!' : 'Thêm danh mục thành công!');
                fetchCategories();
                resetForm();
            } else {
                toast.error('Có lỗi xảy ra: ' + data.error);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lưu danh mục!');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Xóa thành công!');
                fetchCategories();
            } else {
                toast.error('Có lỗi xảy ra: ' + data.error);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa danh mục!');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
        });
        setEditingCategory(null);
        setShowForm(false);
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="admin-content">
                <div className="admin-header">
                    <h1>Quản Lý Danh Mục</h1>
                    <button
                        className="btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus /> Thêm Danh Mục
                    </button>
                </div>

                {showForm && (
                    <div className="modal-overlay" onClick={() => resetForm()}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h2>

                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-group">
                                    <label>Tên danh mục *</label>
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
                                        placeholder="Tự động tạo từ tên danh mục"
                                        readOnly
                                        className="readonly-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        {editingCategory ? 'Cập Nhật' : 'Thêm Mới'}
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
                                <th>Tên danh mục</th>
                                <th>Slug</th>
                                <th>Mô tả</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                                        Chưa có danh mục nào
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category._id}>
                                        <td>{category.name}</td>
                                        <td>{category.slug}</td>
                                        <td>{category.description || '-'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(category._id)}
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
                </div>
            </div>
        </>
    );
}
