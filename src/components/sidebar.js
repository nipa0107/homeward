import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logow from "../img/logow.png";
import "../css/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(window.innerWidth > 967);
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
  const tokenExpiredAlertShown = useRef(false);

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const handleToggleSidebar = () => {
    setIsActive((prevState) => !prevState);
  };

  //   useEffect(() => {
  //     const handleResize = () => {
  //       setIsActive(window.innerWidth > 992);
  //     };
  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsActive(false); // ซ่อน Sidebar เมื่อจอเล็ก
      } else {
        setIsActive(true); // แสดง Sidebar เมื่อจอใหญ่
      }
    };

    handleResize(); // เช็กขนาดจอครั้งแรก
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          if (
            data.data === "token expired" &&
            !tokenExpiredAlertShown.current
          ) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        })

        .catch((error) => {
          console.error("Error verifying token:", error);
          // logOut();
        });
    } else {
      // logOut();
    }
  }, []);
  return (
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
        {/* <li>
          {adminData?._id && (
            <a
              href={`http://localhost:5173/auth?userId=${adminData._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-window-dock"></i>
              <span className="links_name">PTAH จัดการกายภาพ</span>
            </a>
          )}
        </li> */}
        <li>
          {/* {adminData?.username && adminData?.password && (
            <a
              href={`http://localhost:5173/auth?username=${encodeURIComponent(
                adminData.username
              )}&password=${encodeURIComponent(adminData.password)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-window-dock"></i>
              <span className="links_name">PTAH จัดการกายภาพ</span>
            </a>
          )} */}
           <a
            href={`https://ptah-admin.com/dashboard`}>
              <i className="bi bi-window-dock"></i>
              <span className="links_name">PTAH จัดการกายภาพ</span>
            </a>
        </li>
        {/* */}
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
  );
}
