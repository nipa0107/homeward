import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Updatecaregiver() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, user } =  location.state || {};  
  const caregiver = location.state?.caregiver;
  const [gender, setGender] = useState("");
  const [Relationship, setRelationship] = useState('');
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [otherGender, setOtherGender] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherRelationship, setOtherRelationship] = useState("");
  const [formData, setFormData] = useState({
    user: caregiver?.user|| "",
    name: caregiver?.name || "",
    surname: caregiver?.surname || "",
    tel: caregiver?.tel || "",
    Relationship: caregiver?.Relationship || "",
  });

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    // ตรวจสอบว่า date เป็น NaN หรือไม่
    if (isNaN(formattedDate.getTime())) {
      return ""; // ถ้าเป็น NaN ให้ส่งค่าว่างกลับไป
    }
    return formattedDate.toISOString().split('T')[0];
  };

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
          body: JSON.stringify({ token: token }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setAdminData(data.data);
          });
      }
    }, [id]);
  

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleBreadcrumbClick = () => {
    navigate("/allinfo", { state: { id: id, user: user } });
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGender(value);
    if (value === "อื่นๆ") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherGender("");
    }
  };

  const handleOtherGenderChange = (e) => {
    const value = e.target.value;
    setOtherGender(value);
    setGender(value); // Update gender to the value of otherGender
  };

//   const handleRelationshipChange = (e) => {
//     const value = e.target.value;
//     setRelationship(value);
//     if (value === "อื่นๆ") {
//       setShowOtherInput(true);
//     } else {
//       setShowOtherInput(false);
//       setOtherRelationship("");
//     }
//   };
const handleRelationshipChange = (e) => {
    const value = e.target.value;
    if (value === "อื่นๆ") {
      setShowOtherInput(true);
      setFormData((prev) => ({ ...prev, Relationship: otherRelationship })); // กรณี "อื่นๆ" ใช้ค่า otherRelationship
    } else {
      setShowOtherInput(false);
      setFormData((prev) => ({ ...prev, Relationship: value })); // อัปเดต Relationship ตามที่เลือก
    }
  };
  const handleOtherRelationshipChange = (e) => {
    const value = e.target.value;
    setOtherRelationship(value);
    setFormData((prev) => ({ ...prev, Relationship: value })); // อัปเดต Relationship ด้วยค่าอื่นๆ
  };
  
//   const handleOtherRelationshipChange = (e) => {
//     const value = e.target.value;
//     setOtherRelationship(value);
//     setRelationship(value); 
//   };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/updatecaregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: caregiver._id, ...formData }),
      });

      const data = await response.json();
        if (data.status === "Ok") {
              toast.success("แก้ไขข้อมูลสำเร็จ");
              setTimeout(() => {
                  navigate("/allinfo", { state: { id: id } });
                }, 1000);
          } else {
              // setError(data.error);
              toast.error(data.error);
            }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <main className="body">
      <ToastContainer/>
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
          <div className="header">จัดการข้อมูลผู้ป่วย</div>
          <div className="profile_details ">
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
            <li><a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a onClick={handleBreadcrumbClick} className="info">ข้อมูลการดูแลผู้ป่วย</a>
              {/* <a href="allinfo">ข้อมูลการดูแลผู้ป่วย</a> */}
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลผู้ดูแล</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขข้อมูลผู้ดูแล</h3>
        <div className="adminall card mb-3">
        <form>
           <div className="mb-3">
            <label>ชื่อ(ผู้ดูแล)</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>นามสกุล(ผู้ดูแล)</label>
            <input
              type="text"
              name="surname"
              className="form-control"
              value={formData.surname}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>ความสัมพันธ์</label>
            <div class="relationship-container">
            <div class="relationship-group">
            <div>
              <label>
                <input
                  type="radio"
                  value="พ่อ"
                  checked={formData.Relationship === "พ่อ"} 
                  onChange={handleRelationshipChange}
                />
                พ่อ
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="แม่"
                  checked={formData.Relationship=== "แม่"}
                  onChange={handleRelationshipChange}
                />
                แม่
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="ลูก"
                  checked={formData.Relationship === "ลูก"}
                  onChange={handleRelationshipChange}
                />
                ลูก
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="ภรรยา"
                  checked={formData.Relationship === "ภรรยา"}
                  onChange={handleRelationshipChange}
                />
                ภรรยา
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="สามี"
                  checked={formData.Relationship === "สามี"}
                  onChange={handleRelationshipChange}
                />
                สามี
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="อื่นๆ"
                  checked={showOtherInput}
                  onChange={handleRelationshipChange}
                />
                อื่นๆ
              </label>
              </div>
              </div>
              {showOtherInput && (
                <div className="mt-2">
                  <label>กรุณาระบุ:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otherRelationship}
                    onChange={handleOtherRelationshipChange}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label>เบอร์โทรศัพท์(ผู้ดูแล)</label>
            <input
              type="text"
              name="tel"
              className="form-control"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
      
          <div className="d-grid">
            <button
              onClick={handleSave}
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
          </div>
          </form>
        </div>
      </div>
    </main>
  );
}