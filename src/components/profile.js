import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/profile.css";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import Sidebar from "./sidebar";
export default function Profile() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [surname, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
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
          setName(data.data.name);
          setSurName(data.data.surname);
          setUsername(data.data.username);
          setEmail(data.data.email);
          setIsEmailVerified(data.data.isEmailVerified);
          if (
            data.data === "token expired" &&
            !tokenExpiredAlertShown.current
          ) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
  }, []); //ส่งไปครั้งเดียว

  const handleEditClick = () => {
    navigate("/emailverification", { state: { adminData } });
  };

  const handleChangeEmailClick = () => {
    navigate("/updateemail", { state: { adminData } });
  };

  return (
    <main className="body">
     <Sidebar />
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
            <div className="form-control email-container">
              {email}
              {isEmailVerified ? (
                <a className="verify" onClick={handleChangeEmailClick}>
                  เปลี่ยนอีเมล
                </a>
              ) : (
                <a className="verify" onClick={handleEditClick}>
                  ยืนยันอีเมล
                </a>
              )}
            </div>
          </div>
          {adminData && (
            <div className="button-group">
              <button
                className="custom-btn edit-btn"
                onClick={() =>
                  navigate("/updatenameadmin", { state: adminData })
                }
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
