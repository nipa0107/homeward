import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./sidebar"; 

export default function AddAdmin() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          setAdminData(data.data);
          if (
            data.data === "token expired" &&
            !tokenExpiredAlertShown.current
          ) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const usernameErrorMessage = /^[a-zA-Z0-9._-]{3,20}$/.test(username)
      ? ""
      : "ชื่อผู้ใช้ต้องประกอบด้วยตัวอักษร, ตัวเลข, จุด, ขีดล่าง, หรือ ขีดกลาง และต้องมีความยาวระหว่าง 3 ถึง 20 ตัวอักษร";

    if (!username.trim()) {
      setUsernameError("กรุณากรอกชื่อผู้ใช้");
      hasError = true;
    } else if (usernameErrorMessage) {
      setUsernameError(usernameErrorMessage);
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!name.trim()) {
      setNameError("กรุณากรอกชื่อ");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!surname.trim()) {
      setSurnameError("กรุณากรอกนามสกุล");
      hasError = true;
    } else {
      setSurnameError("");
    }
    if (!email.trim()) {
      setEmailError("กรุณากรอกอีเมล");
      hasError = true;
    } else {
      setEmailError("");
    }
    if (!password.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่าน");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("กรุณากรอกยืนยันรหัสผ่าน");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (hasError) return;
    fetch("https://backend-deploy-render-mxok.onrender.com/addadmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        name,
        surname,
        email,
        password,
        confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/alladmin");
          }, 1050);
        } else {
          // setError(data.error);
          toast.error(data.error);
        }
      });
  };

  const handleInputUsernameChange = (e) => {
    let input = e.target.value;
    setUsername(input);

    if (input.trim() === "") {
      setUsernameError("");
      return;
    }

    const usernameErrorMessage = /^[a-zA-Z0-9._-]{3,20}$/.test(input)
      ? ""
      : "ชื่อผู้ใช้ต้องเป็นตัวอักษร, ตัวเลข, จุด, ขีดล่าง, หรือ ขีดกลางและต้องมีความยาวระหว่าง 3 ถึง 20 ตัวอักษร";

    setUsernameError(usernameErrorMessage);
  };

  const handleInputNameChange = (e) => {
    const input = e.target.value;

    if (/[^ก-๙a-zA-Z\s]/.test(input)) {
      setNameError("ชื่อควรเป็นตัวอักษรเท่านั้น");
    } else {
      setNameError("");
    }

    setName(input.replace(/[^ก-๙a-zA-Z\s]/g, ""));
  };

  const handleInputSurnameChange = (e) => {
    const input = e.target.value;

    if (/[^ก-๙a-zA-Z\s]/.test(input)) {
      setSurnameError("นามสกุลควรเป็นตัวอักษรเท่านั้น");
    } else {
      setSurnameError("");
    }

    setSurname(input.replace(/[^ก-๙a-zA-Z\s]/g, ""));
  };

  const handleInputEmailChange = (e) => {
    const input = e.target.value;

    if (!input.trim()) {
      setEmailError("");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)
    ) {
      setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
    } else {
      setEmailError("");
    }

    setEmail(input);
  };
  const validatePassword = (input) => {
    if (!input.trim()) {
      setPasswordError("");
    } else if (input.length < 8) {
      setPasswordError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    } else {
      setPasswordError("");
    }
    setPassword(input);

    // ตรวจสอบรหัสผ่านและยืนยันรหัสผ่านเมื่อรหัสผ่านเปลี่ยน
    if (confirmPassword && input !== confirmPassword) {
      setConfirmPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
    } else {
      setConfirmPasswordError("");
    }
  };

  const validateConfirmPassword = (input) => {
    if (!input.trim()) {
      setConfirmPasswordError("กรุณากรอกยืนยันรหัสผ่าน");
    } else if (input !== password) {
      setConfirmPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
    } else {
      setConfirmPasswordError("");
    }
    setConfirmPassword(input);
  };

  return (
    <main className="body">
      <ToastContainer />
      <Sidebar /> 
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการแอดมิน</div>
          <div className="profile_details">
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
              <a href="alladmin">จัดการแอดมิน</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="alladmin">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลแอดมิน</a>
            </li>
          </ul>
        </div>
       
        <div className="adminall card">
        <p className="title-header">เพิ่มข้อมูลแอดมิน</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label>
                ชื่อผู้ใช้<span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${usernameError ? "input-error" : ""}`}
                onChange={handleInputUsernameChange}
              />
              {usernameError && (
                <span className="error-text">{usernameError}</span>
              )}
            </div>

            <div className="mb-1">
              <label>
                ชื่อ<span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${nameError ? "input-error" : ""}`}
                onChange={handleInputNameChange}
              />
              {nameError && <span className="error-text">{nameError}</span>}
            </div>
            <div className="mb-1">
              <label>
                นามสกุล<span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${surnameError ? "input-error" : ""}`}
                onChange={handleInputSurnameChange}
              />
              {surnameError && (
                <span className="error-text">{surnameError}</span>
              )}
            </div>

            <div className="mb-1">
              <label>
                อีเมล<span className="required">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${emailError ? "input-error" : ""}`}
                onChange={handleInputEmailChange}
              />
              {emailError && <span className="error-text">{emailError}</span>}
            </div>

            <div className="mb-1">
              <label>
                รหัสผ่าน<span className="required">*</span>
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    passwordError ? "input-error" : ""
                  }`}
                  onChange={(e) => validatePassword(e.target.value)}
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

            <div className="mb-1">
              <label>
                ยืนยันรหัสผ่าน<span className="required">*</span>
              </label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${
                    confirmPasswordError ? "input-error" : ""
                  }`}
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
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
