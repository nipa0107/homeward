import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";
export default function AddEquipUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [data, setData] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [adminData, setAdminData] = useState({});
  const [token, setToken] = useState("");
  const [selectedEquipType1, setSelectedEquipType1] = useState("");
  const [selectedEquipType2, setSelectedEquipType2] = useState("");
  const [selectedEquipType3, setSelectedEquipType3] = useState("");
  const [equipValidationMessages, setEquipValidationMessages] = useState({});
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const tokenExpiredAlertShown = useRef(false);
  const [equipmentCounts, setEquipmentCounts] = useState({});
  const [equipments, setEquipments] = useState([]);

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
          setAdminData(data.data);
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }

  }, [token]);

  const [medicalEquipment, setMedicalEquipment] = useState([]);
  useEffect(() => {
    const fetchMedicalEquipmentThenEquip = async () => {
      try {
        const res = await fetch(`https://backend-deploy-render-mxok.onrender.com/equipment/${id}`);
        const data = await res.json();
        setMedicalEquipment(data);

        // รอโหลด medicalEquipment ก่อน แล้วค่อย fetch อุปกรณ์ทั้งหมด
        const allEquipRes = await fetch("https://backend-deploy-render-mxok.onrender.com/allequip", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allEquipData = await allEquipRes.json();

        if (Array.isArray(allEquipData.data)) {
          setEquipments(allEquipData.data);

          // คำนวณจำนวนเฉพาะอุปกรณ์ที่ยังไม่มี
          const counts = allEquipData.data.reduce((acc, item) => {
            const alreadyAssigned = data.some(
              (equip) => equip.equipmentname_forUser === item.equipment_name
            );
            if (!alreadyAssigned) {
              acc[item.equipment_type] = (acc[item.equipment_type] || 0) + 1;
            }
            return acc;
          }, {});
          setEquipmentCounts(counts);
        }
      } catch (error) {
        console.error("Error loading equipment:", error);
      }
    };

    fetchMedicalEquipmentThenEquip();
  }, [id, token]);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedEquipments.length === 0) {
      setValidationMessage("โปรดเลือกอุปกรณ์อย่างน้อยหนึ่งรายการ");
      return;
    }
    if (!id) {
      setValidationMessage("ไม่พบข้อมูลผู้ใช้");
      return;
    }

    if (Object.keys(equipValidationMessages).length > 0) {
      return;
    }

    fetch("https://backend-deploy-render-mxok.onrender.com/addequipuser", {
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
        } else {
          toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
        }
      })
      .catch((error) => {
        console.error("Error adding equipment:", error);
        toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      });
  };

  const toggleAllCheckboxes = () => {
    const unassignedEquipments = equipments.filter(equipment =>
      equipment.equipment_type === selectedCategory &&
      !medicalEquipment.some(
        (me) => me.equipmentname_forUser === equipment.equipment_name
      )
    );

    const allSelected = unassignedEquipments.every(equipment =>
      selectedEquipments.some(
        (equip) => equip.equipmentname_forUser === equipment.equipment_name
      )
    );

    if (allSelected) {
      // ยกเลิกเฉพาะของประเภทนี้
      const remaining = selectedEquipments.filter(
        (equip) =>
          equip.equipmenttype_forUser !== selectedCategory
      );
      setSelectedEquipments(remaining);
    } else {
      const validEquipments = unassignedEquipments.map(equipment => ({
        equipmentname_forUser: equipment.equipment_name,
        equipmenttype_forUser: equipment.equipment_type,
      }));

      setSelectedEquipments([...selectedEquipments, ...validEquipments]);
    }

    setValidationMessage("");
  };
  const handleCheckboxChange = (e, equipmentName, equipmentType) => {
    const isChecked = e ? e.target.checked : !selectedEquipments.some(
      equip => equip.equipmentname_forUser === equipmentName
    );

    let updatedEquipments;

    if (isChecked) {
      updatedEquipments = [
        ...selectedEquipments,
        {
          equipmentname_forUser: equipmentName,
          equipmenttype_forUser: equipmentType,
        },
      ];
    } else {
      updatedEquipments = selectedEquipments.filter(
        (equip) => equip.equipmentname_forUser !== equipmentName
      );
    }

    setSelectedEquipments(updatedEquipments);
    setValidationMessage(""); // ไม่ต้องแจ้งเตือนแล้ว
  };
  const [selectedCategory, setSelectedCategory] = useState("อุปกรณ์ติดตัว");

  return (
    <main className="body">
      <ToastContainer />
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
                className="info"
                onClick={() => navigate("/allinfo", { state: { id } })}
              >
                ข้อมูลการดูแลผู้ป่วย
              </a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a onClick={() => navigate("/allinfo", { state: { id } })}
                className="info"
              >...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มอุปกรณ์สำหรับผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <p className="title-header-user">เพิ่มอุปกรณ์สำหรับผู้ป่วย</p>
        <div className="equipment-category ps-5 pe-5 mt-4">

          {/* ปุ่มเลือกประเภทอุปกรณ์ */}
          <div className="assessment-tabs mt-0">
            {["อุปกรณ์ติดตัว", "อุปกรณ์เสริม", "อุปกรณ์อื่นๆ"].map((type) => (
              <button
                key={type}
                className={`tab-btn ${selectedCategory === type ? "active" : ""}`}
                onClick={() => setSelectedCategory(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* แสดงชื่อประเภท + จำนวน + แจ้งเตือน */}
          <div className="mb-2 fw-bold d-flex align-items-center" style={{ color: "#1565c0" }}>
            <span>
              {selectedCategory} (จำนวน {equipmentCounts[selectedCategory] || 0} รายการ)
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ทำให้ตารางอยู่กับที่ + มี scrollbar ถ้ายาว */}
            <div style={{ overflowY: "auto" }}>
              <table className="equipment-table table-hover" style={{ border: "1px solid #ddd" }}>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>
                      {equipmentCounts[selectedCategory] > 0 && (
                        <input
                          style={{ marginLeft: "20px", cursor: "pointer",transform: 'scale(1.4)' }}
                          type="checkbox"
                          onChange={toggleAllCheckboxes}
                          checked={
                            equipments.filter(e =>
                              e.equipment_type === selectedCategory &&
                              !medicalEquipment.some(
                                (me) => me.equipmentname_forUser === e.equipment_name
                              )
                            ).every(e =>
                              selectedEquipments.some(
                                (se) => se.equipmentname_forUser === e.equipment_name
                              )
                            )
                          }
                        />
                      )}
                    </th>
                    <th style={{ width: "10%" }}>#</th>
                    <th>ชื่ออุปกรณ์</th>
                  </tr>
                </thead>


                <tbody>
                  {(() => {
                    const equipmentList = equipments.filter(
                      (equipment) => {
                        const isSameType = equipment.equipment_type === selectedCategory;
                        const alreadyAssigned = medicalEquipment.some(
                          (me) => me.equipmentname_forUser === equipment.equipment_name
                        );
                        return isSameType && !alreadyAssigned;
                      }
                    );

                    // ✅ เช็คว่าไม่มีอุปกรณ์ให้เลือก เพราะ "ถูกเลือกครบแล้ว"
                    const originalEquipmentsOfCategory = equipments.filter(
                      (e) => e.equipment_type === selectedCategory
                    );
                    const allAssigned =
                      originalEquipmentsOfCategory.length > 0 &&
                      originalEquipmentsOfCategory.every((e) =>
                        medicalEquipment.some(
                          (me) => me.equipmentname_forUser === e.equipment_name
                        )
                      );

                    if (equipmentList.length === 0) {
                      return (
                        <tr className="table-light">
                          <td colSpan="3" className="text-center">
                            {allAssigned
                              ? `คุณได้เพิ่ม ${selectedCategory} ครบแล้ว`
                              : `ไม่มีข้อมูล ${selectedCategory}`}
                          </td>
                        </tr>
                      );
                    }

                    return equipmentList.map((equipment, index) => (
                      <tr
                        key={equipment._id}
                        onClick={() =>
                          handleCheckboxChange(
                            null,
                            equipment.equipment_name,
                            selectedCategory
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td style={{ width: "10%" }}>
                          <input
                            style={{ marginLeft: "20px", pointerEvents: "none",transform: 'scale(1.4)' }}
                            type="checkbox"
                            checked={selectedEquipments.some(
                              (equip) =>
                                equip.equipmentname_forUser === equipment.equipment_name
                            )}
                            readOnly
                          />
                        </td>
                        <td style={{ width: "10%" }}>{index + 1}</td>
                        <td>{equipment.equipment_name}</td>
                      </tr>
                    ));
                  })()}
                </tbody>


              </table>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="btn-group mt-4">
              <div className="btn-next">
                <button type="submit" className="btn btn-outline py-2">
                  บันทึก
                </button>
              </div>
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
