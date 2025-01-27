import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/setnoti.css";

import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SettingNoti() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [medicalData, setMedicalData] = useState([]);
  const [min, setMin] = useState({
    SBP: "",
    DBP: "",
    PulseRate: "",
    Temperature: "",
    DTX: "",
    Respiration: "",
  });
  const [max, setMax] = useState({
    SBP: "",
    DBP: "",
    PulseRate: "",
    Temperature: "",
    DTX: "",
    Respiration: "",
  });
  const [painscore, setPainscore] = useState("");

  const { id, name, surname,gender,birthday } = location.state || {};
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);
  const currentDate = new Date();
  useEffect(() => {
    if (birthday) {
      const userBirthday = new Date(birthday);
      const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();
      const monthDiff = currentDate.getMonth() - userBirthday.getMonth();
      setUserAgeInMonths(monthDiff >= 0 ? monthDiff : 12 + monthDiff);

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDate.getDate() < userBirthday.getDate())
      ) {
        setUserAge(ageDiff - 1);
      } else {
        setUserAge(ageDiff);
      }
    }
  }, [currentDate]);
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/profile", {
        method: "POST",
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

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };


  useEffect(() => {
    if (id) {
      const fetchMedicalInfo = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/medicalInformation/${id}`
          );
          const data = await response.json();
          console.log("Medical Information:", data);
          setMedicalData(data.data);
          console.log("22:", medicalData);
        } catch (error) {
          console.error("Error fetching medical information:", error);
        }
      };

      fetchMedicalInfo();
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/update-threshold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        min,
        max,
        painscore,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success("แก้ไขข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/alluserinsetting");
          }, 1100);
        } else {
          alert("Error updating threshold");
        }
      });
  };

  const threshold = {
    SBP: { min: 90, max: 140 },
    DBP: { min: 60, max: 90 },
    PulseRate: { min: 60, max: 100 },
    Temperature: { min: 36.5, max: 37.5 },
    DTX: { min: 80, max: 180 },
    Respiration: { min: 16, max: 20 },
    Painscore: 5,
  };

  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const token = window.localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/get-threshold", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: id,
            }),
          });

          const data = await response.json();
          if (data.status === "success") {
            setMin({
              SBP: data.min.SBP,
              DBP: data.min.DBP,
              PulseRate: data.min.PulseRate,
              Temperature: data.min.Temperature,
              DTX: data.min.DTX,
              Respiration: data.min.Respiration,
            });

            setMax({
              SBP: data.max.SBP,
              DBP: data.max.DBP,
              PulseRate: data.max.PulseRate,
              Temperature: data.max.Temperature,
              DTX: data.max.DTX,
              Respiration: data.max.Respiration,
            });
            setPainscore(data.Painscore);
          } else {
            // ถ้าไม่พบข้อมูล threshold ใช้ค่าเริ่มต้น
            setMin({
              SBP: threshold.SBP.min,
              DBP: threshold.DBP.min,
              PulseRate: threshold.PulseRate.min,
              Temperature: threshold.Temperature.min,
              DTX: threshold.DTX.min,
              Respiration: threshold.Respiration.min,
            });

            setMax({
              SBP: threshold.SBP.max,
              DBP: threshold.DBP.max,
              PulseRate: threshold.PulseRate.max,
              Temperature: threshold.Temperature.max,
              DTX: threshold.DTX.max,
              Respiration: threshold.Respiration.max,
            });
            setPainscore(threshold.Painscore);
          }
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล threshold:", error);
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล threshold");
      }
    };

    fetchThreshold();
  }, [id]);

  const handleCancel = () => {
    navigate(-1);
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
          <div className="header">ตั้งค่าการแจ้งเตือน</div>
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
            <li>
              <a href="alluserinsetting">รายชื่อผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ตั้งค่าการแจ้งเตือนสัญญาณชีพ</a>
            </li>
          </ul>
        </div>
        <div className="user-details">
  <p><strong>ชื่อ-สกุล:</strong> {name} {surname}</p>
  {birthday ? (
    <p className="textassesment">
      <strong>อายุ:</strong> {userAge} ปี {userAgeInMonths} เดือน{" "}
      <strong>เพศ:</strong> {gender}
    </p>
  ) : (
    <p className="textassesment">
      <strong>อายุ:</strong> 0 ปี 0 เดือน <strong>เพศ:</strong> {gender}
    </p>
  )}
  <p className="textassesment">
    <strong>HN:</strong> {medicalData && medicalData.HN ? medicalData.HN : "ไม่มีข้อมูล"}{" "}
    <strong>AN:</strong> {medicalData && medicalData.AN ? medicalData.AN : "ไม่มีข้อมูล"}{" "}
    <strong>ผู้ป่วยโรค:</strong> {medicalData && medicalData.Diagnosis ? medicalData.Diagnosis : "ไม่มีข้อมูล"}
  </p>
</div>

        <div className="formsetnoti">
          
          <form onSubmit={handleSubmit}>
            <div className="input-group-header">
              <label className="titlenoti"></label>
              <label className="titlenoti-min">ค่าต่ำสุด</label>
              <label className="titlenoti-max">ค่าสูงสุด</label>
              <label className="unitnoti"></label>
            </div>
            <div className="input-group">
              <label className="titlenoti">ความดันตัวบน</label>
              {/* <label>Min:</label> */}
              <input
                type="number"
                value={min.SBP}
                onChange={(e) => setMin({ ...min, SBP: e.target.value })}
                required
              />
              {/* <label>Max:</label> */}
              <input
                type="number"
                value={max.SBP}
                onChange={(e) => setMax({ ...max, SBP: e.target.value })}
                required
              />
              <label className="unitnoti">mmHg</label>
            </div>

            <div className="input-group">
              <label className="titlenoti">ความดันตัวล่าง</label>
              {/* <label>Min:</label> */}

              <input
                type="number"
                value={min.DBP}
                onChange={(e) => setMin({ ...min, DBP: e.target.value })}
                required
              />
              {/* <label>Max:</label> */}

              <input
                type="number"
                value={max.DBP}
                onChange={(e) => setMax({ ...max, DBP: e.target.value })}
                required
              />
              <label className="unitnoti">mmHg</label>
            </div>

            <div className="input-group">
              <label className="titlenoti">ชีพจร</label>
              {/* <label>Min:</label> */}
              <input
                type="number"
                value={min.PulseRate}
                onChange={(e) => setMin({ ...min, PulseRate: e.target.value })}
                required
              />
              {/* <label>Max:</label> */}

              <input
                type="number"
                value={max.PulseRate}
                onChange={(e) => setMax({ ...max, PulseRate: e.target.value })}
                required
              />
              <label className="unitnoti">ครั้ง/นาที</label>
            </div>

            <div className="input-group">
              <label className="titlenoti">การหายใจ</label>
              {/* <label>Min:</label> */}
              <input
                type="number"
                value={min.Respiration}
                onChange={(e) =>
                  setMin({ ...min, Respiration: e.target.value })
                }
                required
              />
              {/* <label>Max:</label> */}
              <input
                type="number"
                value={max.Respiration}
                onChange={(e) =>
                  setMax({ ...max, Respiration: e.target.value })
                }
                required
              />
              <label className="unitnoti">ครั้ง/นาที</label>
            </div>
            <div className="input-group">
              <label className="titlenoti">อุณหภูมิ</label>
              {/* <label>Min:</label> */}
              <input
                type="number"
                value={min.Temperature}
                onChange={(e) =>
                  setMin({ ...min, Temperature: e.target.value })
                }
                required
              />
              {/* <label>Max:</label> */}
              <input
                type="number"
                value={max.Temperature}
                onChange={(e) =>
                  setMax({ ...max, Temperature: e.target.value })
                }
                required
              />
              <label className="unitnoti">°C</label>
            </div>

            <div className="input-group">
              <label className="titlenoti">ระดับน้ำตาลในเลือด</label>
              {/* <label>Min:</label> */}
              <input
                type="number"
                value={min.DTX}
                onChange={(e) => setMin({ ...min, DTX: e.target.value })}
                required
              />
              {/* <label>Max:</label> */}
              <input
                type="number"
                value={max.DTX}
                onChange={(e) => setMax({ ...max, DTX: e.target.value })}
                required
              />
              <label className="unitnoti">mg/dL</label>
            </div>

            <div className="input-group">
              <label className="titlenoti">ระดับความเจ็บปวด</label>
              {/* <label>Min:</label> */}
              <input
                type="number"
                value={painscore}
                onChange={(e) => setPainscore(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              {/* <button type="button" className="btn btn-outline py-2" onClick={handleCancel}>ยกเลิก</button> */}
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
