import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import "../css/form.css"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

export default function UpdateMPersonnel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [adminData, setAdminData] = useState("");
  const { id } = location.state;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nametitle, setNameTitle] = useState("");
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [nametitleError, setNametitleError] = useState("");
  const tokenExpiredAlertShown = useRef(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/getmpersonnel/${id}`
        );
        const data = await response.json();
        setUsername(data.username);
        setPassword(data.password);
        setConfirmPassword(data.confirmPassword);
        setTel(data.tel);
        setEmail(data.email);
        setName(data.name);
        setSurname(data.surname);
        setNameTitle(data.nametitle);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
    fetchData();
  }, [id]);

  const UpdateMP = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (!tel.trim() && !tel.length !== 10) {
      setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
      hasError = true;
    } else {
      setTelError("");
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

    if (!nametitle.trim()) {
      setNametitleError("กรุณาเลือกคำนำหน้าชื่อ");
      hasError = true;
    } else {
      setNametitleError("");
    }

    if (hasError) return;
    try {
      const MPUpdate = {
        username,
        password,
        confirmPassword,
        email,
        tel,
        name,
        surname,
        nametitle,
      };
      const response = await fetch(`https://backend-deploy-render-mxok.onrender.com/updatemp/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
        },
        body: JSON.stringify(MPUpdate),
      });
      if (response.ok) {
        const UpdatedMP = await response.json();
        console.log("แก้ไขคู่มือแล้ว:", UpdatedMP);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/allmpersonnel");
        }, 1100);
      } else {
        console.error("แก้ไขไม่ได้:", response.statusText);
      }
    } catch (error) {
      console.error("การแก้ไขมีปัญหา:", error);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (/[^0-9]/.test(input)) {
      setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
    } else {
      setTelError("");
    }
    setTel(input.replace(/\D/g, ""));
  };
  const handleInputNameChange = (e) => {
    const input = e.target.value;

    // ตรวจสอบว่ามีตัวเลขหรืออักขระพิเศษหรือไม่
    if (/[^ก-๙a-zA-Z\s]/.test(input)) {
      setNameError("ชื่อควรเป็นตัวอักษรเท่านั้น");
    } else {
      setNameError("");
    }

    setName(input.replace(/[^ก-๙a-zA-Z\s]/g, "")); // กรองเฉพาะตัวอักษรและช่องว่าง
  };

  const handleInputSurnameChange = (e) => {
    const input = e.target.value;

    // ตรวจสอบว่ามีตัวเลขหรืออักขระพิเศษหรือไม่
    if (/[^ก-๙a-zA-Z\s]/.test(input)) {
      setSurnameError("นามสกุลควรเป็นตัวอักษรเท่านั้น");
    } else {
      setSurnameError(""); // ล้าง error หากไม่มีปัญหา
    }

    setSurname(input.replace(/[^ก-๙a-zA-Z\s]/g, "")); // กรองเฉพาะตัวอักษรและช่องว่าง
  };

  const handleInputNameTitleChange = (e) => {
    const input = e.target.value;
  
    if (!input.trim()) {
      setNametitleError("กรุณาเลือกคำนำหน้าชื่อ");
    } else {
      setNametitleError(""); 
    }
  
    setNameTitle(input);
  };

  return (
    <main className="body">
      <ToastContainer />
      <Sidebar />
      <div className="home_content">
      <div className="homeheader">
        <div className="header">จัดการข้อมูลบุคลากร</div>
        <div className="profile_details ">
        <ul className="nav-list">
          <li>
            <a href="profile">
              <i className="bi bi-person"></i>
              <span className="links_name">{adminData && adminData.username}</span>
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
              <a href="allmpersonnel">จัดการข้อมูลบุคลากร</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="allmpersonnel">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลบุคลากร</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-1">
        <p className="title-header">แก้ไขข้อมูลบุคลากร</p>
          <div className="mb-1">
            <label>เลขที่ใบประกอบวิชาชีพ</label>
            <input
              type="text"
              value={username}
              readOnly
              className="form-control gray-background"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>อีเมล</label>
            <input
              value={email}
              type="email"
              readOnly
              className="form-control gray-background"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>เบอร์โทรศัพท์</label>
            <input
              value={tel}
              type="text"
               maxLength="10"
               className={`form-control ${telError ? "input-error" : ""}`}
               onChange={handleInputChange}
               />
            {telError && <span className="error-text">{telError}</span>}

          </div>
          <div className="mb-1">
            <label>คำนำหน้าชื่อ</label>
            <select
                className={`form-control ${nametitleError ? "input-error" : ""}`}
              value={nametitle}
              onChange={handleInputNameTitleChange}
              // onChange={(e) => setNameTitle(e.target.value)}
            >
              <option value="">กรุณาเลือก</option>
              <option value="แพทย์หญิง">แพทย์หญิง</option>
              <option value="นายแพทย์">นายแพทย์</option>
              <option value="พยาบาลวิชาชีพ">พยาบาลวิชาชีพ</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
            </select>
            {nametitleError && <span className="error-text">{nametitleError}</span>}

          </div>
          <div className="mb-2">
            <label>ชื่อ</label>
            <input
              type="text"
              value={name}
              className={`form-control ${nameError ? "input-error" : ""}`}
              onChange={handleInputNameChange}
            />
            {nameError && <span className="error-text">{nameError}</span>}
            </div>
          <div className="mb-2">
            <label>นามสกุล</label>
            <input
              type="text"
              value={surname}
              className={`form-control ${surnameError ? "input-error" : ""}`}
              onChange={handleInputSurnameChange}
            />
            {surnameError && <span className="error-text">{surnameError}</span>}

          </div>
          <div className="d-grid">
            <button
              onClick={UpdateMP}
              type="submit"
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>

      <div></div>
    </main>
  );
}
