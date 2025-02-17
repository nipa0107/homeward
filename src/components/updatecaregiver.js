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
    ID_card_number: caregiver?. ID_card_number|| "",
    // user: caregiver?.user|| "",
   user: caregiver?.userRelationships?.[0]?.user || "",
    name: caregiver?.name || "",
    surname: caregiver?.surname || "",
    tel: caregiver?.tel || "",
    // Relationship: caregiver?.Relationship || "",
    Relationship: caregiver?.userRelationships?.[0]?.relationship || "",
  });
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [otherError, setOtherError] = useState("");

  //ค่า Relationship ที่ดึงมาจาก caregiver ไม่ตรงกับค่าที่กำหนด
  //แสดงเป็น "อื่นๆ" แล้วแสดงช่องกรอกข้อมูล
  useEffect(() => {
    if (formData.Relationship && !["พ่อ", "แม่", "ลูก", "ภรรยา", "สามี"].includes(formData.Relationship)) {
      setShowOtherInput(true);
      setOtherRelationship(formData.Relationship);
    }
}, [formData.Relationship]);
  const formatIDCardNumber = (id) => {
    if (!id) return "";
    return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5");
  };
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return ""; 
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
      setFormData((prev) => ({ ...prev, Relationship: value })); 
    }
  };
  // const handleOtherRelationshipChange = (e) => {
  //   const value = e.target.value;
  //   setOtherRelationship(value);
  //   setFormData((prev) => ({ ...prev, Relationship: value })); 
  // };
  const handleOtherRelationshipChange = (e) => {
    const value = e.target.value;
  
    if (/^[a-zA-Zก-ฮะ-ูไ-์\s]*$/.test(value)) {
      setOtherRelationship(value); 
      setFormData((prev) => ({ ...prev, Relationship: value })); 
      setOtherError("");
    } else {
      setOtherError("ความสัมพันธ์ต้องเป็นตัวอักษรเท่านั้น");
    }
  };
  
  
//   const handleOtherRelationshipChange = (e) => {
//     const value = e.target.value;
//     setOtherRelationship(value);
//     setRelationship(value); 
//   };
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === "tel") {
    if (/[^0-9]/.test(value)) {
      setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
    } else {
      setTelError("");
    }
  } 
   else if (name === "name" || name === "surname") {
    if (/[^ก-๙a-zA-Z\s]/.test(value)) {
      if (name === "name") {
        setNameError("ชื่อต้องเป็นตัวอักษรเท่านั้น");
      } else {
        setSurnameError("นามสกุลต้องเป็นตัวอักษรเท่านั้น");
      }
    } else {
      if (name === "name") setNameError("");
      if (name === "surname") setSurnameError("");
    }
  }
};


  const validateForm = () => {
    let isValid = true;
  
    if (!formData.name.trim() ) {
      setNameError("กรุณากรอกชื่อ");
      isValid = false;
    } else {
      setNameError("");
    }
  
    if (!formData.surname.trim()) {
      setSurnameError("กรุณากรอกนามสกุล");
      isValid = false;
    } else {
      setSurnameError("");
    }
    if (!formData.tel.trim()) {
      setTelError("กรุณากรอกเบอร์โทรศัพท์");
      isValid = false;
    } else if (formData.tel.length !== 10) {
      setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
      isValid = false;
    } else {
      setTelError("");
    }

    return isValid;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return; 
    }
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
            <label>เลขประจําตัวประชาชน</label>
            <input
              type="text"
              readOnly
              className="form-control gray-background"              
              name="ID_card_number"
              value={formatIDCardNumber(formData.ID_card_number)}
              onChange={handleChange}
            />
          </div>
           <div className="mb-3">
            <label>ชื่อ</label>
            <input
              type="text"
              className={`form-control ${nameError ? "input-error" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {nameError && <span className="error-text">{nameError}</span>}
            </div>
          <div className="mb-3">
            <label>นามสกุล</label>
            <input
              type="text"
              name="surname"
              className={`form-control ${surnameError ? "input-error" : ""}`}
              value={formData.surname}
              onChange={handleChange}
            />
            {surnameError && <span className="error-text">{surnameError}</span>}

          </div>
          <div className="mb-3">
            <label>ความสัมพันธ์กับผู้ป่วย</label>
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
                  <label>กรุณาระบุความสัมพันธ์:</label>
                  <input
                    type="text"
                    name="other"
                    className={`form-control ${otherError ? "input-error" : ""}`}
                    value={otherRelationship}
                    onChange={handleOtherRelationshipChange}
                  />
                   {otherError && <span className="error-text">{otherError}</span>}

                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              name="tel"
              className={`form-control ${telError ? "input-error" : ""}`}
              value={formData.tel}
               maxLength="10"
              onChange={handleChange}
            />
            {telError && <span className="error-text">{telError}</span>}

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