import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./sidebar";

export default function UpdateName() {
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [adminData, setAdminData] = useState("");
    const [token, setToken] = useState("");
    const [nameError, setNameError] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const tokenExpiredAlertShown = useRef(false); 

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
              console.log(data)
              setAdminData(data.data);
              setName(data.data.name);
              setSurname(data.data.surname);
              setUsername(data.data.username)
              setEmail(data.data.email)
              if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
                tokenExpiredAlertShown.current = true; 
                alert("Token expired login again");
                window.localStorage.clear();
                window.location.href = "./";
              }
            });
          }
        //   fetchData();
          }, [location]);

    //แก้ไขชื่อ
    const UpdateName = async (e) => {
      e.preventDefault();
      let hasError = false;
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

      
      if (hasError) return;
    try {
      const adminData = 
      { name,
        surname
      };
      const response = await fetch(`https://backend-deploy-render-mxok.onrender.com/updatenameadmin/${location.state._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });
  
      if (response.ok) {
        const updatedAdmin = await response.json();
        console.log("แก้ไขผู้แล้ว:", updatedAdmin);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/profile");
        },1100); 
        // window.location.href = "./profile";
      } else {
        console.error("ไม่สามารถแก้ไขผู้ใช้ได้:", response.statusText);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้:", error);
    }
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
  return (
    <main className="body">
      <ToastContainer />
      <Sidebar />
      <div className="home_content">
      <div className="homeheader">
        <div className="header">แก้ไขโปรไฟล์ผู้ใช้</div>
        <div className="profile_details ">
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
            <li><a>แก้ไขโปรไฟล์ผู้ใช้</a>
            </li>
          </ul>
        </div>
        {/* <h3>แก้ไขโปรไฟล์ผู้ใช้</h3> */}
        <div className="formcontainerpf card mb-2">
          <div className="mb-2">
          <label>ชื่อผู้ใช้</label>
          <input
              type="text"
              className="form-control gray-background"
              readOnly
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
          <div className="mb-2">
          <label>อีเมล</label>
          <input
              type="text"
              className="form-control gray-background"
              readOnly
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>      
          <div className="d-grid">
            <button
              onClick={UpdateName}
              className="btn btn-outline py-2">
              บันทึก
            </button>
          </div>
        </div>
       
      </div>
     
    </main>
  );
}
