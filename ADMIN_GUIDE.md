# Hướng Dẫn Sử Dụng Trang Admin

## 🎯 Truy cập Admin Panel

**URL:** http://localhost:3000/admin

## 📋 Quản Lý Danh Mục

### Thêm Danh Mục Mới:
1. Truy cập: http://localhost:3000/admin/categories
2. Click nút "➕ Thêm Danh Mục"
3. Nhập thông tin:
   - **Tên danh mục** (bắt buộc): Ví dụ "Bánh Tết"
   - **Slug** (bắt buộc): Ví dụ "banh-tet" (không dấu, viết thường, dùng dấu gạch ngang)
   - **Mô tả** (tùy chọn): Mô tả về danh mục
4. Click "Thêm Mới"

### Sửa Danh Mục:
1. Click vào icon ✏️ (Edit) ở hàng cần sửa
2. Cập nhật thông tin
3. Click "Cập Nhật"

### Xóa Danh Mục:
1. Click vào icon 🗑️ (Delete) ở hàng cần xóa
2. Xác nhận xóa

## 🛍️ Quản Lý Sản Phẩm

### Thêm Sản Phẩm Mới:
1. Truy cập: http://localhost:3000/admin
2. Click nút "➕ Thêm Sản Phẩm"
3. Điền thông tin:
   - **Tên sản phẩm** (bắt buộc)
   - **Slug** (bắt buộc): Ví dụ "banh-tet-dac-san"
   - **Mô tả** (bắt buộc): Mô tả chi tiết sản phẩm
   - **Giá** (bắt buộc): Nhập giá bằng VNĐ
   - **Giảm giá**: Nhập % giảm giá (0-100)
   - **Hình ảnh** (bắt buộc):
     * **Cách 1:** Click "Chọn ảnh tải lên" → Chọn file từ máy → Ảnh sẽ tự động upload lên Cloudinary
     * **Cách 2:** Nhập URL ảnh trực tiếp vào ô "Hoặc nhập URL ảnh"
   - **Danh mục** (bắt buộc): Chọn từ dropdown
   - **Tồn kho** (bắt buộc): Nhập số lượng
4. Click "Thêm Mới"

### Sửa Sản Phẩm:
1. Click vào icon ✏️ (Edit)
2. Cập nhật thông tin cần thiết
3. Có thể upload ảnh mới hoặc giữ nguyên ảnh cũ
4. Click "Cập Nhật"

### Xóa Sản Phẩm:
1. Click vào icon 🗑️ (Delete)
2. Xác nhận xóa

## 📸 Upload Ảnh lên Cloudinary

### Tự động:
- Khi chọn file ảnh từ máy, hệ thống sẽ tự động upload lên Cloudinary
- Ảnh được lưu trong folder "tet-market"
- URL ảnh sẽ tự động điền vào form

### Thủ công:
- Có thể nhập URL ảnh từ bất kỳ nguồn nào vào ô "Hoặc nhập URL ảnh"

### Xóa ảnh đã chọn:
- Click vào nút "×" ở góc ảnh preview để xóa và chọn lại

## ⚠️ Lưu ý:

1. **Phải tạo danh mục trước** khi thêm sản phẩm
2. **Slug phải unique** (không trùng lặp)
3. **Slug nên viết không dấu**, chữ thường, dùng dấu gạch ngang
4. Các trường có dấu * là **bắt buộc**
5. Upload ảnh có thể mất vài giây, đợi thông báo "Tải ảnh lên thành công!"

## 🔧 Khắc phục lỗi:

### Lỗi không thêm/sửa được:
- Kiểm tra đã điền đủ các trường bắt buộc chưa
- Kiểm tra slug có bị trùng không
- Kiểm tra kết nối MongoDB

### Lỗi upload ảnh:
- Kiểm tra file ảnh có hợp lệ không (jpg, png, webp...)
- Kiểm tra kết nối internet
- Kiểm tra cấu hình Cloudinary trong .env.local

### Lỗi không hiển thị danh mục trong dropdown:
- Vào trang Quản lý danh mục tạo danh mục trước
- Refresh lại trang

## 🎊 Tips:

- Dùng ảnh chất lượng cao cho sản phẩm
- Viết mô tả chi tiết để khách hàng hiểu rõ sản phẩm
- Đặt giá hợp lý và giảm giá hấp dẫn
- Cập nhật tồn kho thường xuyên
- Đặt tên slug rõ ràng, dễ nhớ cho SEO

---

🎉 **Chúc bạn quản lý shop thành công!**
