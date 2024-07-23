import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/profile.css";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";

export default function Profile() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

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
          console.log(data);
          setAdminData(data.data);
          setName(data.data.name);
          setUsername(data.data.username);
          setEmail(data.data.email);
        });
    }
  }, []); //ส่งไปครั้งเดียว

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
            <a href="/alluserinsetting" >
            <i class="bi bi-bell"></i>              
            <span class="links_name" >ตั้งค่าการแจ้งเตือน</span>
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
      <div className="homeheader">
        <div className="header">โปรไฟล์</div>
        <div class="profile_details ">
        <ul className="nav-list">
          <li>
            <a href="profile" >
              <i class="bi bi-person"></i>
              <span class="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
          </ul>
        </div>
        </div>
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
              <a>โปรไฟล์</a>
            </li>
          </ul>
        </div>
        {/* <h3>โปรไฟล์</h3> */}
        <div className="formcontainerpf card mb-3">
          <div className="mb-3">
            <label>ชื่อผู้ใช้</label>
            <div className="textbox gray-background">
              {username}
            </div>{" "}
          </div>
          <div className="mb-3">
            <label>ชื่อ-นามสกุล</label>
            {/* <div className="textbox">{adminData && adminData.name} <a onClick={() => navigate("/updatenameadmin", { state: adminData })}>แก้ไขชื่อ</a></div>{" "}
          <br /> */}
            <div className="textbox">
              <span>{name}</span>
              {adminData && (
                <a className="editname" onClick={() => navigate("/updatename", { state: adminData })}>
                  แก้ไขชื่อ
                </a>
              )}
            </div>
          </div>
          <div>
            <label>อีเมล</label>
            <div className="textbox gray-background">
              {email}
              {/* <a
              onClick={() => navigate("/updateemail", { state: adminData })}>
              เปลี่ยนอีเมล
            </a> */}
            </div>{" "}
            <br />
            <a className="editname" onClick={() => navigate("/updateadmin", { state: adminData })}>
              เปลี่ยนรหัสผ่าน
            </a>
            {/* <div>
            <label>รหัสผ่าน</label>
            <br />
            <div className="textbox">
              <img
              src={editimg}
              className="editimg"
              alt="editimg"
              onClick={() => navigate("/updateadmin", { state: adminData })}
            />
            </div>
        
          </div> */}
          </div>
        </div>
      </div>
      <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button>
    </main>
  );
}
