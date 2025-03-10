import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

export default function UpdateEmail() {
  const location = useLocation();
  const adminData = location.state?.adminData;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState(""); 
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
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
          navigate("/updateotp", { state: { username, email: newEmail, oldEmail,adminData  } });
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
    setNewEmail(e.target.value);  // อัปเดตค่าอีเมลที่กรอก
    setErrorMessage("");          // ล้าง error ที่แสดงอยู่
    setEmailError("");           // ล้าง error ที่แสดงอยู่
  };
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  // bi-list
  const handleToggleSidebar = () => {
    setIsActive((prevState) => !prevState);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsActive(false); // ซ่อน Sidebar เมื่อจอเล็ก
      } else {
        setIsActive(true); // แสดง Sidebar เมื่อจอใหญ่
      }
    };

    handleResize(); // เช็กขนาดจอครั้งแรก
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
            <div className="mb-3">
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
