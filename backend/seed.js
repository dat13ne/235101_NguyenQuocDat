const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./models/Book');

const sampleBooks = [
  {
    bookId: "B001",
    title: "Lập trình Node.js cơ bản",
    author: "Nguyễn Văn A",
    category: "Công nghệ thông tin",
    publisher: "NXB Giáo Dục",
    publishYear: 2023,
    isbn: "978-604-123",
    quantity: 50,
    description: "Sách hướng dẫn học Node.js từ con số 0."
  },
  {
    bookId: "B002",
    title: "Làm chủ ReactJS",
    author: "Trần Thị B",
    category: "Công nghệ thông tin",
    publisher: "NXB Trẻ",
    publishYear: 2024,
    isbn: "978-604-456",
    quantity: 30,
    description: "Tài liệu thực hành xây dựng giao diện với React."
  },
  {
    bookId: "B003",
    title: "Cơ sở dữ liệu MongoDB",
    author: "Lê Văn C",
    category: "Khoa học máy tính",
    publisher: "NXB Khoa Học",
    publishYear: 2022,
    isbn: "978-604-789",
    quantity: 100,
    description: "Khám phá NoSQL và MongoDB Atlas."
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Đang kết nối để thêm dữ liệu...');
    await Book.deleteMany({}); // Xóa dữ liệu cũ nếu có để tránh trùng lặp
    await Book.insertMany(sampleBooks);
    console.log('✅ Đã thêm thành công 3 quyển sách mẫu vào database!');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Lỗi:', err);
    process.exit(1);
  });
