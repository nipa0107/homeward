import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "./sidebar";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = location.state?.adminData;

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
      setErrorMessage("กรุณาใส่อีเมลที่ถูกต้อง");
      return;
    }

    fetch("https://backend-deploy-render-mxok.onrender.com/send-otp1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email }), // ส่ง username และ email
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/verifyotp", { state: { username, email, adminData } }); // ส่ง username และ email ไปยังหน้า VerifyOtp
        } else {
          setErrorMessage(data.error || "เกิดข้อผิดพลาดในการส่ง OTP");
        }
      })
      .catch((error) => {
        setErrorMessage("เกิดข้อผิดพลาด");
        console.error("Error:", error);
      });
  };

  return (
    <main className="body">
     <Sidebar />
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
            <li className="middle">
              <a href="profile">โปรไฟล์</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="profile">...</a>
            </li>
            <li className="arrow ellipsis">
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
            <div className="mb-2">
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
