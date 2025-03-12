import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

export default function UpdateUser() {
  const location = useLocation();
  const { id, user } = location.state;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ID_card_number, setIDCardNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [Address, setAddress] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverSurname, setCaregiverSurname] = useState("");
  const [Relationship, setRelationship] = useState("");
  const [caregiverTel, setCaregiverTel] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [otherGender, setOtherGender] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherRelationship, setOtherRelationship] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const tokenExpiredAlertShown = useRef(false); 
  const [otherGenderError, setOtherGenderError] = useState("");

  const formatIDCardNumber = (id) => {
    if (!id) return "";
    return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5");
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    // ตรวจสอบว่า date เป็น NaN หรือไม่
    if (isNaN(formattedDate.getTime())) {
      return ""; // ถ้าเป็น NaN ให้ส่งค่าว่างกลับไป
    }
    return formattedDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend-deploy-render-mxok.onrender.com/getuser/${id}`);
        const data = await response.json();
        setUsername(data.username);
        setName(data.name);
        setSurname(data.surname);
        setEmail(data.email);
        setPassword(data.password);
        setTel(data.tel);
        setGender(data.gender);
        setBirthday(data.birthday);
        setIDCardNumber(data.ID_card_number);
        setNationality(data.nationality);
        setAddress(data.Address);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCaregiverData = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/getcaregiver/${id}`
        );
        const caregiverData = await response.json();
        if (caregiverData.status === "ok") {
          setCaregiverName(caregiverData.data.name);
          setCaregiverSurname(caregiverData.data.surname);
          setCaregiverTel(caregiverData.data.tel);
          setRelationship(caregiverData.data.Relationship);
        }
      } catch (error) {
        console.error("Error fetching caregiver data:", error);
      }
    };

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
        body: JSON.stringify({ token: token }),
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
    fetchCaregiverData();
  }, [id]);


  const UpdateUser = async () => {
    let hasError = false;
    const cleanedUsername = ID_card_number.replace(/-/g, ""); // ลบเครื่องหมาย "-" หากมี
    if (!cleanedUsername.trim()) {
      setUsernameError("กรุณากรอกเลขประจําตัวประชาชน");
      hasError = true;
    } else if (
      cleanedUsername.length !== 13 ||
      !/^\d+$/.test(cleanedUsername)
    ) {
      setUsernameError("เลขประจําตัวประชาชนต้องเป็นตัวเลข 13 หลัก");
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

    if (showOtherInput && !otherGender.trim()) {
      setOtherGenderError("กรุณากรอกเพศ");
      hasError = true;
    } else {
      setOtherGenderError("");
    }

    if (hasError) return;
    try {
      const userData = {
        username,
        name,
        surname,
        email,
        password,
        tel,
        gender,
        birthday,
        ID_card_number,
        nationality,
        Address,
        // user: id,
        // caregivername: caregiverName,
        // caregiversurname: caregiverSurname,
        // caregivertel: caregiverTel,
        // Relationship
      };

      const response = await fetch(`https://backend-deploy-render-mxok.onrender.com/updateuserapp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log("แก้ไขผู้ใช้แล้ว:", updatedUser);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/allinfo", { state: { id: id, user: user } });
        }, 1100);
      } else {
        toast.error("ไม่สามารถแก้ไขผู้ใช้ได้:", response.statusText);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้:", error);
    }
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

  const handleRelationshipChange = (e) => {
    const value = e.target.value;
    setRelationship(value);
    if (value === "อื่นๆ") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherRelationship("");
    }
  };

  const handleOtherRelationshipChange = (e) => {
    const value = e.target.value;
    setOtherRelationship(value);
    setRelationship(value); // Update gender to the value of otherGender
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
            <li className="middle" >
              <a
                onClick={() => navigate("/allinfo", { state: { id } })} className="info" 
              >
                ข้อมูลการดูแลผู้ป่วย
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a className="info"  onClick={() => navigate("/allinfo", { state: { id } })}>...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลผู้ป่วย</a>
            </li>
          </ul>
        </div>
        
        <div className="adminall card mb-2">
        <p className="title-header">แก้ไขข้อมูลผู้ป่วย</p>
          <div className="mb-2">
            <label>ชื่อผู้ใช้</label>
            <input
              type="text"
              readOnly
              className="form-control gray-background"
              value={formatIDCardNumber(username)}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label>อีเมล</label>
            <input
              type="text"
              value={email}
              readOnly
              className="form-control gray-background"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>เลขประจําตัวประชาชน</label>
            <input
              value={formatIDCardNumber(ID_card_number)}
              type="text"
              readOnly
              className="form-control gray-background"
              onChange={(e) => setIDCardNumber(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label>ชื่อ</label>
            <input
              value={name}
              type="text"
              // className={`form-control ${nameError ? "input-error is-invalid" : ""}`}
              className={`form-control ${nameError ? "input-error" : ""}`}
              // onChange={(e) => setName(e.target.value)}
              onChange={handleInputNameChange}
            />
            {nameError && <span className="error-text">{nameError}</span>}
          </div>
          <div className="mb-2">
            <label>นามสกุล</label>
            <input
              type="text"
              onChange={handleInputSurnameChange}
              className={`form-control ${surnameError ? "input-error" : ""}`}
              value={surname}
              // onChange={(e) => setSurname(e.target.value)}
            />
            {surnameError && <span className="error-text">{surnameError}</span>}
          </div>
{/* 
          <div className="mb-2">
            <label>เพศ</label>
            <div class="relationship-container">
              <div class="relationship-group">
                <div>
                  <label>
                    <input
                      type="radio"
                      value="ชาย"
                      checked={gender === "ชาย"}
                      onChange={handleGenderChange}
                    />
                    ชาย
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="หญิง"
                      checked={gender === "หญิง"}
                      onChange={handleGenderChange}
                    />
                    หญิง
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="ไม่ต้องการระบุ"
                      checked={gender === "ไม่ต้องการระบุ"}
                      onChange={handleGenderChange}
                    />
                    ไม่ต้องการระบุ
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="อื่นๆ"
                      checked={showOtherInput}
                      onChange={handleGenderChange}
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
                    className={`form-control ${otherGenderError ? "input-error" : ""}`}
                    value={otherGender}
                    onChange={handleOtherGenderChange}
                  />
                    {otherGenderError && <span className="error-text">{otherGenderError}</span>}

                </div>
              )}
            </div>
          </div> */}
          <div className="mb-2">
            <label>เพศ</label>
            <input
              type="text"
              value={gender}
              readOnly
              className="form-control gray-background"
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>วันเกิด</label>
            <input
              value={formatDate(birthday)}
              type="date"
              className="form-control"
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label>สัญชาติ</label>
            <input
              value={nationality}
              type="text"
              className="form-control"
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label>ที่อยู่</label>
            <input
              value={Address}
              type="text"
              className="form-control"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              maxLength="10"
              value={tel}
              className={`form-control ${telError ? "input-error" : ""}`}
              onChange={handleInputChange}
              // onChange={(e) => setTel(e.target.value)}
            />
            {telError && <span className="error-text">{telError}</span>}
          </div>

          <div className="d-grid">
            <button
              onClick={UpdateUser}
              // onClick={() => UpdateUser(id)}
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
      
    </main>
  );
}
