import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import "../css/form.css"
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateSymptom() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [adminData, setAdminData] = useState("");
  const { id } = location.state;
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const tokenExpiredAlertShown = useRef(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getsymptom/${id}`);
        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
    fetchData();
  }, [id]);

  const UpdateSymptom = async () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError("กรุณากรอกชื่ออาการ");
      hasError = true;
    } else {
      setNameError("");
    }

    if (hasError) return;

    try {
      const SymptomUpdate = {
        name,
      };
      const response = await fetch(
        `http://localhost:5000/updatesymptom/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
          },
          body: JSON.stringify(SymptomUpdate),
        }
      );
      const UpdateSymptom = await response.json();
      if (response.ok && UpdateSymptom.status === "ok") {
        console.log("แก้ไขอาการแล้ว:", UpdateSymptom);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/allsymptom");
        }, 1100);
      } else {
        if (UpdateSymptom.error) {
          toast.error(UpdateSymptom.error); // แสดงข้อความจาก Backend
        } else {
          toast.error("ไม่สามารถแก้ไขอาการได้");
        }
        console.error(
          "แก้ไขไม่ได้:",
          UpdateSymptom.error || response.statusText
        );
      }
    } catch (error) {
      console.error("การแก้ไขมีปัญหา:", error);
    }
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive((prevState) => !prevState);
  };
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

  const handleBreadcrumbClick = () => {
    navigate("/allsymptom");
  };
  const handleInputNameChange = (e) => {
    const input = e.target.value;
    if (!input.trim()) {
      setNameError("");
    } else {
      setNameError("");
    }
    setName(input);
  };

  return (
    <main className="body">
      <ToastContainer />
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
              <span className="links_name">
                จัดการข้อมูลคู่มือการดูแลผู้ป่วย
              </span>
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
          <div className="header">จัดการอาการผู้ป่วย</div>
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
            <li className="middle">
              <a href="allequip">
                จัดการอุปกรณ์ทางการแพทย์
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="allequip">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขอาการผู้ป่วย</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-1">
        <p className="title-header">แก้ไขอาการผู้ป่วย</p>
          <div className="mb-1">
            <label>ชื่ออาการ</label>
            <input
              type="text"
              value={name}
              className={`form-control ${nameError ? "input-error" : ""}`}
              onChange={handleInputNameChange}
            />
           {nameError && <span className="error-text">{nameError}</span>}

          </div>

          <div className="d-grid">
            <button
              onClick={UpdateSymptom}
              type="submit"
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>

      <div></div>
    </main>
  );
}
