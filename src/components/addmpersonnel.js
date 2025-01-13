import React, { useEffect,useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddMpersonnel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nametitle, setNameTitle] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(""); 
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token); setToken(token); 
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

    fetch("http://localhost:5000/addmpersonnel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        // password,
        // confirmPassword,
        email,
        tel,
        name,
        surname,
        nametitle
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addmpersonnel");
        if (data.status === "ok") {
          // console.log(username, password, confirmPassword, tel, name, nametitle);
          // window.location.href = "./allmpersonnel";
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allmpersonnel");
          },1000);
        }else {
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
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
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
          <li>
            <a href="recover-patients">
              <i className="bi bi-trash"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วยที่ถูกลบ</span>
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
        <div className="header">จัดการข้อมูลบุคลากร</div>
        <div className="profile_details">
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
            <li><a href="allmpersonnel">จัดการข้อมูลบุคลากร</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li><a>เพิ่มบุคลากร</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มบุคลากร</h3>
        <div className="adminall card mb-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>เลขที่ใบประกอบวิชาชีพ<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* <div className="mb-3">
              <label>รหัสผ่าน<span className="required">*</span></label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>ยืนยันรหัสผ่าน<span className="required">*</span></label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div> */}
            <div className="mb-3">
              <label>อีเมล<span className="required">*</span></label>
              <input
                type="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>เบอร์โทรศัพท์<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setTel(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>คำนำหน้าชื่อ<span className="required">*</span></label>
              <select
                className="form-control"
                onChange={(e) => setNameTitle(e.target.value)}
              >
                <option value="">กรุณาเลือก</option>
                <option value="แพทย์หญิง">แพทย์หญิง</option>
                <option value="นายแพทย์">นายแพทย์</option>
                <option value="พยาบาลวิชาชีพ">พยาบาลวิชาชีพ</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            <div className="mb-3">
              <label>ชื่อ<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>นามสกุล<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>

            {/* แสดงข้อความ error */}
            <p id="errormessage" className="errormessage">{error}</p>
            <div className="d-grid">
              <button type="submit"className="btn btn-outline py-2">
                บันทึก
              </button>
         </div>
          </form>
          {/* <button onClick={All} className="btn btn-primary">
            Back
          </button>
          <button onClick={home} className="btn btn-primary">
            Home
          </button> */}
        </div>
      </div>
    </main>
  );
}
