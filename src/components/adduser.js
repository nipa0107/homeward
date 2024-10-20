import React, { useState, useEffect } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import th from "date-fns/locale/th";
import "../css/adduser.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddUser() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const [tel, setTel] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [physicalTherapy, setPhysicalTherapy] = useState(false);

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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length !== 13) {
      setError("เลขประจำตัวบัตรประชาชนต้องมีความยาว 13 ตัวอักษร");
      // toast.error("เลขประจำตัวบัตรประชาชนต้องมีความยาว 13 ตัวอักษร");
      return;
    }
    fetch("http://localhost:5000/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
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
            navigate("/physicalTherapyUser", { state: { userData: data.user } });
          } else {
            navigate("/displayUser", { state: { userData: data.user } });
          }
        } else {
          setError(data.error);
          // toast.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("An unexpected error occurred.");
      });
  };
  

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
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
            <li>
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มข้อมูลทั่วไปผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มข้อมูลทั่วไปผู้ป่วย</h3>
        <div className="adminall card mb-1">
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label>
                เลขประจำตัวบัตรประชาชน<span className="required"> *</span>
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label>
                เบอร์โทรศัพท์<span className="required"> *</span>
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setTel(e.target.value)}
              />
            </div>
            <div className="mb-1">
              <label>
                ชื่อ<span className="required"> *</span>
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-1">
              <label>
                นามสกุล<span className="required"> *</span>
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setSurname(e.target.value)}
              />
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

            <p id="errormessage" className="errormessage">
              {error}
            </p>
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
