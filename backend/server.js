const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Book = require('./models/Book');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ket noi MongoDB thanh cong'))
  .catch(err => console.log('❌ Loi ket noi MongoDB:', err));

// 0. Endpoint kiem tra trang thai Server (Yeu cau 3 - Cau 8)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

app.get('/', (req, res) => {
  res.send('Backend Book Management API is Live');
});

// 1. Lấy danh sách sách + Tìm kiếm (Yêu cầu 1 & 6)
app.get('/api/books', async (req, res) => {
  try {
    const search = req.query.search || req.query.title;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { bookId: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Xem chi tiết 1 quyển sách (Yêu cầu 2)
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Thêm sách mới (Yêu cầu 3)
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Cập nhật thông tin sách (Yêu cầu 4)
app.put('/api/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Xóa sách (Yêu cầu 5)
app.delete('/api/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sách thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server dang chay tai port ${PORT}`));