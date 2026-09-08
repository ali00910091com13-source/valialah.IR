import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [insuranceName, setInsuranceName] = useState<string>('');
  const [insuranceType, setInsuranceType] = useState<string>('');
  const [premium, setPremium] = useState<string>('');
  const [coverage, setCoverage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchInsurances();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('خطا در بارگذاری کاربران');
    }
  };

  const fetchInsurances = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/insurances', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsurances(response.data);
    } catch (err) {
      console.error('Error fetching insurances:', err);
      setError('خطا در بارگذاری بیمه‌ها');
    }
  };

  const handleAddInsurance = async () => {
    if (!selectedUser || !insuranceName || !insuranceType || !premium || !coverage) {
      alert('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/api/insurances',
        {
          userId: selectedUser,
          name: insuranceName,
          type: insuranceType,
          premium: parseFloat(premium),
          coverage: parseFloat(coverage)
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('بیمه با موفقیت اضافه شد!');
      setInsuranceName('');
      setInsuranceType('');
      setPremium('');
      setCoverage('');
      setSelectedUser('');
      fetchInsurances(); // به‌روزرسانی لیست بیمه‌ها
    } catch (err) {
      console.error('Error adding insurance:', err);
      alert('خطا در افزودن بیمه');
    }
  };

  const handleDeleteInsurance = async (id: string) => {
    if (!window.confirm('آیا از حذف این بیمه اطمینان دارید؟')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/insurances/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('بیمه با موفقیت حذف شد!');
      fetchInsurances(); // به‌روزرسانی لیست بیمه‌ها
    } catch (err) {
      console.error('Error deleting insurance:', err);
      alert('خطا در حذف بیمه');
    }
  };

  if (loading && users.length === 0) {
    return <div className="admin-loading">در حال بارگذاری...</div>;
  }

  return (
    <div className="admin-container">
      <h2>پنل مدیریت</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-section">
        <h3>افزودن بیمه جدید</h3>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">انتخاب کاربر</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="نام بیمه"
          value={insuranceName}
          onChange={(e) => setInsuranceName(e.target.value)}
        />
        <input
          type="text"
          placeholder="نوع بیمه"
          value={insuranceType}
          onChange={(e) => setInsuranceType(e.target.value)}
        />
        <input
          type="number"
          placeholder="حق بیمه"
          value={premium}
          onChange={(e) => setPremium(e.target.value)}
        />
        <input
          type="number"
          placeholder="میزان پوشش"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
        />
        <button onClick={handleAddInsurance}>افزودن بیمه</button>
      </div>

      <div className="insurance-list">
        <h3>لیست بیمه‌ها</h3>
        <table>
          <thead>
            <tr>
              <th>نام بیمه</th>
              <th>نوع بیمه</th>
              <th>حق بیمه</th>
              <th>پوشش</th>
              <th>کاربر</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {insurances.map((insurance) => (
              <tr key={insurance.id}>
                <td>{insurance.name}</td>
                <td>{insurance.type}</td>
                <td>{insurance.premium}</td>
                <td>{insurance.coverage}</td>
                <td>{insurance.user?.name || 'ناشناس'}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteInsurance(insurance.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
