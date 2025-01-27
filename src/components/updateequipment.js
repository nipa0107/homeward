import React, { useEffect, useState } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateEquipment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [adminData, setAdminData] = useState("");
  const { id } = location.state;
  const [isActive, setIsActive] = useState(false);
  const [equipment_name, setEquipName] = useState("");
  const [equipment_type, setEquipType] = useState("");
  const [nameError, setNameError] = useState("");
  const [typeError, setTypeError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/getequip/${id}`
        );
        const data = await response.json();
        setEquipName(data.equipment_name);
        setEquipType(data.equipment_type);
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

        });
    }
    fetchData();
  }, [id]);

  // const checkDuplicateName = async (equipment_name) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/check-equip-name?equipment_name=${equipment_name}`
  //     );
  //     const data = await response.json();
  //     return data.exists; // ถ้าชื่อซ้ำจะ return true
  //   } catch (error) {
  //     console.error("Error checking duplicate name:", error);
  //     return false; // กรณีมีข้อผิดพลาด
  //   }
  // };

  const UpdateEquipment = async () => {
    let hasError = false;
    // if (!equipment_name.trim() || !equipment_type) {
    //   console.log("Please fill in all fields");
    //   setValidationMessage("ชื่ออุปกรณ์และประเภทอุปกรณ์ไม่ควรเป็นค่าว่าง");
    //   return;
    // }
    if (!equipment_name.trim()) {
      setNameError("กรุณากรอกชื่ออุปกรณ์");
      hasError = true;
    } else {
      setNameError("");
    }
    if (!equipment_type.trim()) {
      setTypeError("กรุณาเลือกประเภทอุปกรณ์");
      hasError = true;
    } else {
      setTypeError("");
    }
    if (hasError) return; 
    try {
      const EquipUpdate = {
        equipment_name,
        equipment_type,
      };

      const response = await fetch(
        `http://localhost:5000/updateequip/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
          },
          body: JSON.stringify(EquipUpdate),
        }
      );
      const result = await response.json();
      if (response.ok && result.status === "ok") {
        // const UpdatedEquipment = await response.json();
        console.log("แก้ไขอุปกรณ์สำเร็จ:", result);
        toast.success("แก้ไขอุปกรณ์สำเร็จ");
        setTimeout(() => {
          navigate("/allequip");
        }, 1100);
      } else {
        if (result.error) {
          toast.error(result.error); // แสดงข้อความจาก Backend
        } else {
          toast.error("ไม่สามารถแก้ไขอุปกรณ์ได้");
        }
        console.error("แก้ไขไม่ได้:", result.error || response.statusText);
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
    setIsActive(!isActive);
  };

  const handleBreadcrumbClick = () => {
    navigate("/allequipment");
  };
  const handleInputNameChange = (e) => {
    const input = e.target.value;
    if (!input.trim()) {
      setNameError("");
    } else {
      setNameError(""); 
    }
    setEquipName(input);
  };

  const handleInputTypeChange = (e) => {
    const input = e.target.value;
    if (!input.trim()) {
      setTypeError("");
    } else {
      setTypeError(""); 
    }
    setEquipType(input);
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
        <div className="header">จัดการอุปกรณ์ทางการแพทย์</div>
        <div className="profile_details">
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
              <a href="allequip">จัดการอุปกรณ์ทางการแพทย์</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขอุปกรณ์</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขอุปกรณ์</h3>
        <div className="adminall card mb-1">
          <div className="mb-1">
            <label>ชื่ออุปกรณ์</label>
            <input
              type="text"
              value={equipment_name}
              className={`form-control ${nameError ? "input-error" : ""}`}
              onChange={handleInputNameChange}   
            />
            {nameError && <span className="error-text">{nameError}</span>}
          </div>
          <div className="mb-1">
            <label>ประเภทอุปกรณ์</label>
            <select
              className={`form-control ${typeError ? "input-error" : ""}`}
               onChange={handleInputTypeChange}      
              value={equipment_type}
            >
              <option value="">กรุณาเลือก</option>
              <option value="อุปกรณ์ติดตัว">อุปกรณ์ติดตัว</option>
              <option value="อุปกรณ์เสริม">อุปกรณ์เสริม</option>
              <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่น ๆ</option>
            </select>
            {typeError && <span className="error-text">{typeError}</span>}
          </div>

          <div className="d-grid">
            <button
              onClick={UpdateEquipment}
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

