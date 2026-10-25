# Thiệp cưới Thanh Xuân & Mọng Tiền

Trang HTML, CSS và JavaScript tĩnh. Không cần cài thư viện hoặc chạy build để đưa lên GitHub Pages.

- Lễ cưới: 09:00, thứ Ba, ngày 01/12/2026 (giờ Việt Nam).
- Địa điểm: Ấp Cây Gòn, xã Phong Thạnh, tỉnh Vĩnh Long.
- Thiệp dọc rộng tối đa 480px. Nền hồng tím nhạt, hoa PNG, ảnh Polaroid trượt lên từ phong bì trong khoảng 1,8 giây.
- Nhạc bắt đầu khi khách bấm mở thiệp. Nút nốt nhạc dùng để bật hoặc tắt.
- Album có thể phóng to, chuyển ảnh bằng nút hoặc phím mũi tên. Nhấn Escape để đóng.
- Không có phần xác nhận tham dự.
- Thiết bị bật `prefers-reduced-motion` xem ngay thiệp đã mở. Nhạc chỉ phát sau thao tác của khách. Nội dung vẫn đọc được khi JavaScript bị tắt.

## Xem trên máy

Mở `index.html` bằng trình duyệt. Hoặc chạy từ thư mục dự án:

```powershell
npx --yes http-server . -p 4173 -c-1
```

Sau đó mở `http://localhost:4173`.

Dùng `http://localhost:4173/?preview=1` để xem các mục chưa có dữ liệu. Chế độ này chỉ hoạt động trên máy cục bộ. Bản công khai ẩn các dòng trống và ẩn thẻ tiệc nếu chưa có `time` hoặc `address`.

## Thay ảnh và nhạc

1. Thêm ảnh mới vào `images/`.
2. Mở `wedding.js`. Sửa đường dẫn trong `photos` theo từng vị trí: `hero`, `heroBack`, `story`, `groom`, `bride`, `album1` đến `album4`, `closing`.
3. Nếu thay nhạc, thêm tệp vào `audio/` rồi sửa `audio` trong `wedding.js`.
4. Giữ đường dẫn tương đối, ví dụ `./images/anh-cuoi.jpg`. Tên tệp phải đúng chữ hoa và chữ thường.

Tất cả vị trí hiện dùng cùng một ảnh: `images/wedding-preview.jpg`. Đây là bản giảm dung lượng từ `images/CS1A6770.JPG` (11,6 MB còn khoảng 387 KB). Ảnh gốc được giữ nguyên. Muốn đổi đồng loạt, có thể thay trực tiếp `wedding-preview.jpg` bằng ảnh mới cùng tên.

Ảnh chân dung đang được cắt bằng CSS từ ảnh đôi. Khi dùng ảnh riêng, chỉnh `.portrait-photo img`, `.groom-photo img` và `.bride-photo img` trong `styles.css` để thay cách cắt ảnh. Các vị trí còn lại dùng `object-fit: cover`.

Tên, địa chỉ, nhạc, liên kết bản đồ và ảnh nằm trong `wedding.js`. Thêm tên bố mẹ tại `groomFather`, `groomMother`, `brideFather`, `brideMother`. Điền tiệc thân mật trong `reception`; nhãn âm lịch tại `lunarDateLabel`. Dữ liệu mới mặc định để trống.

Nếu đổi ngày cưới, sửa `date`, `dateLabel`, `dateShort`. Giữ múi giờ `+07:00`. JavaScript lấy ngày, giờ và thứ từ `date`. Sửa cả nội dung dự phòng, tiêu đề và mô tả trong `index.html` để người tắt JavaScript vẫn nhận đúng thông tin.

Nút bản đồ hiện mở kết quả tìm kiếm theo địa chỉ bạn cung cấp. Khi có ghim vị trí chính xác, thay `mapUrl` trong `wedding.js`.

Hoa trang trí dùng `images/flower.png`. Font Barlow Condensed, Great Vibes và Playfair Display tải từ Google Fonts. Trình duyệt dùng font dự phòng nếu không tải được font.

## Đưa lên GitHub Pages

1. Đẩy các tệp `index.html`, `styles.css`, `app.js`, `wedding.js`, `.nojekyll` và các thư mục `assets/`, `images/`, `audio/` lên nhánh dùng để xuất bản.
2. Trong repository, mở **Settings → Pages**.
3. Chọn **Source → Deploy from a branch**.
4. Chọn nhánh chứa trang, chọn thư mục **/(root)** rồi bấm **Save**.
5. Chờ lần triển khai hoàn tất. Mở địa chỉ mà GitHub Pages hiển thị.

Tất cả tài nguyên của trang dùng đường dẫn tương đối để chạy được tại `https://<username>.github.io/<repository>/`. Không cần đưa thư mục `ảnh mẫu/` hoặc ảnh gốc dung lượng lớn lên để trang hoạt động.

Tham khảo: [Cấu hình nguồn xuất bản GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
