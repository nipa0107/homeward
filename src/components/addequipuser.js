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
  const [selectedEquipments, setSelectedEquipments] = useState([]);

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

  const handleCheckboxChange = (e, equipmentName, equipmentType) => {
    const isChecked = e.target.checked;
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

    // Check for duplicates and update validation messages
    const validationMessages = {};
    updatedEquipments.forEach((equip, index) => {
        const duplicates = updatedEquipments.filter(
            (e) => e.equipmentname_forUser === equip.equipmentname_forUser
        ).length;

        if (duplicates > 1) {
            validationMessages[equip.equipmentname_forUser] = "มีอุปกรณ์นี้อยู่แล้ว";
        }
    });

    setEquipValidationMessages(validationMessages);
    setValidationMessage(""); // Clear general validation message
};

const handleSelectAll = (equipmentType, isChecked) => {
    let updatedEquipments = [...selectedEquipments];

    data
        .filter((equipment) => equipment.equipment_type === equipmentType)
        .forEach((equipment) => {
            if (isChecked) {
                if (
                    !updatedEquipments.some(
                        (equip) => equip.equipmentname_forUser === equipment.equipment_name
                    )
                ) {
                    updatedEquipments.push({
                        equipmentname_forUser: equipment.equipment_name,
                        equipmenttype_forUser: equipmentType,
                    });
                }
            } else {
                updatedEquipments = updatedEquipments.filter(
                    (equip) => equip.equipmentname_forUser !== equipment.equipment_name
                );
            }
        });

    setSelectedEquipments(updatedEquipments);
};

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
      <ToastContainer />
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
        <div className="adminall card mb-1">
          <form onSubmit={handleSubmit}>
            {["อุปกรณ์ติดตัว", "อุปกรณ์เสริม", "อุปกรณ์อื่นๆ"].map(
              (equipmentType) => {
                const isAllSelected = data
                  .filter(
                    (equipment) => equipment.equipment_type === equipmentType
                  )
                  .every((equipment) =>
                    selectedEquipments.some(
                      (equip) =>
                        equip.equipmentname_forUser ===
                        equipment.equipment_name
                    )
                  );

                return (
                  <div key={equipmentType} className="mb-1">
                    <h4 className="equipment-type-title">
                      <b>{equipmentType}</b>
                    </h4>
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={(e) =>
                                handleSelectAll(equipmentType, e.target.checked)
                              }
                            />
                          </th>
                          <th>ลำดับ</th>
                          <th>ชื่ออุปกรณ์</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                          data
                            .filter(
                              (equipment) =>
                                equipment.equipment_type === equipmentType
                            )
                            .map((equipment, index) => (
                              <tr key={equipment._id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    value={equipment.equipment_name}
                                    checked={selectedEquipments.some(
                                      (equip) =>
                                        equip.equipmentname_forUser ===
                                        equipment.equipment_name
                                    )}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        equipment.equipment_name,
                                        equipmentType
                                      )
                                    }
                                  />
                                </td>
                                <td>{index + 1}</td>
                                <td>{equipment.equipment_name}</td>
                                {equipValidationMessages[equipment.equipment_name] && (
                                  <td style={{ color: "red" }}>
                                    {equipValidationMessages[equipment.equipment_name]}
                                  </td>
                                )}
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="3">ไม่มีข้อมูล{equipmentType}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              }
            )}
            {validationMessage && (
              <div style={{ color: "red" }}>{validationMessage}</div>
            )}
            <div className="btn-group">
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
