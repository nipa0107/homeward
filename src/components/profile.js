import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/profile.css";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";


export default function Profile() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
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
            <a href="#" onClick={() => navigate("/home")}>
              <i class="bi bi-book"></i>
              <span class="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allmpersonnel")}>
              <i class="bi bi-people"></i>
              <span class="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allequip", { state: adminData })}>
              <i class="bi bi-prescription2"></i>
              <span class="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
        </ul>
        <div class="profile_content">
          <div className="profile">
            <div class="profile_details">
              <i class="bi bi-person" onClick={() => navigate("/profile")}></i>
              <div class="name_job">
                <div class="name"><li onClick={() => navigate("/profile")}>{adminData && adminData.username}</li></div>
              </div>
            </div>
            <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
          </div>
        </div>
      </div>
      <h3 className="title">โปรไฟล์ผู้ใช้</h3>
      <div className="containerprofile">
        <div className="formcontainerpf">
          <div>{adminData && adminData.username}</div> <br />
          <div>
            {adminData && adminData.password.replace(/./g, "•".repeat(1))}{" "}
            <p onClick={() => navigate("/updateadmin", { state: adminData })}>
              แก้ไข
            </p>
          </div>
        </div>
      </div>
      <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button>
    </main>
  );
}
