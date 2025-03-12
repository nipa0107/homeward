import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import "../css/form.css"
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

export default function UpdateSymptom() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [adminData, setAdminData] = useState("");
  const { id } = location.state;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const tokenExpiredAlertShown = useRef(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend-deploy-render-mxok.onrender.com/getsymptom/${id}`);
        const data = await response.json();
        setName(data.name);
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

  const UpdateSymptom = async () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError("กรุณากรอกชื่ออาการ");
      hasError = true;
    } else {
      setNameError("");
    }

    if (hasError) return;

    try {
      const SymptomUpdate = {
        name,
      };
      const response = await fetch(
        `https://backend-deploy-render-mxok.onrender.com/updatesymptom/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
          },
          body: JSON.stringify(SymptomUpdate),
        }
      );
      const UpdateSymptom = await response.json();
      if (response.ok && UpdateSymptom.status === "ok") {
        console.log("แก้ไขอาการแล้ว:", UpdateSymptom);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/allsymptom");
        }, 1100);
      } else {
        if (UpdateSymptom.error) {
          toast.error(UpdateSymptom.error); // แสดงข้อความจาก Backend
        } else {
          toast.error("ไม่สามารถแก้ไขอาการได้");
        }
        console.error(
          "แก้ไขไม่ได้:",
          UpdateSymptom.error || response.statusText
        );
      }
    } catch (error) {
      console.error("การแก้ไขมีปัญหา:", error);
    }
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
              <a href="allequip">
                จัดการอุปกรณ์ทางการแพทย์
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="allequip">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขอาการผู้ป่วย</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-1">
        <p className="title-header">แก้ไขอาการผู้ป่วย</p>
          <div className="mb-1">
            <label>ชื่ออาการ</label>
            <input
              type="text"
              value={name}
              className={`form-control ${nameError ? "input-error" : ""}`}
              onChange={handleInputNameChange}
            />
           {nameError && <span className="error-text">{nameError}</span>}

          </div>

          <div className="d-grid">
            <button
              onClick={UpdateSymptom}
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
