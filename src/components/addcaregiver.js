import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../css/adduser.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

export default function AddCaregiver() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const userId = location.state?.userId;
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherRelationship, setOtherRelationship] = useState("");
  const [formData, setFormData] = useState({
    ID_card_number: "",
    user: userId || "",
    name: "",
    surname: "",
    tel: "",
    Relationship: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [telError, setTelError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [otherError, setOtherError] = useState("");
  const [RelationshiError, setRelationshipError] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false); // เพิ่ม state เพื่อเก็บสถานะการดึงข้อมูล
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleSave = async (event) => {
    event.preventDefault();
    let hasError = false;

    const textRegex = /^[ก-๙a-zA-Z\s]+$/;

    const cleanedUsername = formData.ID_card_number.replace(/-/g, ""); // ลบเครื่องหมาย "-" หากมี
    if (!cleanedUsername.trim()) {
      setUsernameError("กรุณากรอกเลขบัตรประชาชนประชาชน");
      hasError = true;
    } else if (
      cleanedUsername.length !== 13 ||
      !/^\d+$/.test(cleanedUsername)
    ) {
      setUsernameError("เลขบัตรประชาชนประชาชนต้องเป็นตัวเลข 13 หลัก");
      hasError = true;
    } else {
      setUsernameError("");
    }
    // if (formData.tel.trim() && formData.tel.length !== 10) {
    //   setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
    //   hasError = true;
    // } else {
    //   setTelError("");
    // }
    if (!formData.tel.trim()) {
      setTelError("กรุณากรอกเบอร์โทรศัพท์");
      hasError = true;
    } else if (formData.tel.length !== 10) {
      setTelError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
      hasError = true;
    } else if (!/^\d+$/.test(formData.tel)) {
      setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
      hasError = true;
    } else {
      setTelError("");
    }

    if (!formData.name.trim()) {
      setNameError("กรุณากรอกชื่อ");
      hasError = true;
    } else if (!textRegex.test(formData.name)) {
      setNameError("ชื่อต้องเป็นตัวอักษรเท่านั้น");
      hasError = true;
    } else {
      setNameError("");
    }

    // ตรวจสอบนามสกุล
    if (!formData.surname.trim()) {
      setSurnameError("กรุณากรอกนามสกุล");
      hasError = true;
    } else if (!textRegex.test(formData.surname)) {
      setSurnameError("นามสกุลต้องเป็นตัวอักษรเท่านั้น");
      hasError = true;
    } else {
      setSurnameError("");
    }

    if (!showOtherInput && !formData.Relationship.trim()) {
      setRelationshipError("กรุณาเลือกความสัมพันธ์");
      hasError = true;
    } else {
      setRelationshipError("");
    }

    if (showOtherInput) {
      if (!otherRelationship.trim()) {
        setOtherError("กรุณาระบุความสัมพันธ์");
        hasError = true;
      } else if (!textRegex.test(otherRelationship)) {
        setOtherError("ความสัมพันธ์ต้องเป็นตัวอักษรเท่านั้น");
        hasError = true;
      } else {
        setOtherError("");
      }
    } else {
      // เมื่อไม่ได้เลือก "อื่นๆ" ไม่ต้องแสดง error สำหรับ otherRelationship
      setOtherError("");
    }

    if (hasError) return;
    const updatedFormData = { ...formData, ID_card_number: cleanedUsername };

    try {
      const response = await fetch("https://backend-deploy-render-mxok.onrender.com/addcaregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData), // ส่ง formData ที่อัปเดตแล้ว
      });

      const data = await response.json();
      if (data.status === "Ok") {
        toast.success("เพิ่มข้อมูลสำเร็จ");
        console.log("Navigating to /allinfo with ID:", userId);
        setTimeout(() => {
          navigate("/allinfo", { state: { id: id } });
        }, 1000);
      } else {
        // setError(data.error);
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error adding caregiver:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  const handleBreadcrumbClick = () => {
    navigate("/allinfo", { state: { id: id } });
  };
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
  // const handleOtherRelationshipChange = (e) => {
  //   const value = e.target.value;
  //   setOtherRelationship(value);
  //   setFormData((prev) => ({ ...prev, Relationship: value }));
  // };
  const handleOtherRelationshipChange = (e) => {
    const value = e.target.value;
    setOtherRelationship(value);

    // ตรวจสอบว่าเป็นตัวอักษรเท่านั้น
    if (/[^ก-๙a-zA-Z\s]/.test(value)) {
      setOtherError("กรุณากรอกเป็นตัวอักษรเท่านั้น");
    } else {
      setOtherError(""); // ลบข้อความผิดพลาดเมื่อกรอกถูกต้อง
    }

    setFormData((prev) => ({ ...prev, Relationship: value }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "ID_card_number" && value === "") {
      setFormData((prev) => ({
        ...prev,
        name: "",
        surname: "",
        tel: "",
      }));
      setIsDataFetched(false);
    }

    if (name === "tel") {
      // ตรวจสอบเบอร์โทรศัพท์
      if (/[^0-9]/.test(value)) {
        setTelError("เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น");
      } else {
        setTelError("");
      }
    } else if (name === "ID_card_number") {
      // ตรวจสอบเลขประจำตัวประชาชน
      let input = value.replace(/\D/g, "");
      if (input.length > 13) input = input.slice(0, 13);
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
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      setUsernameError(
        input.length === 13 ? "" : "เลขประจำตัวประชาชนไม่ครบ 13 หลัก"
      );
    } else if (name === "name" || name === "surname") {
      // ตรวจสอบชื่อและนามสกุล
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

    if (
      name === "ID_card_number" &&
      (value.length === 17 || value.length === 13 || value.length === 16)
    ) {
      try {
        const cleanedId = value.replace(/-/g, "");
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/getCaregiverById/${cleanedId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (data.status === "Ok") {
          // หากเจอข้อมูล อัปเดตฟอร์มด้วยชื่อ-นามสกุลที่ได้
          setFormData((prev) => ({
            ...prev,
            name: data.caregiver.name || "",
            surname: data.caregiver.surname || "",
            tel: data.caregiver.tel || "",
          }));
          setIsDataFetched(true);
        } else {
          // toast.error("ไม่พบข้อมูลผู้ดูแลสำหรับเลขบัตรนี้");
          setFormData((prev) => ({
            ...prev,
            name: "",
            surname: "",
            tel: "",
          }));
          setIsDataFetched(false);
        }
      } catch (error) {
        console.error("Error fetching caregiver data:", error);
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ดูแล");
      }
    }
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

            <li className="middle">
              <a onClick={handleBreadcrumbClick} className="info">
                ข้อมูลการดูแลผู้ป่วย
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a onClick={handleBreadcrumbClick} className="info">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลผู้ดูแล</a>
            </li>
          </ul>
        </div>
        <div className="adminall card mb-1">
        <p className="title-header">เพิ่มข้อมูลผู้ดูแล</p>
          <form>
            <div className="mb-1">
              <label>
                เลขบัตรประชาชน<span className="required"> *</span>
              </label>
              <input
                type="text"
                className={`form-control ${usernameError ? "input-error" : ""}`}
                name="ID_card_number"
                value={formData.ID_card_number}
                onChange={handleChange}
                onPaste={(e) => handleChange(e)}
              />
              {usernameError && (
                <span className="error-text">{usernameError}</span>
              )}
            </div>
            <div className="mb-1">
              <label>
                ชื่อ<span className="required"> *</span>
              </label>
              <input
                type="text"
                className={`form-control ${nameError ? "input-error" : ""}`}
                name="name"
                value={formData.name}
                disabled={isDataFetched}
                onChange={handleChange}
              />
              {nameError && <span className="error-text">{nameError}</span>}
            </div>
            <div className="mb-1">
              <label>
                นามสกุล<span className="required"> *</span>
              </label>
              <input
                type="text"
                className={`form-control ${surnameError ? "input-error" : ""}`}
                name="surname"
                value={formData.surname}
                disabled={isDataFetched}
                onChange={handleChange}
              />
              {surnameError && (
                <span className="error-text">{surnameError}</span>
              )}
            </div>
            <div className="mb-1">
              <label>
                ความสัมพันธ์<span className="required"> *</span>
              </label>
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
                        checked={formData.Relationship === "แม่"}
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
                  {RelationshiError && (
                    <span className="error-text">{RelationshiError}</span>
                  )}
                </div>
                {showOtherInput && (
                  <div className="mt-2">
                    <label>
                    ระบุความสัมพันธ์อื่นๆ<span className="required"> *</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        otherError ? "input-error" : ""
                      }`}
                      value={otherRelationship}
                      onChange={handleOtherRelationshipChange}
                    />
                  </div>
                )}
                {otherError && <span className="error-text">{otherError}</span>}
              </div>
            </div>
            <div className="mb-1">
              <label>
                เบอร์โทรศัพท์<span className="required"> *</span>
              </label>
              <input
                type="text"
                className={`form-control ${telError ? "input-error" : ""}`}
                name="tel"
                maxLength="10"
                value={formData.tel}
                disabled={isDataFetched}
                onChange={handleChange}
              />
              {telError && <span className="error-text">{telError}</span>}
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-outline py-2"
                onClick={handleSave}
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
