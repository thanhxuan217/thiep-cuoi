// Thay đường dẫn ở đây khi có ảnh mới. Hiện tất cả vị trí dùng cùng một ảnh.
window.WEDDING = {
  groom: "Thanh Xuân",
  bride: "Mọng Tiền",
  date: "2026-12-01T09:00:00+07:00",
  dateLabel: "01 . 12 . 2026",
  dateShort: "01.12.2026",
  address: "Ấp Cây Gòn, xã Phong Thạnh, tỉnh Vĩnh Long",
  // Có thể thay bằng liên kết ghim vị trí chính xác từ Google Maps.
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Ấp Cây Gòn, xã Phong Thạnh, tỉnh Vĩnh Long"),
  // Để trống nếu chưa có thông tin. ?preview=1 chỉ hiện nhãn trên máy cục bộ.
  groomFather: "",
  groomMother: "",
  brideFather: "",
  brideMother: "",
  lunarDateLabel: "",
  reception: {
    time: "",
    dateLabel: "",
    lunarDateLabel: "",
    venue: "",
    address: "",
    mapUrl: "",
  },
  audio: "./audio/Beautiful In White.mp3",
  photos: {
    hero: "./images/wedding-preview.jpg",
    heroBack: "./images/wedding-preview.jpg",
    story: "./images/wedding-preview.jpg",
    groom: "./images/wedding-preview.jpg",
    bride: "./images/wedding-preview.jpg",
    album1: "./images/wedding-preview.jpg",
    album2: "./images/wedding-preview.jpg",
    album3: "./images/wedding-preview.jpg",
    album4: "./images/wedding-preview.jpg",
    closing: "./images/wedding-preview.jpg",
  },
};
