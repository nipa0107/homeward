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
  const { id } = location.state || {};

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
    DTX: { min: 70, max: 110 },
    Respiration: { min: 16, max: 20 },
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
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
            </div>
          </div>
          <i class="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul class="nav-list">
          <li>
            <a href="home">
              <i class="bi bi-book"></i>
              <span class="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i class="bi bi-person-plus"></i>
              <span class="links_name">จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i class="bi bi-people"></i>
              <span class="links_name">จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i class="bi bi-prescription2"></i>
              <span class="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i class="bi bi-bandaid"></i>
              <span class="links_name">จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting">
              <i class="bi bi-bell"></i>
              <span class="links_name">ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name">จัดการแอดมิน</span>
            </a>
          </li>

          <div class="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i
                  class="bi bi-box-arrow-right"
                  id="log_out"
                  onClick={logOut}
                ></i>
                <span class="links_name">ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="header">ตั้งค่าการแจ้งเตือน</div>
        <div class="profile_details ">
          <li>
            <a href="profile">
              <i class="bi bi-person"></i>
              <span class="links_name">{adminData && adminData.username}</span>
            </a>
          </li>
        </div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a href="home">
                <i class="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="alluserinsetting">รายชื่อผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ตั้งค่าการแจ้งเตือน</a>
            </li>
          </ul>
        </div>
        <div className="formsetnoti">
          <form onSubmit={handleSubmit}>
            <div className="input-group-header">
              <label className="titlenoti"></label>
              <label  className="titlenoti-min">ค่าต่ำสุด</label>
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
