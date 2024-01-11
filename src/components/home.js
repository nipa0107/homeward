import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";


export default function Home({ }) {
  const navigate = useNavigate();
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
          <li onClick={() => navigate("/profile")}>{adminData && adminData.username}</li>
        </ul>
      </nav>
      <div className="sidebar_content">
        <div className={'sidebar-container ${navCollpase ? "navCollaps" : ""}'}>
          <div className="nav-option option1">
            <i class="bi bi-book" onClick={() => navigate("/allcaremanual")}></i>
            <p onClick={() => navigate("/allcaremanual")}>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-people" onClick={() => navigate("/allmpersonnel")}>
            </i >
            <p onClick={() => navigate("/allmpersonnel")}>จัดการข้อมูลบุคลากร</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-prescription2" onClick={() => navigate("/allequip", { state: adminData } )}></i>
            <p onClick={() => navigate("/allequip", { state: adminData })}>จัดการอุปกรณ์ทางการแพทย์</p>
          </div>

          <div className="nav-option option1">
            <i class="bi bi-person-gear" onClick={() => navigate("/alladmin")}></i>
            <p  onClick={() => navigate("/alladmin")}>จัดการแอดมิน</p>
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
