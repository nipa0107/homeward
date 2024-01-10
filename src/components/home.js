import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";



export default function Home({ }) {
  const [adminData, setAdminData] = useState("");

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
          console.log(data)
          setAdminData(data.data);
        });
    }
  }, []); //ส่งไปครั้งเดียว


  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const admin = () => {
    window.location.href = "./alladmin";
  };

  const profile = () => {
    window.location.href = "./profile";
  };

  const equip = () => {
    window.location.href = "./allequip";
  };


  const [navCollpase, setNavCollapse] = useState(false);
  return (
    <div className="bartop">
      <nav className="nav">
        <div className="logo">
          <img src={logow} className="logow" alt="logo"></img>
          <i className="bi bi-justify" onClick={e => setNavCollapse(!navCollpase)}></i>
        </div>
        <ul>
          <i class="bx bx-user"></i>
          {/*เช็คว่ามีdataไหม */}
          {/* <li onClick={navCollpase}>{adminData && adminData.username}</li> */}
          <li onClick={profile}>{adminData && adminData.username}</li>
        </ul>
      </nav>
      <div className="sidebar_content">
        <div className={'sidebar-container ${navCollpase ? "navCollaps" : ""}'}>
          <div className="nav-option option1">
            <i class="bi bi-house"></i>
            <p>หน้าหลัก</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-book"></i>
            <p>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-people">
            </i>
            <p>จัดการข้อมูลบุคลากร</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-prescription2" onClick={equip}></i>
            <p onClick={equip}>จัดการอุปกรณ์ทางการแพทย์</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-person-gear" onClick={admin}></i>
            <p onClick={admin}>จัดการแอดมิน</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-box-arrow-right" onClick={logOut}></i>
            <p onClick={logOut}>ออกจากระบบ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
