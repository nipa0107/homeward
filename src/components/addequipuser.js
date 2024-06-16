import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddEquipUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [data, setData] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [adminData, setAdminData] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [token, setToken] = useState("");
  const [selectedEquipType1, setSelectedEquipType1] = useState("");
  const [selectedEquipType2, setSelectedEquipType2] = useState("");
  const [selectedEquipType3, setSelectedEquipType3] = useState("");
  const [equipValidationMessages, setEquipValidationMessages] = useState({});

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
        body: JSON.stringify({ token: token }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAdminData(data.data);
        });
    }
    getAllEquip();
  }, [token]);

  const getAllEquip = () => {
    fetch("http://localhost:5000/allequip", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedEquipments = [];
    const validationMessages = {};

    if (selectedEquipType1) {
      selectedEquipments.push({
        equipmentname_forUser: selectedEquipType1,
        equipmenttype_forUser: "อุปกรณ์ติดตัว",
      });
    }
    if (selectedEquipType2) {
      selectedEquipments.push({
        equipmentname_forUser: selectedEquipType2,
        equipmenttype_forUser: "อุปกรณ์เสริม",
      });
    }
    if (selectedEquipType3) {
      selectedEquipments.push({
        equipmentname_forUser: selectedEquipType3,
        equipmenttype_forUser: "อุปกรณ์อื่นๆ",
      });
    }

    if (selectedEquipments.length === 0) {
      setValidationMessage("โปรดเลือกอุปกรณ์อย่างน้อยหนึ่งรายการ");
      return;
    }
    if (!id) {
      setValidationMessage("ไม่พบข้อมูลผู้ใช้");
      return;
    }

    // Check for duplicate equipment
    selectedEquipments.forEach((equip, index) => {
      if (
        selectedEquipments.filter(
          (e) => e.equipmentname_forUser === equip.equipmentname_forUser
        ).length > 1
      ) {
        validationMessages[equip.equipmenttype_forUser] =
          "มีอุปกรณ์นี้อยู่แล้ว";
      }
    });

    setEquipValidationMessages(validationMessages);

    if (Object.keys(validationMessages).length > 0) {
      return;
    }

    fetch("http://localhost:5000/addequipuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ equipments: selectedEquipments, userId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allinfo", { state: { id } });
          }, 1100);
        } else if (
          data.status === "error" &&
          data.message === "มีอุปกรณ์นี้อยู่แล้ว"
        ) {
          setValidationMessage("มีอุปกรณ์นี้อยู่แล้ว");
        } else {
          toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
        }
      })
      .catch((error) => {
        console.error("Error adding equipment:", error);
        toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleChange = (e, equipTypeSetter, equipType) => {
    equipTypeSetter(e.target.value);
    setEquipValidationMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[equipType];
      return newMessages;
    });
    setValidationMessage(""); // Clear general validation message
  };

  return (
    <main className="body">
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">
              <img src={logow} className="logow" alt="logo" />
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
              <i class="bi bi-bell"></i>
              <span class="links_name">ตั้งค่าการแจ้งเตือน</span>
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
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div className="profile_details">
          <li>
            <a href="profile">
              <i className="bi bi-person"></i>
              <span className="links_name">
                {adminData && adminData.username}
              </span>
            </a>
          </li>
        </div>
        <hr />
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
              <a
                href="allinfo"
                onClick={() => navigate("/allinfo", { state: { id } })}
              >
                ข้อมูลการดูแลผู้ป่วย
              </a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มอุปกรณ์สำหรับผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มอุปกรณ์สำหรับผู้ป่วย</h3>
        <div className="adminall card mb-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>อุปกรณ์ติดตัว</label>
              <select
                className="form-select"
                value={selectedEquipType1}
                onChange={(e) =>
                  handleChange(e, setSelectedEquipType1, "อุปกรณ์ติดตัว")
                }
              >
                <option value="">เลือกอุปกรณ์ติดตัว</option>
                {data.length > 0 ? (
                  data
                    .filter(
                      (equipment) =>
                        equipment.equipment_type === "อุปกรณ์ติดตัว"
                    )
                    .map((equipment) => (
                      <option
                        key={equipment._id}
                        value={equipment.equipment_name}
                      >
                        {equipment.equipment_name}
                      </option>
                    ))
                ) : (
                  <option value="">ไม่มีข้อมูลอุปกรณ์ติดตัว</option>
                )}
              </select>
              {equipValidationMessages["อุปกรณ์ติดตัว"] && (
                <div style={{ color: "red" }}>
                  {equipValidationMessages["อุปกรณ์ติดตัว"]}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label>อุปกรณ์เสริม</label>
              <select
                className="form-select"
                value={selectedEquipType2}
                onChange={(e) =>
                  handleChange(e, setSelectedEquipType2, "อุปกรณ์เสริม")
                }
              >
                <option value="">เลือกอุปกรณ์เสริม</option>
                {data.length > 0 ? (
                  data
                    .filter(
                      (equipment) => equipment.equipment_type === "อุปกรณ์เสริม"
                    )
                    .map((equipment) => (
                      <option
                        key={equipment._id}
                        value={equipment.equipment_name}
                      >
                        {equipment.equipment_name}
                      </option>
                    ))
                ) : (
                  <option value="">ไม่มีข้อมูลอุปกรณ์เสริม</option>
                )}
              </select>
              {equipValidationMessages["อุปกรณ์เสริม"] && (
                <div style={{ color: "red" }}>
                  {equipValidationMessages["อุปกรณ์เสริม"]}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label>อุปกรณ์อื่นๆ</label>
              <select
                className="form-select"
                value={selectedEquipType3}
                onChange={(e) =>
                  handleChange(e, setSelectedEquipType3, "อุปกรณ์อื่นๆ")
                }
              >
                <option value="">เลือกอุปกรณ์อื่นๆ</option>
                {data.length > 0 ? (
                  data
                    .filter(
                      (equipment) => equipment.equipment_type === "อุปกรณ์อื่นๆ"
                    )
                    .map((equipment) => (
                      <option
                        key={equipment._id}
                        value={equipment.equipment_name}
                      >
                        {equipment.equipment_name}
                      </option>
                    ))
                ) : (
                  <option value=""> ไม่มีข้อมูลอุปกรณ์อื่นๆ</option>
                )}
              </select>
              {equipValidationMessages["อุปกรณ์อื่นๆ"] && (
                <div style={{ color: "red" }}>
                  {equipValidationMessages["อุปกรณ์อื่นๆ"]}
                </div>
              )}
            </div>
            {validationMessage && (
              <div style={{ color: "red" }}>{validationMessage}</div>
            )}
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
              <br />
            </div>
          </form>
        </div>
        <div className="btn-group">
          <div className="btn-pre"></div>
        </div>
      </div>
    </main>
  );
}
