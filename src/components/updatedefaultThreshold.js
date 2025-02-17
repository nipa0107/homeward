import React, { useEffect, useState } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/setnoti.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function UpdateDefault() {
  const navigate = useNavigate(); 
  const [defaultThreshold, setDefaultThreshold] = useState(null);
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
  const [painscore, setPainscore] = useState("")

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

  useEffect(() => {
    fetch('http://localhost:5000/get-default-threshold')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setDefaultThreshold(data.data);
          setMax({
            SBP: data.data.SBP?.max || "",
            DBP: data.data.DBP?.max || "",
            PulseRate: data.data.PulseRate?.max || "",
            Temperature: data.data.Temperature?.max || "",
            DTX: data.data.DTX?.max || "",
            Respiration: data.data.Respiration?.max || "",
          });
          setMin({
            SBP: data.data.SBP?.min || "",
            DBP: data.data.DBP?.min || "",
            PulseRate: data.data.PulseRate?.min || "",
            Temperature: data.data.Temperature?.min || "",
            DTX: data.data.DTX?.min || "",
            Respiration: data.data.Respiration?.min || "",
          });
          setPainscore(data.data.Painscore)
        } else {
          console.error("ไม่สามารถดึงข้อมูล Default Threshold ได้");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/update-default-threshold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({
                min,
                max,
                painscore
              }),
       
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('บันทึกข้อมูลสำเร็จ');
        setTimeout(() => {
            navigate("/alluserinsetting");
          }, 1100);
      } else {
        toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };
  if (!defaultThreshold) {
    return <div>Loading...</div>;  // กรณีที่ยังไม่ดึงข้อมูลมาแสดง
  }



  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

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
      <div className="header">ตั้งค่าการแจ้งเตือนเริ่มต้น</div>
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
            <a href="alluserinsetting">รายชื่อผู้ป่วย</a>
          </li>
          <li className="arrow">
            <i className="bi bi-chevron-double-right"></i>
          </li>
          <li>
            <a>ตั้งค่าการแจ้งเตือนสัญญาณชีพเริ่มต้น</a>
          </li>
        </ul>
      </div>
      <div className="formsetnoti">
        <form  onSubmit={handleSubmit}>
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
              value={min.SBP || ""}
              onChange={(e) => setMin({ ...min, SBP: e.target.value })}
              required
            />
            {/* <label>Max:</label> */}
            <input
              type="number"
              value={max.SBP || ""}
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
              value={min.DBP || ""}
              onChange={(e) => setMin({ ...min, DBP: e.target.value })}
              required
            />
            {/* <label>Max:</label> */}

            <input
              type="number"
              value={max.DBP || ""}
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
              value={min.PulseRate || ""}
              onChange={(e) => setMin({ ...min, PulseRate: e.target.value })}
              required
            />
            {/* <label>Max:</label> */}

            <input
              type="number"
              value={max.PulseRate || ""}
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
              value={min.Respiration || ""}
              onChange={(e) =>
                setMin({ ...min, Respiration: e.target.value })
              }
              required
            />
            {/* <label>Max:</label> */}
            <input
              type="number"
              value={max.Respiration || ""}
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
              value={min.Temperature || ""}
              onChange={(e) =>
                setMin({ ...min, Temperature: e.target.value })
              }
              required
            />
            {/* <label>Max:</label> */}
            <input
              type="number"
              value={max.Temperature || ""}
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
              value={min.DTX || ""}
              onChange={(e) => setMin({ ...min, DTX: e.target.value })}
              required
            />
            {/* <label>Max:</label> */}
            <input
              type="number"
              value={max.DTX || ""}
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
              value={painscore || ""}
              onChange={(e) => setPainscore( e.target.value )}
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

export default UpdateDefault;
