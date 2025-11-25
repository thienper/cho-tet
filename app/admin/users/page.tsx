'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'staff' | 'admin';
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff',
    });

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user?.role === 'admin') {
                        fetchUsers();
                    } else {
                        // Nếu không phải admin, redirect về admin dashboard
                        toast.error('Bạn không có quyền truy cập trang này');
                        router.push('/admin');
                    }
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, [router]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_token='))
                ?.split('=')[1];

            const res = await fetch('/api/users', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            } else {
                toast.error(data.error || 'Lỗi tải danh sách');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Validate password length
        if (formData.password && formData.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setSubmitting(true);

        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_token='))
                ?.split('=')[1];

            const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users';
            const method = editingUser ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(editingUser ? 'Cập nhật thành công' : 'Tạo tài khoản thành công');
                resetForm();
                fetchUsers();
            } else {
                toast.error(data.error || 'Lỗi');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Lỗi kết nối');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Bạn chắc chắn muốn xóa tài khoản này?')) return;

        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_token='))
                ?.split('=')[1];

            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Xóa tài khoản thành công');
                fetchUsers();
            } else {
                toast.error(data.error || 'Lỗi xóa');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Lỗi kết nối');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'staff' });
        setEditingUser(null);
        setShowForm(false);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setShowForm(true);
    };

    return (
        <>
            <div className="admin-header">
                <h1>Quản Lý Tài Khoản</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <FaPlus /> Thêm Tài Khoản
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => resetForm()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingUser ? 'Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}</h2>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Tên</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Nhập tên"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="Nhập email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Mật khẩu {editingUser && '(để trống nếu không đổi)'} {!editingUser && '(tối thiểu 6 ký tự)'}
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        placeholder={editingUser ? "Nhập mật khẩu mới (để trống nếu không đổi)" : "Nhập mật khẩu"}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Vai trò</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })
                                    }
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang xử lý...' : 'Lưu'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => resetForm()}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : users.length === 0 ? (
                <div className="no-products">
                    <p>Chưa có tài khoản nào</p>
                </div>
            ) : (
                <div className="admin-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            style={{
                                                background:
                                                    user.role === 'admin'
                                                        ? '#ef4444'
                                                        : '#3b82f6',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {user.role === 'admin' ? 'Admin' : 'Staff'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
