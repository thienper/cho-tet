# 🎊 Quà Tết - E-Commerce Tết Nguyên Đán

Nền tảng e-commerce chuyên biệt cho mùa Tết với giao diện đẹp mắt, tính năng đầy đủ và quản lý sản phẩm dễ dàng.

## ✨ Tính Năng Chính

### 👥 Người Dùng
- ✅ Xem danh sách sản phẩm với phân trang (20 sản phẩm/trang)
- ✅ Lọc sản phẩm theo danh mục
- ✅ Tìm kiếm thời gian thực với gợi ý (autocomplete) - 5 sản phẩm
- ✅ Xem chi tiết sản phẩm với thư viện hình ảnh
- ✅ Thêm sản phẩm yêu thích (sessionStorage)
- ✅ Sao chép thông tin đơn hàng
- ✅ Liên hệ qua Zalo, Facebook, Messenger

### 🛡️ Quản Trị Viên
- ✅ Đăng nhập an toàn (JWT Authentication)
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục
- ✅ Upload multiple ảnh cho sản phẩm
- ✅ Đặt ảnh chính
- ✅ Tạo slug tự động
- ✅ Xóa và sửa sản phẩm

### 🎨 Giao Diện
- ✅ Chủ đề Tết: Đỏ (#d4202c), Vàng (#f5c343)
- ✅ Hero banner với ảnh Cloudinary
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Hiệu ứng lantern animations
- ✅ Toast notifications
- ✅ Font system Next.js (Playfair Display + Inter)

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Node.js 18+
- MongoDB Atlas
- Cloudinary account

### 1. Clone và cài đặt dependencies

```bash
cd qua-tet
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc:

```env
MONGODB_URI=mongodb+srv://thienper:chithien123.@cluster0.2xqdz.mongodb.net/Quatet

CLOUD_NAME=dr7iloxoa
CLOUD_KEY=726541573622412
CLOUD_SECRET=fphMJuN_g1KGWd7SyDapDTryP0A

JWT_SECRET=your-secret-key-change-this-in-production-12345678
```

### 3. Khởi động server

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:3000

### 4. Tạo tài khoản Admin

Truy cập: http://localhost:3000/admin/setup

Tự động tạo tài khoản:
- **Email:** admin@example.com
- **Password:** admin123456

Sau đó đi đến: http://localhost:3000/admin/login

## 📁 Cấu Trúc Project

```
qua-tet/
├── app/
│   ├── admin/
│   │   ├── page.tsx          # Trang quản lý sản phẩm
│   │   ├── login/page.tsx    # Trang đăng nhập admin
│   │   └── setup/page.tsx    # Trang thiết lập ban đầu
│   ├── api/
│   │   ├── products/         # API sản phẩm (CRUD + phân trang)
│   │   ├── categories/       # API danh mục
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── upload/route.ts   # Upload ảnh lên Cloudinary
│   │   └── setup/route.ts    # Tạo admin user
│   ├── page.tsx              # Trang chủ với phân trang
│   ├── globals.css           # Styles toàn cục
│   └── layout.tsx            # Root layout
├── components/
│   ├── Header.tsx            # Header với search autocomplete
│   ├── ProductCard.tsx       # Card sản phẩm
│   ├── Footer.tsx            # Footer
│   └── ...
├── models/
│   ├── Product.ts            # Schema sản phẩm
│   ├── Category.ts           # Schema danh mục
│   └── User.ts               # Schema người dùng (admin)
├── middleware.ts             # JWT verification
└── .env                       # Biến môi trường
```

## 🔐 Xác Thực & Bảo Mật

- **JWT Token:** 7 ngày expiry
- **HTTP-only Cookies:** Lưu token an toàn
- **Password Hashing:** bcryptjs
- **Middleware Protection:** /admin routes đòi hỏi token hợp lệ
- **Quên mật khẩu:** Liên hệ Zalo 0974122850

## 📊 API Endpoints

### Sản Phẩm
- `GET /api/products` - Lấy danh sách (phân trang, tìm kiếm)
- `POST /api/products` - Thêm sản phẩm
- `GET /api/products/[id]` - Chi tiết sản phẩm
- `PUT /api/products/[id]` - Cập nhật sản phẩm
- `DELETE /api/products/[id]` - Xóa sản phẩm

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Sản phẩm/trang (mặc định: 20, max: 100)
- `search`: Tìm kiếm theo tên
- `category`: Lọc theo danh mục ID

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Xác Thực
- `POST /api/auth/login` - Đăng nhập (JWT token)
- `POST /api/auth/logout` - Đăng xuất

### Danh Mục
- `GET /api/categories` - Lấy tất cả danh mục
- `POST /api/categories` - Thêm danh mục
- `PUT /api/categories/[id]` - Cập nhật danh mục
- `DELETE /api/categories/[id]` - Xóa danh mục

### Upload
- `POST /api/upload` - Upload ảnh (Cloudinary)

## 🎨 Phân Trang

**Trang chủ:** 20 sản phẩm/trang
- Nút "Trang trước" / "Trang sau"
- Hiển thị: Trang X / Y
- Tự động reset trang 1 khi đổi danh mục

## 🔍 Tìm Kiếm Autocomplete

- **Debounce:** 300ms
- **Điều kiện:** 2+ ký tự
- **Hiển thị:** Tối đa 5 sản phẩm
- **Click-outside:** Đóng dropdown
- **Click suggestion:** Đi tới chi tiết sản phẩm
- **Submit form:** Đi tới trang tìm kiếm toàn bộ kết quả

## 📱 Responsive Design

| Device | Grid | Image | Font |
|--------|------|-------|------|
| Desktop | 4 cột | 250px | 18px |
| Tablet (768px) | 2 cột | 140px | 14px |
| Mobile (480px) | 2 cột | 130px | 13px |

## 🎯 Hạn Chế & Tương Lai

- ✅ Phân trang hoàn chỉnh
- ✅ Xác thực admin
- ✅ Quên mật khẩu (liên hệ Zalo)
- ⏳ Thanh toán online
- ⏳ Theo dõi đơn hàng
- ⏳ Email notifications

## 📞 Hỗ Trợ

- **Zalo:** 0974122850
- **Facebook:** [Link]
- **Email:** admin@example.com

---

**Tạo bởi:** Admin Tết 🎊
**Phiên bản:** 1.0.0
**Cập nhật:** Tháng 11, 2025
