import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

export default function UpdateEmail() {
  const location = useLocation();
  const adminData = location.state?.adminData;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  useEffect(() => {
    if (adminData) {
      setOldEmail(adminData.email);
      setUsername(adminData.username);
    }
  }, [adminData]);
  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    setErrorMessage("");
    setEmailError("");

    if (!newEmail.trim()) {
      setEmailError("กรุณากรอกอีเมลใหม่");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setErrorMessage("กรุณาใส่อีเมลที่ถูกต้อง");
      return;
    }

    fetch("https://backend-deploy-render-mxok.onrender.com/send-otp1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email: newEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/updateotp", {
            state: { username, email: newEmail, oldEmail, adminData },
          });
        } else {
          setErrorMessage(data.error || "เกิดข้อผิดพลาดในการส่ง OTP");
        }
      })
      .catch((error) => {
        setErrorMessage("เกิดข้อผิดพลาด");
        console.error("Error:", error);
      });
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value); // อัปเดตค่าอีเมลที่กรอก
    setErrorMessage(""); // ล้าง error ที่แสดงอยู่
    setEmailError(""); // ล้าง error ที่แสดงอยู่
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
              <a>เปลี่ยนอีเมล</a>
            </li>
          </ul>
        </div>

        <div className="formcontainerpf card mb-3">
          <p className="title-header">เปลี่ยนอีเมล</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>อีเมลใหม่</label>
              <input
                type="text"
                className={`form-control ${emailError ? "input-error" : ""}`}
                value={newEmail}
                onChange={handleEmailChange}
              />
              {emailError && <span className="error-text">{emailError}</span>}
            </div>
            <div className="d-grid">
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit" className="btn">
                ส่ง OTP
              </button>
              <br />
            </div>
          </form>
        </div>
      </div>

      {/* <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button> */}
    </main>
  );
}
