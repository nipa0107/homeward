import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddMpersonnel() {
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nametitle, setNameTitle] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState('');
  const [usernameError, setUsernameError] = useState("");
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [nametitleError, setNametitleError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const tokenExpiredAlertShown = useRef(false); 

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token); setToken(token); 
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
          console.log(data)
          setAdminData(data.data);
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    } 
  }, []); //ส่งไปครั้งเดียว



  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!username.trim()) {
      setUsernameError("กรุณากรอกเลขที่ใบประกอบวิชาชีพ");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!tel.trim()) {
      setTelError("กรุณากรอกเบอร์โทรศัพท์");
      hasError = true;
    } else if (tel.length !== 10) {
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
    if (!email.trim()) {
      setEmailError("กรุณากรอกอีเมล");
      hasError = true;
    } else {
      setEmailError("");
    }
    if (!nametitle.trim()) {
      setNametitleError("กรุณาเลือกคำนำหน้าชื่อ");
      hasError = true;
    } else {
      setNametitleError("");
    }
    if (hasError) return; 
    fetch("https://backend-deploy-render-mxok.onrender.com/addmpersonnel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        // password,
        // confirmPassword,
        email,
        tel,
        name,
        surname,
        nametitle
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addmpersonnel");
        if (data.status === "ok") {
          // console.log(username, password, confirmPassword, tel, name, nametitle);
          // window.location.href = "./allmpersonnel";
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allmpersonnel");
          },1000);
        }else {
          // เมื่อเกิดข้อผิดพลาด
          toast.error(data.error);
          // setError(data.error);
        }
      });
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
  
    const handleInputUsernameChange = (e) => {
      let input = e.target.value;
  
      // if (/[^0-9-]/.test(input)) {
      //   setUsernameError("เลขที่ใบประกอบวิชาชีพต้องเป็นตัวเลขเท่านั้น");
      //   return;
      // } else {
      //   setUsernameError("");
      // }
  
      setUsername(input.replace(/\D/g, "")); 
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
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)) {
        setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
      } else {
        setEmailError(""); 
      }
    
      setEmail(input);
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
        <div className="profile_details">
        <ul className="nav-list">
          <li>
            <a href="profile" >
              <i className="bi bi-person"></i>
              <span className="links_name" >{adminData && adminData.username}</span>
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
            <li><a>เพิ่มบุคลากร</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-1">
        <p className="title-header">เพิ่มบุคลากร</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label>เลขที่ใบประกอบวิชาชีพ<span className="required">*</span></label>
              <input
                type="text"
                className={`form-control ${usernameError ? "input-error" : ""}`}
                onChange={handleInputUsernameChange}
              />
              {usernameError && <span className="error-text">{usernameError}</span>}
            </div>

            {/* <div className="mb-1">
              <label>รหัสผ่าน<span className="required">*</span></label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>ยืนยันรหัสผ่าน<span className="required">*</span></label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div> */}
            <div className="mb-1">
              <label>อีเมล<span className="required">*</span></label>
              <input
                type="email"
                className={`form-control ${emailError ? "input-error" : ""}`}
                onChange={handleInputEmailChange}
                />
             {emailError && <span className="error-text">{emailError}</span>}
            </div>
            <div className="mb-1">
              <label>เบอร์โทรศัพท์<span className="required">*</span></label>
              <input
                type="text"
                 maxLength="10"
                className={`form-control ${telError ? "input-error" : ""}`}
                onChange={handleInputChange}
              />
              {telError && <span className="error-text">{telError}</span>}
            </div>
            <div className="mb-1">
              <label>คำนำหน้าชื่อ<span className="required">*</span></label>
              <select
                className={`form-control ${nametitleError ? "input-error" : ""}`}
                onChange={handleInputNameTitleChange}
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
            <div className="mb-1">
              <label>ชื่อ<span className="required">*</span></label>
              <input
                type="text"
                className={`form-control ${nameError ? "input-error" : ""}`}
                onChange={handleInputNameChange}              
                />
              {nameError && <span className="error-text">{nameError}</span>}
            </div>
            <div className="mb-1">
              <label>นามสกุล<span className="required">*</span></label>
              <input
                type="text"
                className={`form-control ${surnameError ? "input-error" : ""}`}
                onChange={handleInputSurnameChange}
              />
              {surnameError && <span className="error-text">{surnameError}</span>}
            </div>

            {/* แสดงข้อความ error */}
            <div className="d-grid">
              <button type="submit"className="btn btn-outline py-2">
                บันทึก
              </button>
         </div>
          </form>
          {/* <button onClick={All} className="btn btn-primary">
            Back
          </button>
          <button onClick={home} className="btn btn-primary">
            Home
          </button> */}
        </div>
      </div>
    </main>
  );
}
