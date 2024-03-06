import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";

export default function UpdateOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const { state } = location;
    if (state && state.email) {
      setEmail(state.email);
    } else {
      // ถ้าไม่มี email ใน state ให้นำผู้ใช้กลับไปยังหน้า UpdateEmail
      navigate("/updateemail");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/updateemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Email updated successfully");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error updating email:", error);
      setError("เกิดข้อผิดพลาดในการอัปเดตอีเมล");
    }
  };

  const logOut = () => {
    window.localStorage.clear();
    navigate("/");
  };

  return (
    <main className="body">
      <div className="home_content">
        <div className="header">โปรไฟล์</div>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a className="bihouse">
                <i className="bi bi-house-fill" onClick={() => navigate("/home")}></i>
              </a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="#" onClick={() => navigate("/profile")}>
                โปรไฟล์
              </a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เปลี่ยนอีเมล</a>
            </li>
          </ul>
        </div>
        <div className="home_content">
          <h3>กรอกรหัสยืนยัน</h3>
          <div className="formcontainerpf card mb-3">
            <div className="mb-3">
              <label>คุณจะได้รับรหัสยืนยันตัวตนที่</label>
              <h5>{email}</h5>
            </div>
            <div className="mb-3">
              <label>กรอกรหัส OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกรหัส OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button onClick={handleSubmit} className="btn btn-outline py-2">
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
      <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button>
    </main>
  );
}
