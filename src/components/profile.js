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
  const [surname, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
          setSurName(data.data.surname);
          setUsername(data.data.username);
          setEmail(data.data.email);
          setIsEmailVerified(data.data.isEmailVerified);
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

  const handleEditClick = () => {
    navigate("/emailverification", { state: { adminData } });
  };
  

  const handleChangeEmailClick = () => {
    navigate("/updateemail", { state: { adminData } });
  };

  return (
    <main className="body">
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
            </div>
          </div>
          <i className="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <a href="home">
              <i className="bi bi-book"></i>
              <span className="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i className="bi bi-person-plus"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i className="bi bi-people"></i>
              <span className="links_name">จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i className="bi bi-prescription2"></i>
              <span className="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i className="bi bi-bandaid"></i>
              <span className="links_name">จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting">
              <i className="bi bi-bell"></i>
              <span className="links_name">ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i className="bi bi-person-gear"></i>
              <span className="links_name">จัดการแอดมิน</span>
            </a>
          </li>
          <li>
            <a href="recover-patients">
              <i className="bi bi-trash"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วยที่ถูกลบ</span>
            </a>
          </li>
          <div className="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i
                  className="bi bi-box-arrow-right"
                  id="log_out"
                  onClick={logOut}
                ></i>
                <span className="links_name">ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="homeheader">
          <div className="header">โปรไฟล์</div>
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
            <li>
              <a>โปรไฟล์</a>
            </li>
          </ul>
        </div>
        {/* <h3>โปรไฟล์</h3> */}
        <div className="formcontainerpf card mb-2">
          <div className="mb-2">
            <label>ชื่อผู้ใช้</label>
            <div className="form-control gray-background">{username}</div>{" "}
          </div>
          <div className="mb-2">
            <label>ชื่อ</label>
            <div className="form-control">
              <span>{name}</span>
            </div>
          </div>
          <div className="mb-2">
            <label>นามสกุล</label>
            <div className="form-control">
              <span>{surname}</span>
            </div>
          </div>
          <div className="mb-2">
      <label>อีเมล</label>
      <div className="form-control">
        {email}
        {isEmailVerified ? (
          <a
            className="verify"
            onClick={handleChangeEmailClick}
          >
            เปลี่ยนอีเมล
          </a>
        ) : (
          <a
            className="verify"
            onClick={handleEditClick}
          >
            ยืนยันอีเมล
          </a>
        )}
      </div>
    </div>
    {adminData && (
  <div className="button-group">
    <button
      className="custom-btn edit-btn"
      onClick={() => navigate("/updatenameadmin", { state: adminData })}
    >
      แก้ไขโปรไฟล์
    </button>
    <button
      className="custom-btn password-btn"
      onClick={() => navigate("/updateadmin", { state: adminData })}
    >
      เปลี่ยนรหัสผ่าน
    </button>
  </div>
)}

        </div>
      </div>

    </main>
  );
}
