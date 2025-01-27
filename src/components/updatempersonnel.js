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

export default function UpdateMPersonnel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [adminData, setAdminData] = useState("");
  const { id } = location.state;
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nametitle, setNameTitle] = useState("");
  const [error, setError] = useState("");
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [nametitleError, setNametitleError] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/getmpersonnel/${id}`
        );
        const data = await response.json();
        setUsername(data.username);
        setPassword(data.password);
        setConfirmPassword(data.confirmPassword);
        setTel(data.tel);
        setEmail(data.email);
        setName(data.name);
        setSurname(data.surname);
        setNameTitle(data.nametitle);
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

  const UpdateMP = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (!tel.trim() && !tel.length !== 10) {
      setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
      hasError = true;
    } else {
      setTelError("");
    }

    if (!name.trim()) {
      setNameError("กรุณากรอกชื่อ");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!surname.trim()) {
      setSurnameError("กรุณากรอกนามสกุล");
      hasError = true;
    } else {
      setSurnameError("");
    }

    if (!nametitle.trim()) {
      setNametitleError("กรุณาเลือกคำนำหน้าชื่อ");
      hasError = true;
    } else {
      setNametitleError("");
    }

    if (hasError) return;
    try {
      const MPUpdate = {
        username,
        password,
        confirmPassword,
        email,
        tel,
        name,
        surname,
        nametitle,
      };
      const response = await fetch(`http://localhost:5000/updatemp/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
        },
        body: JSON.stringify(MPUpdate),
      });
      if (response.ok) {
        const UpdatedMP = await response.json();
        console.log("แก้ไขคู่มือแล้ว:", UpdatedMP);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/allmpersonnel");
        }, 1100);
      } else {
        console.error("แก้ไขไม่ได้:", response.statusText);
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
  const handleInputChange = (e) => {
    const input = e.target.value;
    if (/[^0-9]/.test(input)) {
      setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
    } else {
      setTelError("");
    }
    setTel(input.replace(/\D/g, ""));
  };
  const handleInputNameChange = (e) => {
    const input = e.target.value;

    // ตรวจสอบว่ามีตัวเลขหรืออักขระพิเศษหรือไม่
    if (/[^a-zA-Zก-ฮะ-ูไ-์\s]/.test(input)) {
      setNameError("ชื่อควรเป็นตัวอักษรเท่านั้น");
    } else {
      setNameError("");
    }

    setName(input.replace(/[^a-zA-Zก-ฮะ-ูไ-์\s]/g, "")); // กรองเฉพาะตัวอักษรและช่องว่าง
  };

  const handleInputSurnameChange = (e) => {
    const input = e.target.value;

    // ตรวจสอบว่ามีตัวเลขหรืออักขระพิเศษหรือไม่
    if (/[^a-zA-Zก-ฮะ-ูไ-์\s]/.test(input)) {
      setSurnameError("นามสกุลควรเป็นตัวอักษรเท่านั้น");
    } else {
      setSurnameError(""); // ล้าง error หากไม่มีปัญหา
    }

    setSurname(input.replace(/[^a-zA-Zก-ฮะ-ูไ-์\s]/g, "")); // กรองเฉพาะตัวอักษรและช่องว่าง
  };

  const handleInputNameTitleChange = (e) => {
    const input = e.target.value;
  
    if (!input.trim()) {
      setNametitleError("กรุณาเลือกคำนำหน้าชื่อ");
    } else {
      setNametitleError(""); 
    }
  
    setNameTitle(input);
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
              <span className="links_name">จัดการอาการผู้ป่วย</span>
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
        <div className="header">จัดการข้อมูลบุคลากร</div>
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
              <a href="allmpersonnel">จัดการข้อมูลบุคลากร</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลบุคลากร</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขข้อมูลบุคลากร</h3>
        <div className="adminall card mb-1">
          <div className="mb-1">
            <label>เลขที่ใบประกอบวิชาชีพ</label>
            <input
              type="text"
              value={username}
              readOnly
              className="form-control gray-background"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>อีเมล</label>
            <input
              value={email}
              type="email"
              readOnly
              className="form-control gray-background"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>เบอร์โทรศัพท์</label>
            <input
              value={tel}
              type="text"
               maxLength="10"
               className={`form-control ${telError ? "input-error" : ""}`}
               onChange={handleInputChange}
               />
            {telError && <span className="error-text">{telError}</span>}

          </div>
          <div className="mb-1">
            <label>คำนำหน้าชื่อ</label>
            <select
                className={`form-control ${nametitleError ? "input-error" : ""}`}
              value={nametitle}
              onChange={handleInputNameTitleChange}
              // onChange={(e) => setNameTitle(e.target.value)}
            >
              <option value="">กรุณาเลือก</option>
              <option value="แพทย์หญิง">แพทย์หญิง</option>
              <option value="นายแพทย์">นายแพทย์</option>
              <option value="พยาบาลวิชาชีพ">พยาบาลวิชาชีพ</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
            </select>
            {nametitleError && <span className="error-text">{nametitleError}</span>}

          </div>
          <div className="mb-3">
            <label>ชื่อ</label>
            <input
              type="text"
              value={name}
              className={`form-control ${nameError ? "input-error" : ""}`}
              onChange={handleInputNameChange}
            />
            {nameError && <span className="error-text">{nameError}</span>}
            </div>
          <div className="mb-3">
            <label>นามสกุล</label>
            <input
              type="text"
              value={surname}
              className={`form-control ${surnameError ? "input-error" : ""}`}
              onChange={handleInputSurnameChange}
            />
            {surnameError && <span className="error-text">{surnameError}</span>}

          </div>
          <div className="d-grid">
            <button
              onClick={UpdateMP}
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
