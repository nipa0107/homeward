import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Updateadmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newpasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const tokenExpiredAlertShown = useRef(false); 

  const toggleShowPassword = (setter) => setter((prev) => !prev);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token);
    if (token) {
      fetch("https://backend-deploy-render-mxok.onrender.com/profile", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          console.log(location);
          setAdminData(data.data);
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
  }, [location]);

  const Updateadmin = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!password.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่านเก่า");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!newPassword.trim()) {
      setNewPasswordError("กรุณากรอกรหัสผ่านใหม่");
      hasError = true;
    } else if (newPassword.length < 8) {
      setNewPasswordError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      hasError = true;
    } else if (newPassword === password) {
      setNewPasswordError("รหัสผ่านใหม่ต้องไม่ตรงกับรหัสผ่านเก่า");
      hasError = true;
    } else {
      setNewPasswordError("");
    }
    if (!confirmNewPassword.trim()) {
      setConfirmPasswordError("กรุณากรอกยืนยันรหัสผ่านใหม่");
      hasError = true;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError("รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (hasError) return;
    fetch(`https://backend-deploy-render-mxok.onrender.com/updateadmin/${location.state._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: location.state._id,
        password: password,
        newPassword,
        confirmNewPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
          setTimeout(() => {
            navigate("/profile");
          }, 1100);
          // window.location.href = "./profile";
        } else {
          if (data.error === "รหัสผ่านเก่าไม่ถูกต้อง") {
            setPasswordError("รหัสผ่านเก่าไม่ถูกต้อง"); // แสดงข้อความในช่องรหัสผ่านเก่า
          } else {
            setError(data.error);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // }
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

  const handlePasswordChange = (input) => {
    setPassword(input);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const validateNewPassword = (input) => {
    if (!input.trim()) {
      setNewPasswordError("กรุณากรอกรหัสผ่านใหม่");
    } else if (input.length < 8) {
      setNewPasswordError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    } else {
      setNewPasswordError("");
    }
    setNewPassword(input);

    // ตรวจสอบเฉพาะกรณีที่ confirmNewPassword มีค่า
    if (confirmNewPassword.trim() && input !== confirmNewPassword) {
      setConfirmPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
    } else {
      setConfirmPasswordError("");
    }
  };

  const validateConfirmPassword = (input) => {
    if (!input.trim()) {
      setConfirmPasswordError("กรุณากรอกยืนยันรหัสผ่าน");
    } else {
      setConfirmNewPassword(input);

      if (newPassword.trim() && input !== newPassword) {
        setConfirmPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  return (
    <main className="body">
      <ToastContainer />
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
              <span className="links_name">
                จัดการข้อมูลคู่มือการดูแลผู้ป่วย
              </span>
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
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
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
          <div className="header">เปลี่ยนรหัสผ่าน</div>
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
              <a>เปลี่ยนรหัสผ่าน</a>
            </li>
          </ul>
        </div>
        {/* <h3>เปลี่ยนรหัสผ่าน</h3> */}
        <div className="formcontainerpf">
          <div className="auth-inner">
            <div>
              รหัสผ่านเก่า
              <div className="password-input">
                <input
                  value={password}
                  className={`form-control ${
                    passwordError ? "input-error" : ""
                  }`}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  onClick={() => toggleShowPassword(setShowPassword)}
                ></i>
              </div>
            </div>
            {passwordError && (
              <span className="error-text">{passwordError}</span>
            )}

            <br />
            <div>
              รหัสผ่านใหม่
              <div className="password-input">
                <input
                  className={`form-control ${
                    newpasswordError ? "input-error" : ""
                  }`}
                  type={showNewPassword ? "text" : "password"}
                  onChange={(e) => validateNewPassword(e.target.value)}
                />
                <i
                  className={`bi ${
                    showNewPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                  onClick={() => toggleShowPassword(setShowNewPassword)}
                ></i>
              </div>
            </div>

            {newpasswordError && (
              <span className="error-text">{newpasswordError}</span>
            )}
            <br />
            <div>
              ยืนยันรหัสผ่านใหม่
              <div className="password-input">
                <input
                  className={`form-control ${
                    confirmPasswordError ? "input-error" : ""
                  }`}
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) => validateConfirmPassword(e.target.value)}
                />
                <i
                  className={`bi ${
                    showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                  onClick={() => toggleShowPassword(setShowConfirmPassword)}
                ></i>
              </div>
            </div>
            {confirmPasswordError && (
              <span className="error-text">{confirmPasswordError}</span>
            )}

          </div>
          <div className="d-grid">
            <button onClick={Updateadmin} className="btn btn-outline py-2">
              บันทึก
            </button>
          </div>
        </div>
        {/* <button onClick={profile} className="btn btn-primary">
        Back
      </button> */}
      </div>
    </main>
  );
}

export default Updateadmin;
