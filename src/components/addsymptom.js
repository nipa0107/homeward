import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddSymptom({ }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
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
        // if (name.trim()) {
        //   setValidationMessage("ชื่อของอาการผู้ป่วยไม่ควรเป็นค่าว่าง");
        //   return;
        // }
    
        fetch("http://localhost:5000/addsymptom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`
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
            <div className="logo_content">
              <div className="logo">
                <div className="logo_name" >
                  <img src={logow} className="logow" alt="logo" ></img>
                </div>
              </div>
              <i className='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
            </div>
            <ul className="nav-list">
              <li>
                <a href="home">
                  <i className="bi bi-book"></i>
                  <span className="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
                </a>
              </li>
              <li>
                <a href="alluser">
                  <i className="bi bi-person-plus"></i>
                  <span className="links_name" >จัดการข้อมูลผู้ป่วย</span>
                </a>
              </li>
              <li>
                <a href="allmpersonnel">
                  <i className="bi bi-people"></i>
                  <span className="links_name" >จัดการข้อมูลบุคลากร</span>
                </a>
              </li>
              <li>
                <a href="allequip">
                  <i className="bi bi-prescription2"></i>
                  <span className="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
                </a>
              </li>
              <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i className="bi bi-bandaid"></i>
              <span className="links_name" >จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting" >
            <i className="bi bi-bell"></i>              
            <span className="links_name" >ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
              <li>
                <a href="alladmin" onClick={() => navigate("/alladmin")}>
                  <i className="bi bi-person-gear"></i>
                  <span className="links_name" >จัดการแอดมิน</span>
                </a>
              </li>
              <div className="nav-logout">
                <li>
                  <a href="./" onClick={logOut}>
                    <i className='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                    <span className="links_name" >ออกจากระบบ</span>
                  </a>
                </li>
              </div>
            </ul>
          </div>
          <div className="home_content">
          <div className="homeheader">
            <div className="header">จัดการอุปกรณ์ทางการแพทย์</div>
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
                <li className="arrow">
                  <i className="bi bi-chevron-double-right"></i>
                </li>
                <li>
                  <a href="allsymptom">
                    จัดการอาการผู้ป่วย
                  </a>
                </li>
                <li className="arrow">
                  <i className="bi bi-chevron-double-right"></i>
                </li>
                <li>
                  <a>เพิ่มอาการผู้ป่วย</a>
                </li>
              </ul>
            </div>
            <h3>เพิ่มอาการผู้ป่วย</h3>
            <div className="adminall card mb-1">
              <form onSubmit={handleSubmit}>
    
                <div className="mb-1">
                  <label>ชื่ออาการ<span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {validationMessage && (
                  <div style={{ color: "red" }}>{validationMessage}</div>
                )}
                            <div className="d-grid">
                  <button type="submit"className="btn btn-outline py-2">
                    บันทึก
                  </button>
             </div>
              </form>
            </div>
    
          </div>
        </main>
      );
}