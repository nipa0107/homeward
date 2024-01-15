import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";


function Updateadmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log(location);
  }, [location]);

  const profile = () => {
    window.location.href = "./profile";
  };

  const Updateadmin = () => {
    console.log(password, newPassword, confirmNewPassword);

    fetch(`http://localhost:5000/updateadmin/${location.state._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: location.state._id,
        password: password,
        newPassword,
        confirmNewPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          window.location.href = "./profile";
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // }
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
      <div className="home_content">
        <div className="header">โปรไฟล์</div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a className="bihouse">
                <i class="bi bi-house-fill" onClick={() => navigate("/home")}></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a href="#" onClick={() => navigate("/profile")}>โปรไฟล์</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a>แก้ไขโปรไฟล์</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขโปรไฟล์</h3>
        <div className="formcontainerpf">
          <div className="auth-inner">
            รหัสผ่านเก่า
            <input
              className="form-control"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            รหัสผ่านใหม่
            <input
              className="form-control"
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            ยืนยันรหัสผ่านใหม่
            <input
              className="form-control"
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <br />
          </div>
          <button onClick={Updateadmin} className="btn bthsave btn-outline">
            บันทึก
          </button>
          <br /><br />
        </div>
        {/* <button onClick={profile} className="btn btn-primary">
        Back
      </button> */}
      </div>
    </main>

  );
}

export default Updateadmin;
