import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddEquip({ }) {
  const navigate = useNavigate();
  const [equipment_name, setEquipName] = useState("");
  const [equipment_type, setEquipType] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token);
    if (token) {
      fetch("http://localhost:5000/profile", {
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
        });
    }
  }, []); //ส่งไปครั้งเดียว

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equipment_name.trim() || !equipment_type) {
      console.log("Please fill in all fields");
      setValidationMessage("ชื่ออุปกรณ์และประเภทอุปกรณ์ไม่ควรเป็นค่าว่าง");
      return;
    }

    fetch("http://localhost:5000/addequip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        equipment_name,
        equipment_type,
        // adminId: location.state._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          // window.location.href = "./allequip";
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allequip");
          }, 1100);
        }
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };
  return (
    <main className="body">
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name" >
              <img src={logow} className="logow" alt="logo" ></img>
            </div>
          </div>
          <i class='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul class="nav-list">
          <li>
            <a href="home">
              <i class="bi bi-book"></i>
              <span class="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i class="bi bi-person-plus"></i>
              <span class="links_name" >จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i class="bi bi-people"></i>
              <span class="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i class="bi bi-prescription2"></i>
              <span class="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
          <div class="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span class="links_name" >ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div class="profile_details ">
          <li>
            <a href="profile" >
              <i class="bi bi-person"></i>
              <span class="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
        </div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
            <a href="home">
                <i class="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="alluser">
                จัดการข้อมูลผู้ป่วย
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="adduser">
                เพิ่มข้อมูลผู้ป่วยทั่วไป
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="addmdinformation">
                เพิ่มข้อมูลการเจ็บป่วย
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มอุปกรณ์</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มอุปกรณ์</h3>
        <div className="adminall card mb-3">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>ชื่ออุปกรณ์</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setEquipName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>ประเภทอุปกรณ์</label>
              <select
                className="form-control"
                onChange={(e) => setEquipType(e.target.value)}
              >
                <option value="">กรุณาเลือก</option>
                <option value="อุปกรณ์ติดตัว">อุปกรณ์ติดตัว</option>
                <option value="อุปกรณ์เสริม">อุปกรณ์เสริม</option>
                <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่น ๆ</option>
              </select>
            </div>
            {validationMessage && (
              <div style={{ color: "red" }}>{validationMessage}</div>
            )}
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
              <br />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
