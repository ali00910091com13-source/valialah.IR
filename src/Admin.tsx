import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const STORAGE_USERS_KEY = 'aavm_admin_users';
const STORAGE_INSURANCES_KEY = 'aavm_admin_insurances';

const DEFAULT_USERS = [
  { id: '1', name: 'علی رضایی', email: 'ali@example.com' },
  { id: '2', name: 'سارا محمدی', email: 'sara@example.com' },
  { id: '3', name: 'رضا کریمی', email: 'reza@example.com' },
];

const DEFAULT_INSURANCES = [
  { id: '1', name: 'تأمین اجتماعی', type: 'پایه', premium: 150000, coverage: 70, user: { name: 'علی رضایی' } },
  { id: '2', name: 'بیمه سلامت ایرانیان', type: 'پایه', premium: 120000, coverage: 60, user: { name: 'سارا محمدی' } },
  { id: '3', name: 'بیمه دانا (تکمیلی)', type: 'تکمیلی', premium: 450000, coverage: 90, user: { name: 'رضا کریمی' } },
];

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
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2000
      });
      setUsers(response.data);
    } catch {
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

  const fetchInsurances = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/insurances', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2000
      });
      setInsurances(response.data);
    } catch {
      const local = localStorage.getItem(STORAGE_INSURANCES_KEY);
      if (local) {
        try {
          setInsurances(JSON.parse(local));
        } catch {
          setInsurances(DEFAULT_INSURANCES);
        }
      } else {
        setInsurances(DEFAULT_INSURANCES);
        localStorage.setItem(STORAGE_INSURANCES_KEY, JSON.stringify(DEFAULT_INSURANCES));
      }
    }
  };

  const handleAddInsurance = async () => {
    if (!selectedUser || !insuranceName || !insuranceType || !premium || !coverage) {
      alert('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    const userObj = users.find((u) => String(u.id) === String(selectedUser));
    const newIns = {
      id: String(Date.now()),
      userId: selectedUser,
      name: insuranceName,
      type: insuranceType,
      premium: parseFloat(premium),
      coverage: parseFloat(coverage),
      user: { name: userObj ? userObj.name : 'کاربر' }
    };

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
        { headers: { Authorization: `Bearer ${token}` }, timeout: 2000 }
      );
      fetchInsurances();
    } catch {
      const updated = [newIns, ...insurances];
      setInsurances(updated);
      localStorage.setItem(STORAGE_INSURANCES_KEY, JSON.stringify(updated));
    }

    alert('بیمه با موفقیت اضافه شد!');
    setInsuranceName('');
    setInsuranceType('');
    setPremium('');
    setCoverage('');
    setSelectedUser('');
  };

  const handleDeleteInsurance = async (id: string) => {
    if (!window.confirm('آیا از حذف این بیمه اطمینان دارید؟')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/insurances/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2000
      });
      fetchInsurances();
    } catch {
      const updated = insurances.filter((item) => item.id !== id);
      setInsurances(updated);
      localStorage.setItem(STORAGE_INSURANCES_KEY, JSON.stringify(updated));
    }
    alert('بیمه با موفقیت حذف شد!');
  };

  const goBack = () => {
    window.location.hash = '#/';
  };

  if (loading && users.length === 0) {
    return <div className="admin-loading">در حال بارگذاری...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header-row">
        <h2>پنل مدیریت</h2>
        <button onClick={goBack} className="back-to-site-btn">
          بازگشت به سایت
        </button>
      </div>
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
