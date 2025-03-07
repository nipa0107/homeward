import React, { useEffect, useState, useRef } from "react";
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
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
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
  const tokenExpiredAlertShown = useRef(false);

  const { id, name, surname, gender, birthday } = location.state || {};
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
          if (
            data.data === "token expired" &&
            !tokenExpiredAlertShown.current
          ) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
  }, []);

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const handleToggleSidebar = () => {
    setIsActive((prevState) => !prevState);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsActive(false); // ซ่อน Sidebar เมื่อจอเล็ก
      } else {
        setIsActive(true); // แสดง Sidebar เมื่อจอใหญ่
      }
    };

    handleResize(); // เช็กขนาดจอครั้งแรก
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <li className="middle">
              <a href="alluserinsetting">รายชื่อผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="alluserinsetting">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ตั้งค่าการแจ้งเตือนสัญญาณชีพ</a>
            </li>
          </ul>
        </div>

        <div className="patient-card">
          <p className="patient-name">
            <label>ข้อมูลผู้ป่วย</label>
          </p>
          <div className="info-row">
            <div className="info-item">
              <label>ชื่อ-สกุล:</label>{" "}
              <span>
                {name} {surname}
              </span>
            </div>
            <div className="info-item">
              <label>อายุ:</label>{" "}
              <span>
                {birthday
                  ? `${userAge} ปี ${userAgeInMonths} เดือน`
                  : "0 ปี 0 เดือน"}
              </span>
            </div>
            <div className="info-item">
              <label> เพศ:</label> <span>{gender}</span>
            </div>
            <div className="info-item">
              <label>ผู้ป่วยโรค:</label>{" "}
              <span>
                {medicalData && medicalData.Diagnosis
                  ? medicalData.Diagnosis
                  : "ไม่มีข้อมูล"}
              </span>
            </div>
          </div>
        </div>

        {/* <div className="formsetnoti">
          <form onSubmit={handleSubmit}>
            <div className="input-group-header">
              <label className="titlenoti"></label>
              <label className="titlenoti-min">ค่าต่ำสุด</label>
              <label className="titlenoti-max">ค่าสูงสุด</label>
              <label className="unitnoti"></label>
            </div>

            <div className="input-group">
              <label className="titlenoti">อุณหภูมิ</label>
              <div className="input-wrapper">
                <label className="input-label">Min</label>
                <input
                  type="number"
                  value={min.Temperature}
                  onChange={(e) =>
                    setMin({ ...min, Temperature: e.target.value })
                  }
                  required
                />
                <span className="unit-label">°C</span>
              </div>
              <div className="input-wrapper">
                <label className="input-label">Max</label>
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
            </div>
            <div className="input-group">
              <label className="titlenoti">ความดันตัวบน</label>
              <div className="input-wrapper">
                <label className="input-label">Min</label>
                <input
                  type="number"
                  value={min.SBP}
                  onChange={(e) => setMin({ ...min, SBP: e.target.value })}
                  required
                />
                <label className="unitnoti">mmHg</label>
              </div>
              <div className="input-wrapper">
                <label className="input-label">Max</label>
                <input
                  type="number"
                  value={max.SBP}
                  onChange={(e) => setMax({ ...max, SBP: e.target.value })}
                  required
                />
                <label className="unitnoti">mmHg</label>
              </div>
            </div>
            <div className="input-group">
              <label className="titlenoti">ความดันตัวล่าง</label>
              <div className="input-wrapper">
                <label className="input-label">Min</label>
                <input
                  type="number"
                  value={min.DBP}
                  onChange={(e) => setMin({ ...min, DBP: e.target.value })}
                  required
                />
                <label className="unitnoti">mmHg</label>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Max</label>
                <input
                  type="number"
                  value={max.DBP}
                  onChange={(e) => setMax({ ...max, DBP: e.target.value })}
                  required
                />
                <label className="unitnoti">mmHg</label>
                <label className="unitnoti">mmHg</label>
              </div>
            </div>
            <div className="input-group">
              <label className="titlenoti">ชีพจร</label>
              <div className="input-wrapper">
                <label className="input-label">Min</label>
                <input
                  type="number"
                  value={min.PulseRate}
                  onChange={(e) =>
                    setMin({ ...min, PulseRate: e.target.value })
                  }
                  required
                />
                <label className="unitnoti">ครั้ง/นาที</label>
              </div>
              <div className="input-wrapper">
                <label className="input-label">Max</label>
                <input
                  type="number"
                  value={max.PulseRate}
                  onChange={(e) =>
                    setMax({ ...max, PulseRate: e.target.value })
                  }
                  required
                />
                <label className="unitnoti">ครั้ง/นาที</label>
              </div>
            </div>
            <div className="input-group">
              <label className="titlenoti">การหายใจ</label>
              <div className="input-wrapper">
                <label className="input-label">Min</label>
                <input
                  type="number"
                  value={min.Respiration}
                  onChange={(e) =>
                    setMin({ ...min, Respiration: e.target.value })
                  }
                  required
                />
                <label className="unitnoti">ครั้ง/นาที</label>
              </div>
              <div className="input-wrapper">
                <label className="input-label">Max</label>
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
            </div>
            <div className="input-group">
              <label className="titlenoti">ระดับความเจ็บปวด</label>
              <input
                type="number"
                value={painscore}
                onChange={(e) => setPainscore(e.target.value)}
                required
              />
              <label className="unitnoti"></label>
            </div>
            <div className="input-group">
              <label className="titlenoti">ระดับน้ำตาลในเลือด</label>
              <div className="input-wrapper">
                <label className="input-label">Min</label>
                <input
                  type="number"
                  value={min.DTX}
                  onChange={(e) => setMin({ ...min, DTX: e.target.value })}
                  required
                />
                <label className="unitnoti">mg/dL</label>
              </div>
              <div className="input-wrapper">
                <label className="input-label">Max</label>
                <input
                  type="number"
                  value={max.DTX}
                  onChange={(e) => setMax({ ...max, DTX: e.target.value })}
                  required
                />
                <label className="unitnoti">mg/dL</label>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div> */}
        <div className="formsetnoti">
          <form onSubmit={handleSubmit}>
            {[
              { label: "อุณหภูมิ", key: "Temperature", unit: "(°C)" },
              { label: "ความดันตัวบน", key: "SBP", unit: "(mmHg)" },
              { label: "ความดันตัวล่าง", key: "DBP", unit: "(mmHg)" },
              { label: "ชีพจร", key: "PulseRate", unit: "(ครั้ง/นาที)" },
              { label: "การหายใจ", key: "Respiration", unit: "(ครั้ง/นาที)" },
              { label: "ระดับน้ำตาลในเลือด", key: "DTX", unit: "(mg/dL)" },
            ].map(({ label, key, unit }) => (
              <div className="input-group" key={key}>
                <label className="titlenoti">{label}&nbsp;<span className="unit-label">{unit}</span></label>
                <div className="input-wrapper">
                  <div className="input-box">
                    <span className="input-prefix">Min</span>
                    <input
                      type="number"
                      value={min[key]}
                      onChange={(e) =>
                        setMin({ ...min, [key]: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="input-prefix">Max</span>
                    <input
                      type="number"
                      value={max[key]}
                      onChange={(e) =>
                        setMax({ ...max, [key]: e.target.value })
                      }
                      required
                    />
                  </div>
                  
                </div>
              </div>
            ))}
            <div className="input-group">
              <label className="titlenoti">ระดับความเจ็บปวด</label>
              <div className="input-wrapper">
                <div className="input-box">
                  <span className="input-prefix">Med</span>
                  <input
                    type="number"
                    value={painscore}
                    onChange={(e) => setPainscore(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="d-grid">
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
