import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [currentBook, setCurrentBook] = useState({
    bookId: '', title: '', author: '', category: '', 
    publisher: '', publishYear: '', isbn: '', quantity: '', description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sách
  const fetchBooks = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/books${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      setBooks(response.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách sách. Hãy kiểm tra kết nối Backend!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Xóa sách
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      try {
        await axios.delete(`${API_URL}/books/${id}`);
        alert("Xóa sách thành công!");
        fetchBooks(searchTerm);
      } catch (err) {
        setError('Lỗi khi xóa sách.');
      }
    }
  };

  // Xử lý Form
  const handleChange = (e) => {
    setCurrentBook({ ...currentBook, [e.target.name]: e.target.value });
  };

  // Lưu sách (Thêm/Sửa)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/books/${editingId}`, currentBook);
        alert("Cập nhật sách thành công!");
      } else {
        await axios.post(`${API_URL}/books`, currentBook);
        alert("Thêm sách mới thành công!");
      }
      resetForm();
      fetchBooks(searchTerm);
    } catch (err) {
      setError('Lỗi khi lưu sách. Kiểm tra lại dữ liệu nhập vào!');
    }
  };

  const handleEdit = (book) => {
    setCurrentBook(book);
    setIsEditing(true);
    setEditingId(book._id);
  };

  const resetForm = () => {
    setCurrentBook({ bookId: '', title: '', author: '', category: '', publisher: '', publishYear: '', isbn: '', quantity: '', description: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div style={{ padding: '25px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>📚 Hệ Thống Quản Lý Sách (React Frontend)</h2>
      
      {loading && <p style={{ color: 'blue' }}>⏳ Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>❌ {error}</p>}

      {/* Tìm kiếm */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Nhập tên sách, tác giả hoặc mã sách..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={() => fetchBooks(searchTerm)} style={{ padding: '8px 15px', cursor: 'pointer' }}>Tìm kiếm</button>
        <button onClick={() => { setSearchTerm(''); fetchBooks(''); }} style={{ padding: '8px 15px', cursor: 'pointer' }}>Hủy tìm</button>
      </div>

      {/* Form Thêm/Sửa */}
      <form onSubmit={handleSave} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginBottom: '25px', backgroundColor: '#f9f9f9' }}>
        <h3>{isEditing ? '✏️ Cập nhật thông tin sách' : '➕ Thêm sách mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <input name="bookId" placeholder="Mã sách (*)" value={currentBook.bookId} onChange={handleChange} required style={{ padding: '8px' }} disabled={isEditing} />
          <input name="title" placeholder="Tên sách (*)" value={currentBook.title} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="author" placeholder="Tác giả (*)" value={currentBook.author} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="category" placeholder="Thể loại" value={currentBook.category || ''} onChange={handleChange} style={{ padding: '8px' }} />
          <input name="publisher" placeholder="Nhà xuất bản" value={currentBook.publisher || ''} onChange={handleChange} style={{ padding: '8px' }} />
          <input name="quantity" placeholder="Số lượng" type="number" value={currentBook.quantity || ''} onChange={handleChange} style={{ padding: '8px' }} />
        </div>
        <div style={{ marginTop: '15px' }}>
          <button type="submit" style={{ padding: '8px 20px', backgroundColor: isEditing ? '#2196F3' : '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '10px' }}>
            {isEditing ? 'Lưu cập nhật' : 'Thêm sách'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} style={{ padding: '8px 15px', cursor: 'pointer' }}>
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      {/* Bảng dữ liệu */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#e0e0e0' }}>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book._id}>
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category || 'N/A'}</td>
                <td>{book.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(book)} style={{ marginRight: '8px', padding: '4px 10px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer' }}>Sửa</button>
                  <button onClick={() => handleDelete(book._id)} style={{ padding: '4px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu sách.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;