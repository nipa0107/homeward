import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function UpdateName() {
    const location = useLocation();
    const { id, user } = location.state;
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [adminData, setAdminData] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState("");


    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //       const response = await fetch(
        //         `http://localhost:5000/getadmin/${id}`
        //       );
        //       const data = await response.json();    
        //       setName(data.name); 
        //     } catch (error) {
        //       console.error("Error fetching caremanual data:", error);
        //     }
        //   };

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
              setName(data.data.name);
              setUsername(data.data.username)
              setEmail(data.data.email)
            });
          }
        //   fetchData();
          }, [location]);

    //แก้ไขชื่อ
    const UpdateName = async () => {
    try {
      const adminData = 
      { name,
      };
      const response = await fetch(`http://localhost:5000/updatenameadmin/${location.state._id}`, {
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
      <ToastContainer />
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
            </div>
          </div>
          <i class="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
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
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i class="bi bi-bandaid"></i>
              <span class="links_name" >จัดการอาการผู้ป่วย</span>
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
        <div className="header">แก้ไขโปรไฟล์ผู้ใช้</div>
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
            <li><a href="profile">โปรไฟล์</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a>แก้ไขโปรไฟล์ผู้ใช้</a>
            </li>
          </ul>
        </div>
        {/* <h3>แก้ไขโปรไฟล์ผู้ใช้</h3> */}
        <div className="formcontainerpf card mb-3">
          <div className="mb-3">
          <label>ชื่อผู้ใช้</label>
          <input
              type="text"
              className="form-control gray-background"
              readOnly
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
          <label>ชื่อ-นามสกุล</label>
          <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="mb-3">
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
            <br />
          </div>
        </div>
       
      </div>
      <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button>
    </main>
  );
}
