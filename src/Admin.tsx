import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const STORAGE_USERS_KEY = 'aavm_admin_users';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
}

const DEFAULT_USERS: AdminUser[] = [
  { id: '1', name: 'علی رضایی', email: 'ali@example.com', role: 'مدیر ارشد', phone: '۰۹۱۲۳۴۵۶۷۸۹' },
  { id: '2', name: 'سارا محمدی', email: 'sara@example.com', role: 'مسئول پذیرش', phone: '۰۹۱۹۸۷۶۵۴۳۲' },
  { id: '3', name: 'رضا کریمی', email: 'reza@example.com', role: 'پشتیبانی و انفورماتیک', phone: '۰۹۱۲۱۱۱۴۴۵۵' },
];

const Admin = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('کاربر');
  const [userPhone, setUserPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2000
      });
      setUsers(response.data);
    } catch {
      // استفاده از داده‌های ذخیره شده محلی در صورت در دسترس نبودن سرور
      const local = localStorage.getItem(STORAGE_USERS_KEY);
      if (local) {
        try {
          setUsers(JSON.parse(local));
        } catch {
          setUsers(DEFAULT_USERS);
        }
      } else {
        setUsers(DEFAULT_USERS);
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert('لطفاً نام و ایمیل کاربر را وارد کنید.');
      return;
    }

    const newUser: AdminUser = {
      id: String(Date.now()),
      name: userName.trim(),
      email: userEmail.trim(),
      role: userRole,
      phone: userPhone.trim() || '—'
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/api/users',
        newUser,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 2000 }
      );
      fetchUsers();
    } catch {
      const updated = [newUser, ...users];
      setUsers(updated);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    }

    alert('کاربر جدید با موفقیت اضافه شد!');
    setUserName('');
    setUserEmail('');
    setUserRole('کاربر');
    setUserPhone('');
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2000
      });
      fetchUsers();
    } catch {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    }
    alert('کاربر با موفقیت حذف شد!');
  };

  const goBack = () => {
    window.location.hash = '#/';
  };

  if (loading && users.length === 0) {
    return <div className="admin-loading">در حال بارگذاری اطلاعات پنل...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header-row">
        <div>
          <h2>پنل مدیریت درمانگاه</h2>
          <p style={{ color: 'var(--color-inksoft)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            مدیریت دسترسی‌ها و کاربران سیستم درمانگاه
          </p>
        </div>
        <button onClick={goBack} className="back-to-site-btn">
          بازگشت به سایت
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="form-section">
        <h3>افزودن کاربر جدید</h3>
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="ایمیل"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="شماره تماس (اختیاری)"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="کاربر">کاربر عادی</option>
          <option value="پذیرش">پذیرش درمانگاه</option>
          <option value="پزشک">پزشک / کادر درمان</option>
          <option value="مدیر">مدیر سیستم</option>
        </select>
        <button onClick={handleAddUser}>افزودن کاربر</button>
      </div>

      <div className="users-list-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>لیست کاربران سیستم ({users.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>نام و نام خانوادگی</th>
              <th>ایمیل</th>
              <th>شماره تماس</th>
              <th>نقش / دسترسی</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '—'}</td>
                <td>
                  <span className="user-role-badge">
                    {user.role || 'کاربر'}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-inksoft)' }}>
                  هیچ کاربری ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
