import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

export default function UpdateEquipUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // Receive userId from the state passed during navigation
  const [data, setData] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [adminData, setAdminData] = useState({});
  const [token, setToken] = useState("");
  const [selectedEquipType1, setSelectedEquipType1] = useState("");
  const [selectedEquipType2, setSelectedEquipType2] = useState("");
  const [selectedEquipType3, setSelectedEquipType3] = useState("");
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
        body: JSON.stringify({ token: token }),
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
    getAllEquip();
  }, [token]);

  const getAllEquip = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/allequip", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllEquip");
        setData(data.data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedEquipments = [];

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
      console.error("UserId is missing");
      setValidationMessage("ไม่พบข้อมูลผู้ใช้");
      return;
    }

    fetch(`https://backend-deploy-render-mxok.onrender.com/updateequipuser/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ equipments: selectedEquipments }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          toast.success("อัปเดตข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allinfo", { state: { id } });
          }, 1100);
        } else {
          toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
      })
      .catch((error) => {
        console.error("Error updating equipment:", error);
        toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      });
  };

  return (
    <main className="body">
     <Sidebar />
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
              <a
                // href="allinfo"
                onClick={() => navigate("/allinfo", { state: { id } })}
              >
                ข้อมูลการดูแลผู้ป่วย
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a onClick={() => navigate("/allinfo", { state: { id } })}>...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขอุปกรณ์สำหรับผู้ป่วย</a>
            </li>
          </ul>
        </div>

        <div className="adminall card mb-3">
          <p className="title-header">แก้ไขอุปกรณ์สำหรับผู้ป่วย</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>อุปกรณ์ติดตัว</label>
              <select
                className="form-select"
                value={selectedEquipType1}
                onChange={(e) => setSelectedEquipType1(e.target.value)}
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
            </div>
            <div className="mb-2">
              <label>อุปกรณ์เสริม</label>
              <select
                className="form-select"
                value={selectedEquipType2}
                onChange={(e) => setSelectedEquipType2(e.target.value)}
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
            </div>
            <div className="mb-2">
              <label>อุปกรณ์อื่นๆ</label>
              <select
                className="form-select"
                value={selectedEquipType3}
                onChange={(e) => setSelectedEquipType3(e.target.value)}
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
