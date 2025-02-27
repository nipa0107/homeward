import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";

export default function EmailVerification() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = location.state?.adminData;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (adminData) {
      setEmail(adminData.email);
      setUsername(adminData.username);
    }
  }, [adminData]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('กรุณาใส่อีเมลที่ถูกต้อง');
      return;
    }
  
    fetch('http://localhost:5000/send-otp1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email }), // ส่ง username และ email
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate('/verifyotp', { state: { username, email,adminData  } }); // ส่ง username และ email ไปยังหน้า VerifyOtp
        } else {
          setErrorMessage(data.error || 'เกิดข้อผิดพลาดในการส่ง OTP');
        }
      })
      .catch((error) => {
        setErrorMessage('เกิดข้อผิดพลาด');
        console.error('Error:', error);
      });
  };
  
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <main className="body">
    <div className={`sidebar ${isActive ? "active" : ""}`}>
      <div className="logo_content">
        <div className="logo">
          <div className="logo_name">
            <img src={logow} className="logow" alt="logo"></img>
          </div>
        </div>
        <i className="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
      </div>
      <ul className="nav-list">
        <li>
          <a href="home">
            <i className="bi bi-book"></i>
            <span className="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
          </a>
        </li>
        <li>
          <a href="alluser">
            <i className="bi bi-person-plus"></i>
            <span className="links_name">จัดการข้อมูลผู้ป่วย</span>
          </a>
        </li>
        <li>
          <a href="allmpersonnel">
            <i className="bi bi-people"></i>
            <span className="links_name">จัดการข้อมูลบุคลากร</span>
          </a>
        </li>
        <li>
          <a href="allequip">
            <i className="bi bi-prescription2"></i>
            <span className="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
          </a>
        </li>
        <li>
          <a href="allsymptom">
            <i className="bi bi-bandaid"></i>
            <span className="links_name">จัดการอาการผู้ป่วย</span>
          </a>
        </li>
        <li>
          <a href="/alluserinsetting">
            <i className="bi bi-bell"></i>
            <span className="links_name">ตั้งค่าการแจ้งเตือน</span>
          </a>
        </li>
        <li>
          <a href="alladmin" onClick={() => navigate("/alladmin")}>
            <i className="bi bi-person-gear"></i>
            <span className="links_name">จัดการแอดมิน</span>
          </a>
        </li>
        <div className="nav-logout">
          <li>
            <a href="./" onClick={logOut}>
              <i
                className="bi bi-box-arrow-right"
                id="log_out"
                onClick={logOut}
              ></i>
              <span className="links_name">ออกจากระบบ</span>
            </a>
          </li>
        </div>
      </ul>
    </div>
    <div className="home_content">
      <div className="homeheader">
        <div className="header">โปรไฟล์</div>
        <div className="profile_details ">
          <ul className="nav-list">
            <li>
              <a href="profile">
                <i className="bi bi-person"></i>
                <span className="links_name">
                  {adminData && adminData.username}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="breadcrumbs">
        <ul>
          <li>
            <a href="home">
              <i className="bi bi-house-fill"></i>
            </a>
          </li>
          <li className="arrow">
            <i className="bi bi-chevron-double-right"></i>
          </li>
          <li>
            <a href="profile">โปรไฟล์</a>
          </li>
          <li className="arrow">
            <i className="bi bi-chevron-double-right"></i>
          </li>
          <li>
            <a>ยืนยันอีเมล</a>
          </li>
        </ul>
      </div>
    
      
      <div className="formcontainerpf card mb-3">
      <p className="title-header">ยืนยันอีเมล</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email">อีเมล</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="d-grid">

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="btn">
          ส่ง OTP
        </button>
        </div>

      </form>
      </div>
      </div>
    </main>
  );
}
