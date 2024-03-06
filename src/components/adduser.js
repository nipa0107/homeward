import React, { useState, useEffect } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function AddUser() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ID_card_number, setIDCardNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [Address, setAddress] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

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
        });
    }
  }, []); //ส่งไปครั้งเดียว

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        name,
        email,
        password,
        confirmPassword,
        tel,
        gender,
        birthday,
        ID_card_number,
        nationality,
        Address,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addadmain");
        if (data.status === "ok") {
          console.log(username, password, confirmPassword);
          toast.success("เพิ่มข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/alluser");
        },1100); 
          // window.location.href = "./alluser";
        } else {
          // เมื่อเกิดข้อผิดพลาด
          setError(data.error); // กำหนดข้อความ error ให้กับ state
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
            <a href="#" onClick={() => navigate("/home")}>
              <i class="bi bi-book"></i>
              <span class="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/alluser")}>
              <i class="bi bi-person-plus"></i>
              <span class="links_name" >จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allmpersonnel")}>
              <i class="bi bi-people"></i>
              <span class="links_name">จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allequip")}>
              <i class="bi bi-prescription2"></i>
              <span class="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name">จัดการแอดมิน</span>
            </a>
          </li>
          <div class="nav-logout">
          <li>
            <a href="#" onClick={logOut}>
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
            <a href="#" onClick={() => navigate("/profile")}>
              <i class="bi bi-person"></i>
              <span class="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
        </div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a className="bihouse">
                <i
                  class="bi bi-house-fill"
                  onClick={() => navigate("/home")}
                ></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="#" onClick={() => navigate("/alluser")}>
                จัดการข้อมูลผู้ป่วย
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มข้อมูลผู้ป่วย</h3>
        <div className="adminall card mb-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>ชื่อผู้ใช้</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>อีเมล</label>
              <input
                type="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>รหัสผ่าน</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>ชื่อ-นามสกุล</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>เพศ</label>
              <select
                id="gender"
                className="form-select"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">โปรดเลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่นๆ">อื่น ๆ</option>
              </select>
            </div>
            <div className="mb-3">
              <label>วันเกิด</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>เลขประจำตัวบัตรประชาชน</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setIDCardNumber(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>สัญชาติ</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setNationality(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>ที่อยู่</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <br />
            {/* แสดงข้อความ error */}
            <p id="errormessage" className="errormessage">
              {error}
            </p>
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
              <br />
            </div>
          </form>
        </div>
        {/* <button onClick={All} className="btn btn-primary">
          Back
        </button>
        <button onClick={home} className="btn btn-primary">
          Home
        </button> */}
      </div>
    </main>
  );
}
