import React, { useState, useEffect } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddMedicalInformation() {
  const [data, setData] = useState([]);
  const location = useLocation();
  const { id } = location.state || {};
  const [HN, setHN] = useState("");
  const [AN, setAN] = useState("");
  const [Diagnosis, setDiagnosis] = useState("");
  const [Chief_complaint, setChief_complaint] = useState("");
  const [Present_illness, setPresent_illness] = useState("");
  const [Phychosocial_assessment, setPhychosocial_assessment] = useState("");
  const [Management_plan, setManagement_plan] = useState("");
  const [date_Admit, setDate_Admit] = useState("");
  const [date_DC, setDate_DC] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  // const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [fileM, setFileM] = useState(null);
  const [fileP, setFileP] = useState(null);
  const [filePhy, setFilePhy] = useState(null);
  const [selectedFileName1, setSelectedFileName1] = useState("");
  const [selectedFileName2, setSelectedFileName2] = useState("");
  const [selectedFileName3, setSelectedFileName3] = useState("");
  const [pdfURL1, setPdfURL1] = useState(null);
  const [pdfURL2, setPdfURL2] = useState(null);
  const [pdfURL3, setPdfURL3] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const { state } = useLocation();


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
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAdminData(data.data);
        });
    }
    getAllMpersonnel();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("HN", HN);
    formData.append("AN", AN);
    formData.append("Date_Admit", date_Admit);
    formData.append("Date_DC", date_DC);
    formData.append("Diagnosis", Diagnosis);
    formData.append("selectedPersonnel", selectedPersonnel);
    formData.append("Chief_complaint", Chief_complaint);
    formData.append("Present_illness", Present_illness);
    formData.append("Phychosocial_assessment", Phychosocial_assessment);
    formData.append("Management_plan", Management_plan);
    formData.append("fileP", fileP);
    formData.append("fileM", fileM);
    formData.append("filePhy", filePhy);
    formData.append("userId", id); // Append userId to formData

    // Ensure token exists
    const token = window.localStorage.getItem("token");
    if (!token) {
      toast.error("กรุณาเข้าสู่ระบบ");
      return;
    }

    fetch("http://localhost:5000/addmedicalinformation", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Directly send FormData
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addmdinformation");
        if (data.status === "ok") {
          toast.success("เพิ่มข้อมูลสำเร็จ");
          navigate("/allinfo", { state: { id } });
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        toast.error("เกิดข้อผิดพลาดขณะเพิ่มข้อมูล");
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  const getAllMpersonnel = () => {
    fetch("http://localhost:5000/allMpersonnel", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllMpersonnel");
        setData(data.data);
      });
  };

  const onInputfileChange1 = (e) => {
    console.log(e.target.files[0]);
    setFileP(e.target.files[0]);
    setSelectedFileName1(e.target.files[0].name);
    const pdfURL1 = URL.createObjectURL(e.target.files[0]);
    setPdfURL1(pdfURL1);
  };
  const onInputfileChange2 = (e) => {
    console.log(e.target.files[0]);
    setFileM(e.target.files[0]);
    setSelectedFileName2(e.target.files[0].name);
    const pdfURL2 = URL.createObjectURL(e.target.files[0]);
    setPdfURL2(pdfURL2);
  };
  const onInputfileChange3 = (e) => {
    console.log(e.target.files[0]);
    setFilePhy(e.target.files[0]);
    setSelectedFileName3(e.target.files[0].name);
    const pdfURL3 = URL.createObjectURL(e.target.files[0]);
    setPdfURL3(pdfURL3);
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
              <i class="bi bi-bandaid"></i>
              <span class="links_name" >จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting" >
            <i class="bi bi-bell"></i>              
            <span class="links_name" >ตั้งค่าการแจ้งเตือน</span>
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
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div className="profile_details">
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
            <li>
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="allinfo" onClick={() => navigate("/allinfo", { state: { id } })} >ข้อมูลการดูแลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลการเจ็บป่วย</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มข้อมูลการเจ็บป่วย</h3>
        <div className="adminall card mb-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label>HN</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setHN(e.target.value)}
              />
            </div>
            <div className="mb-1">
              <label>AN</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setAN(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>วันที่ Admit </label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDate_Admit(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>วันที่ D/C</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDate_DC(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>แพทย์ผู้ดูแล</label>
              <select
                className="form-select"
                value={selectedPersonnel}
                onChange={(e) => setSelectedPersonnel(e.target.value)}
              >
                <option value="">โปรดเลือกแพทย์</option>
                {data.length > 0 ? (
                  data.map((personnel) => (
                    <option key={personnel._id} value={personnel._id}>
                      {`${personnel.nametitle} ${personnel.name}`}
                    </option>
                  ))
                ) : (
                  <option value="">ไม่มีข้อมูลแพทย์</option>
                )}
              </select>
            </div>

            <div className="mb-1">
              <label>Diagnosis</label>
              <textarea
                className="form-control"
                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }} // ให้ textarea สามารถปรับขนาดได้ในทิศทางดิสพล์เมนต์
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>Chief complaint</label>
              <textarea
                className="form-control"
                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }}
                onChange={(e) => setChief_complaint(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>Present illness</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={onInputfileChange1}
              />
              <div className="filename ">
                {selectedFileName1 && (
                  <div className="mb-3 pdf">
                    <a href={pdfURL1} target="_blank" rel="noopener noreferrer">
                      {selectedFileName1}
                    </a>
                  </div>
                )}
              </div>

              <textarea
                className="form-control"
                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }}
                onChange={(e) => setPresent_illness(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>Management plan</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={onInputfileChange2}
              />
              <div className="filename ">
                {selectedFileName2 && (
                  <div className="mb-3 pdf">
                    <a href={pdfURL2} target="_blank" rel="noopener noreferrer">
                      {selectedFileName2}
                    </a>
                  </div>
                )}
              </div>
              <textarea
                className="form-control"
                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }}
                onChange={(e) => setManagement_plan(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>Phychosocial assessment</label>

              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={onInputfileChange3}
              />
              <div className="filename ">
                {selectedFileName3 && (
                  <div className="mb-3 pdf">
                    <a href={pdfURL3} target="_blank" rel="noopener noreferrer">
                      {selectedFileName3}
                    </a>
                  </div>
                )}
              </div>
              <textarea
                className="form-control"
                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }}
                onChange={(e) => setPhychosocial_assessment(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
        {/* <div className="btn-group">
          <div className="btn-pre">
            <button
              onClick={() => navigate("/adduser")}
              className="btn btn-outline py-2"
            >
              ก่อนหน้า
            </button>
          </div>
          <div className="btn-next">
            <button
              onClick={() => navigate("/addequipuser")}
              className="btn btn-outline py-2"
            >
              ถัดไป
            </button>
          </div>
        </div> */}
      </div>
    </main>
  );
}
