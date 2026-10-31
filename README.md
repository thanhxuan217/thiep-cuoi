# Thiệp cưới Thanh Xuân & Mọng Tiền

Trang HTML, CSS và JavaScript tĩnh. Không cần cài thư viện hoặc chạy build để đưa lên GitHub Pages.

- Lễ cưới: 09:00, thứ Ba, ngày 01/12/2026 (giờ Việt Nam).
- Địa điểm: Ấp Cây Gòn, xã Phong Thạnh, tỉnh Vĩnh Long.
- Thiệp dọc rộng tối đa 480px. Màn hình đầu có nền trắng hồng, chữ viết tay “Save the Date”, tên cô dâu chú rể, một ảnh đôi và ngày cưới. Không còn phong bì hoặc nút mở thiệp.
- Khi tải trang, mây hồng tự vén sang hai bên trong khoảng 3 giây. Hiệu ứng chỉ chạy một lần mỗi lần tải trang, không chặn thao tác cuộn hoặc bấm.
- Nhấn nút nốt nhạc để bật hoặc tắt nhạc nền.
- Album có thể phóng to, chuyển ảnh bằng nút hoặc phím mũi tên. Nhấn Escape để đóng.
- Không có phần lời chúc hoặc xác nhận tham dự, theo yêu cầu.
- Thiết bị bật `prefers-reduced-motion` hiển thị ngay nội dung, không chạy hiệu ứng mây. Nội dung vẫn đọc được khi JavaScript bị tắt.

## Xem trên máy

Mở `index.html` bằng trình duyệt. Hoặc chạy từ thư mục dự án:

```powershell
npx --yes http-server . -p 4173 -c-1
```

Sau đó mở `http://localhost:4173`.

Các mục chưa có dữ liệu hiện nhãn “Chưa cung cấp”, gồm tên bố mẹ, tên địa điểm, ngày âm lịch và thông tin tiệc thân mật. Liên kết bản đồ của tiệc chỉ hiện khi đã điền `reception.mapUrl`.

## Thay ảnh và nhạc

Để giảm dung lượng ảnh, đặt ảnh gốc vào `images_backup/`, cài Pillow và chạy:

```powershell
python -m pip install Pillow
python scripts/compress_images.py
```

Script ghi ảnh vào `images/`, giữ nguyên tên tệp (kể cả chữ hoa/thường) và thư mục con. Cạnh dài tối đa 2.048 px, chất lượng JPEG 80. PNG giữ nền trong suốt. Ảnh gốc không bị sửa; `images_backup/` được bỏ qua khi đưa lên GitHub.

1. Thêm ảnh mới vào `images/`.
2. Mở `wedding.js`. Sửa đường dẫn trong `photos` theo từng vị trí: `hero`, `story`, `groom`, `bride`, `closing`. Với album, thêm hoặc xóa đường dẫn trong mảng `album` (cùng cấp với `photos`). Trang tự tạo ô ảnh theo đúng thứ tự của mảng, không cần sửa `index.html`. Mảng rỗng sẽ ẩn phần album. Album cần JavaScript để hiển thị.
3. Nếu thay nhạc, thêm tệp vào `audio/` rồi sửa `audio` trong `wedding.js`.
4. Giữ đường dẫn tương đối, ví dụ `./images/anh-cuoi.jpg`. Tên tệp phải đúng chữ hoa và chữ thường.

Ví dụ cấu hình album trong `window.WEDDING`:

```js
album: [
  "./images/301A4064.jpg",
  "./images/301A3479.jpg",
  "./images/301A3519.jpg",
],
```

Ảnh chân dung đang được cắt bằng CSS từ ảnh đôi. Khi dùng ảnh riêng, chỉnh `.portrait-photo img`, `.groom-photo img` và `.bride-photo img` trong `styles.css` để thay cách cắt ảnh. Album hiển thị đúng tỷ lệ gốc; các khung ảnh còn lại dùng `object-fit: cover`.

Tên, địa chỉ, nhạc, liên kết bản đồ và ảnh nằm trong `wedding.js`. Thêm tên bố mẹ tại `groomFather`, `groomMother`, `brideFather`, `brideMother`. Điền tên địa điểm tại `venue`, tiệc thân mật trong `reception`, nhãn âm lịch tại `lunarDateLabel`. Dữ liệu mới mặc định để trống.

Nếu đổi ngày cưới, sửa `date`, `dateLabel`, `dateShort`. Giữ múi giờ `+07:00`. JavaScript lấy ngày, giờ và thứ từ `date`. Sửa cả nội dung dự phòng, tiêu đề và mô tả trong `index.html` để người tắt JavaScript vẫn nhận đúng thông tin.

Nút bản đồ hiện mở kết quả tìm kiếm theo địa chỉ bạn cung cấp. Khi có ghim vị trí chính xác, thay `mapUrl` trong `wedding.js`.

Màn hình đầu giữ ảnh gốc tại `photos.hero`. Mây hồng được vẽ bằng CSS. Font WindSong dùng cho “Save the Date”; Great Vibes dùng cho tên; Playfair Display dùng cho ngày cưới. Các font này cùng Barlow Condensed và Be Vietnam Pro tải từ Google Fonts. Trình duyệt dùng font dự phòng nếu không tải được font.

## Đưa lên GitHub Pages

1. Đẩy các tệp `index.html`, `styles.css`, `app.js`, `wedding.js`, `.nojekyll` và các thư mục `assets/`, `images/`, `audio/` lên nhánh dùng để xuất bản.
2. Trong repository, mở **Settings → Pages**.
3. Chọn **Source → Deploy from a branch**.
4. Chọn nhánh chứa trang, chọn thư mục **/(root)** rồi bấm **Save**.
5. Chờ lần triển khai hoàn tất. Mở địa chỉ mà GitHub Pages hiển thị.

Tất cả tài nguyên của trang dùng đường dẫn tương đối để chạy được tại `https://<username>.github.io/<repository>/`. Không cần đưa thư mục `ảnh mẫu/` hoặc ảnh gốc dung lượng lớn lên để trang hoạt động.

Tham khảo: [Cấu hình nguồn xuất bản GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
