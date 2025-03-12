import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";
export default function AddSymptom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
  const [nameError, setNameError] = useState("");
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
  }, []); //ส่งไปครั้งเดียว

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!name.trim()) {
      setNameError("กรุณากรอกชื่ออาการ");
      hasError = true;
    } else {
      setNameError("");
    }

    if (hasError) return;

    fetch("https://backend-deploy-render-mxok.onrender.com/addsymptom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allsymptom");
          }, 1000);
        } else if (data.error) {
          toast.error(data.error); 
        }
      });
  };

  const handleInputNameChange = (e) => {
    const input = e.target.value;
    if (!input.trim()) {
      setNameError("");
    } else {
      setNameError("");
    }
    setName(input);
  };

  return (
    <main className="body">
      <ToastContainer />
      <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการอาการผู้ป่วย</div>
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
              <a href="allsymptom">จัดการอาการผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="allsymptom">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มอาการผู้ป่วย</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-1">
        <p className="title-header">เพิ่มอาการผู้ป่วย</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label>
                ชื่ออาการ<span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${nameError ? "input-error" : ""}`}
                onChange={handleInputNameChange}
              />
              {nameError && <span className="error-text">{nameError}</span>}
            </div>
            {/* {validationMessage && (
              <div style={{ color: "red" }}>{validationMessage}</div>
            )} */}
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
