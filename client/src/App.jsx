import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Users, Mail, FileText, User as UserIcon } from 'lucide-react';
import './index.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    user: '',
    emailid: '',
    description: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        user: user.user,
        emailid: user.emailid,
        description: user.description
      });
    } else {
      setEditingUser(null);
      setFormData({ user: '', emailid: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser._id}`, formData);
      } else {
        await axios.post(`${API_URL}/`, formData);
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={20} />
          Add User
        </button>
      </header>

      {users.length === 0 ? (
        <div className="empty-state glass-panel">
          <Users />
          <h2>No users found</h2>
          <p>Get started by adding a new user to your system.</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={20} />
            Add First User
          </button>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((u) => (
            <div key={u._id} className="user-card glass-panel">
              <div className="user-card-header">
                <div className="user-info">
                  <h3>{u.user}</h3>
                  <p><Mail size={14} /> {u.emailid}</p>
                </div>
              </div>
              <p className="user-desc">
                <FileText size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                {u.description}
              </p>
              <div className="card-actions">
                <button 
                  className="btn-icon" 
                  onClick={() => openModal(u)}
                  title="Edit User"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  className="btn-icon" 
                  onClick={() => handleDelete(u._id)}
                  title="Delete User"
                >
                  <Trash2 size={18} color="var(--danger-color)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="user">Name</label>
                <input
                  type="text"
                  id="user"
                  name="user"
                  className="form-control"
                  value={formData.user}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="form-group">
                <label htmlFor="emailid">Email</label>
                <input
                  type="email"
                  id="emailid"
                  name="emailid"
                  className="form-control"
                  value={formData.emailid}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Role, department, or brief bio..."
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
