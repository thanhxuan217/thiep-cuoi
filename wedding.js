// Thay đường dẫn ở đây khi có ảnh mới. Hiện tất cả vị trí dùng cùng một ảnh.
window.WEDDING = {
  groom: "Thanh Xuân",
  bride: "Mọng Tiền",
  date: "2026-12-01T09:00:00+07:00",
  dateLabel: "01 . 12 . 2026",
  dateShort: "01.12.2026",
  address: "Ấp Cây Gòn, xã Phong Thạnh, tỉnh Vĩnh Long",
  venue: "Tại Tư Gia Nhà Trai",
  // Có thể thay bằng liên kết ghim vị trí chính xác từ Google Maps.
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Ấp Cây Gòn, xã Phong Thạnh, tỉnh Vĩnh Long"),
  // Để trống nếu chưa có thông tin. Trang sẽ hiện nhãn “Chưa cung cấp”.
  groomFather: "",
  groomMother: "",
  brideFather: "",
  brideMother: "",
  lunarDateLabel: "",
  reception: {
    time: "",
    dateLabel: "",
    lunarDateLabel: "",
    venue: "Tại Tư Gia Nhà Trai",
    address: "",
    mapUrl: "",
  },
  audio: "./audio/Beautiful In White.mp3",
  album: [
    "./images/301A4064.jpg",
    "./images/CS1A6171.jpg",
    "./images/CS1A6503.JPG",
    "./images/CS1A6619.JPG",
    "./images/CS1A6634.JPG",
    "./images/CS1A6770.JPG",
    "./images/CS1A6776.JPG",
    "./images/VPTT0766.JPG",
    "./images/301A4011.jpg",
    "./images/CS1A5739.jpg",
    "./images/VPTT0894.JPG"
  ],
  photos: {
    hero: "./images/CS1A6466.JPG",
    story: "./images/301A2916.jpg",
    groom: "./images/301A4596.jpg",
    bride: "./images/CS1A6509.JPG",
    closing: "./images/CS1A6509.JPG",
  },
};
