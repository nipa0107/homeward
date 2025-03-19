import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qrcode from "../img/QRcode.svg";
import qrcodehomeward from "../img/Homeward_qrcode.svg"
import "../css/form.css"
import "../css/saveimage.css";
import Sidebar from "./sidebar";

export default function DisplayUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
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
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
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


  return (
    <main className="body">
      <Sidebar />
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
            <li className="middle">
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="alluser">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ข้อมูลสำหรับใช้ในการเข้าสู่ระบบ</a>
            </li>
          </ul>
        </div>

        <ToastContainer />
        <div className="save-img card mb-1">
          <div id="user-data" className="user-data-container">
            {/* <img src={logo} className="logo-qr" alt="QR Code"/> */}
            <p  className="header-saveimg">ข้อมูลสำหรับใช้ในการเข้าสู่ระบบของผู้ป่วย</p>
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
                  <span className="user-data">{userData.originalTel}</span>
                </div>
                
              </div>
              <div className="qrcode-container">
              <div className="qrcode-item">

                <img src={qrcodehomeward} className="qrcode" alt="QR Code" />
                <div className="image-description">
                  แอปพลิเคชัน HOMEWARD
                  </div>
                  <div className="image-description">
                  สำหรับดูคู่มือการรักษา
                  </div>              </div>
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
