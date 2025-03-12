import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/form.css"
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../css/adduser.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

export default function AddUser() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
  const [physicalTherapy, setPhysicalTherapy] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const cleanedUsername = username.replace(/-/g, ""); // ลบเครื่องหมาย "-" หากมี
    if (!cleanedUsername.trim()) {
      setUsernameError("กรุณากรอกเลขบัตรประชาชน");
      hasError = true;
    } else if (cleanedUsername.length !== 13 || !/^\d+$/.test(cleanedUsername)) {
      setUsernameError("เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก");
      hasError = true;
    } else {
      setUsernameError("");
    }
    if (!tel.trim()) {
      setTelError("กรุณากรอกเบอร์โทรศัพท์");
      hasError = true;
    } else if (tel.length !== 10) {
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
  
    if (hasError) return; 
    // const cleanedUsername = username.replace(/-/g, '');

    fetch("https://backend-deploy-render-mxok.onrender.com/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: cleanedUsername,
        name,
        surname,
        tel,
        physicalTherapy,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addadmain");
        if (data.status === "ok") {
          console.log("User data to navigate: ", data.user);
          toast.success("เพิ่มข้อมูลสำเร็จ");
          if (physicalTherapy) {
            setTimeout(() => {
            navigate("/physicalTherapyUser", { state: { userData: data.user } });
          }, 1000);
          } else {
            setTimeout(() => {
            navigate("/displayUser", { state: { userData: data.user } });
          }, 1000);
          }
        } else {
          // setError(data.error);
          toast.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("An unexpected error occurred.");
      });
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

  const handleInputUsernameChange = (e) => {
    let input = e.target.value;

    if (/[^0-9-]/.test(input)) {
      setUsernameError("เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น");
      return;
    } else {
      setUsernameError(""); // Clear error if valid
    }

    // เอาเฉพาะตัวเลขและจัดรูปแบบ
    input = input.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
    if (input.length > 13) input = input.slice(0, 13); // จำกัดความยาวไม่เกิน 13 หลัก

    const formatted = input.replace(
      /^(\d{1})(\d{0,4})(\d{0,5})(\d{0,2})(\d{0,1})$/,
      (match, g1, g2, g3, g4, g5) => {
        let result = g1; // กลุ่มที่ 1
        if (g2) result += `-${g2}`; // กลุ่มที่ 2
        if (g3) result += `-${g3}`; // กลุ่มที่ 3
        if (g4) result += `-${g4}`; // กลุ่มที่ 4
        if (g5) result += `-${g5}`; // กลุ่มที่ 5
        return result;
      }
    );
    setUsername(formatted); // อัปเดตฟิลด์ข้อมูล
  };

  const handleInputNameChange = (e) => {
    const input = e.target.value;
  
    // ตรวจสอบว่ามีตัวเลขหรืออักขระพิเศษหรือไม่
    if (/[^ก-๙a-zA-Z\s]/.test(input)) {
      setNameError("ชื่อควรเป็นตัวอักษรเท่านั้น");
    } else {
      setNameError("");
    }
  
    setName(input.replace(/[^ก-๙a-zA-Z\s]/g, "")); // กรองเฉพาะตัวอักษรและช่องว่าง
  };
  

  const handleInputSurnameChange = (e) => {
    const input = e.target.value;

    // ตรวจสอบว่ามีตัวเลขหรืออักขระพิเศษหรือไม่
    if (/[^ก-๙a-zA-Z\s]/.test(input)) {
      setSurnameError("นามสกุลควรเป็นตัวอักษรเท่านั้น");
    } else {
      setSurnameError(""); // ล้าง error หากไม่มีปัญหา
    }

    setSurname(input.replace(/[^ก-๙a-zA-Z\s]/g, "")); // กรองเฉพาะตัวอักษรและช่องว่าง
  };
  
  return (
    <main className="body">
      <ToastContainer />
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
              <a>เพิ่มข้อมูลทั่วไปผู้ป่วย</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-1">
        <p className="title-header">เพิ่มข้อมูลทั่วไปผู้ป่วย</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label>
                เลขบัตรประชาชน<span className="required"> *</span>
              </label>
              <input
                type="text"
                className={`form-control ${usernameError ? "input-error" : ""}`}
                maxLength="17"
                // placeholder="1-2345-67890-12-3"
                value={username}
                onChange={handleInputUsernameChange}/>
                {usernameError && <span className="error-text">{usernameError}</span>}

            </div>

            <div className="mb-1">
              <label>
                เบอร์โทรศัพท์<span className="required"> *</span>
              </label>
              <input
                type="text"
                maxLength="10"
                className={`form-control ${telError ? "input-error" : ""}`}
                value={tel}
                onChange={handleInputChange}

              />
              {telError && <span className="error-text">{telError}</span>}

            </div>
            <div className="mb-1">
              <label>
                ชื่อ<span className="required"> *</span>
              </label>
              <input
                type="text"
                onChange={handleInputNameChange}
                className={`form-control ${nameError ? "input-error" : ""}`}
                // onChange={(e) => setName(e.target.value)}
              />
              {nameError && <span className="error-text">{nameError}</span>}

            </div>
            <div className="mb-1">
              <label>
                นามสกุล<span className="required"> *</span>
              </label>
              <input
                type="text"
                onChange={handleInputSurnameChange}
                className={`form-control ${surnameError ? "input-error" : ""}`}
                // onChange={(e) => setSurname(e.target.value)}
              />
               {surnameError && <span className="error-text">{surnameError}</span>}

            </div>
            <div className="mb-1 form-container">
              <label>ผู้ป่วยต้องทำกายภาพบำบัด</label>
              
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  checked={physicalTherapy}
                  onChange={(e) => setPhysicalTherapy(e.target.checked)}
                />
              </div>
              <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckDefault"
                >
                  {physicalTherapy ? "ใช่" : "ไม่ใช่"}
                </label>
            </div>


            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
        <div className="btn-group">
          <div className="btn-next">
            {/* <button onClick={() => navigate("/addmdinformation")} className="btn btn-outline py-2">
              ถัดไป
            </button> */}
          </div>
        </div>
      </div>
    </main>
  );
}
