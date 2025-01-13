import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logow from "../img/logow.png";
import qrcode from "../img/QRcode.svg";

export default function PhysicalTherapyUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
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
  }, []);

  const handleSaveAsImage = () => {
    const element = document.getElementById("user-data");
    html2canvas(element).then((canvas) => {
      const fileName = `${userData.name}_${userData.surname}.png`;
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("บันทึกรูปสำเร็จ");
    });
  };

  if (!userData) {
    return (
      <main className="body">
        <ToastContainer />
        <h3>ไม่พบข้อมูลผู้ใช้</h3>
        <button
          onClick={() => navigate("/alluser")}
          className="btn btn-outline py-2"
        >
          กลับไปที่หน้าจัดการข้อมูลผู้ใช้
        </button>
      </main>
    );
  }
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
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div className="profile_details ">
        <ul className="nav-list">
          <li>
            <a href="profile">
              <i className="bi bi-person"></i>
              <span className="links_name">{adminData && adminData.username}</span>
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
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลผู้ป่วยทั่วไป</a>
            </li>
          </ul>
        </div>

        <ToastContainer />
        <div className="save-img card mb-1">
          <div id="user-data" className="user-data-container">
            <p className="header-saveimg">ข้อมูลสำหรับใช้ในการเข้าสู่ระบบของผู้ป่วย</p>
            <div className="label-saveimg-container">
              <div className="data-container">
                <div className="label-saveimg">
                  <label className="label-name">ชื่อ-นามสกุล:</label>
                  <span className="user-data">
                    {userData.name} {userData.surname}
                  </span>
                </div>
                <div className="label-saveimg">
                  <label className="label-name">ชื่อผู้ใช้:</label>
                  <span className="user-data">{userData.username}</span>
                </div>
                <div className="label-saveimg">
                  <label className="label-name">รหัสผ่าน:</label>
                  <span className="user-data">{userData.tel}</span>
                </div>
              
              </div>
              <div className="qrcode-container">
                <div className="qrcode-item">
                  <img src={qrcode} className="qrcode" alt="QR Code 1" />
                  <div className="image-description">
                  แอปพลิเคชัน HOMEWARD
                  </div>
                  <div className="image-description">
                  สำหรับดูคู่มือการรักษา
                  </div>
                </div>
                <div className="qrcode-item">
                  <img src={qrcode} className="qrcode" alt="QR Code 2" />
                  <div className="image-description">
                  แอปพลิเคชัน PTAH                 
                  </div>
                  <div className="image-description">
                  สำหรับทำกายภาพบำบัด                  
                  </div>
                </div>
              </div>
              <div className="label-saveimg-scan">
                <label className="label-scan">สแกน QR Code เพื่อติดตั้งแอปพลิเคชัน</label>
                </div>
            </div>
          </div>
        </div>
        <div className="button-container">
          <button
            onClick={() => navigate("/alluser")}
            className="btn btn-outline py-2 btn-manage-user"
          >
            กลับไปที่หน้าจัดการข้อมูลผู้ป่วย
          </button>
          <button
            onClick={handleSaveAsImage}
            className="btn btn-outline py-2 btn-save-image"
          >
            บันทึกรูป
          </button>
        </div>
      </div>
    </main>
  );
}
