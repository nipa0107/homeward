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

export default function AddEquipUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [data, setData] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [adminData, setAdminData] = useState({});
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
  const [token, setToken] = useState("");
  const [selectedEquipType1, setSelectedEquipType1] = useState("");
  const [selectedEquipType2, setSelectedEquipType2] = useState("");
  const [selectedEquipType3, setSelectedEquipType3] = useState("");
  const [equipValidationMessages, setEquipValidationMessages] = useState({});
  const [selectedEquipments, setSelectedEquipments] = useState([]);
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
          setAdminData(data.data);
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
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


  const handleChange = (e, equipTypeSetter, equipType) => {
    equipTypeSetter(e.target.value);
    setEquipValidationMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[equipType];
      return newMessages;
    });
    setValidationMessage(""); // Clear general validation message
  };

  const toggleAllCheckboxes = (e) => {
    const isChecked = e.target.checked;
    let updatedEquipments = [];

    if (isChecked) {
      updatedEquipments = data.map((equipment) => ({
        equipmentname_forUser: equipment.equipment_name,
        equipmenttype_forUser: equipment.equipment_type,
      }));
    }

    setSelectedEquipments(updatedEquipments);
  };

  const handleRowClick = (equipmentName, equipmentType) => {
    setSelectedEquipments((prevSelected) =>
      prevSelected.some((equip) => equip.equipmentname_forUser === equipmentName)
        ? prevSelected.filter((equip) => equip.equipmentname_forUser !== equipmentName)
        : [...prevSelected, { equipmentname_forUser: equipmentName, equipmenttype_forUser: equipmentType }]
    );
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
        <div className="table-responsive">
          <form onSubmit={handleSubmit}>
            <table className="table table-hover" style={{ width: "60%" }}>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>
                    <input
                      style={{ transform: 'scale(1.4)',marginLeft: "45px", cursor: "pointer" }}
                      type="checkbox"
                      onChange={toggleAllCheckboxes}
                    />
                  </th>
                  <th style={{ width: "10%" }}>#</th>
                  <th>ชื่ออุปกรณ์</th>
                </tr>
              </thead>
              <tbody>
                {["อุปกรณ์ติดตัว", "อุปกรณ์เสริม", "อุปกรณ์อื่นๆ"].map((equipmentType) => {
                  const equipmentList = data.filter(
                    (equipment) => equipment.equipment_type === equipmentType
                  );

                  // กรณีไม่มีข้อมูลของประเภทอุปกรณ์นี้
                  if (equipmentList.length === 0) {
                    return (
                      <tr key={equipmentType} className="table-light">
                        <td colSpan="3" className="text-center">
                          ไม่มีข้อมูล {equipmentType}
                        </td>
                      </tr>
                    );
                  }

                  // ตรวจสอบว่าอุปกรณ์ทั้งหมดถูกเลือกหรือไม่
                  const isAllSelected = equipmentList.every((equipment) =>
                    selectedEquipments.some(
                      (equip) => equip.equipmentname_forUser === equipment.equipment_name
                    )
                  );

                  return (
                    <React.Fragment key={equipmentType}>
                      {/* หัวข้อประเภทอุปกรณ์ */}
                      <tr >
                        <td colSpan="3" className="fw-bold text-left"
                          style={{ backgroundColor: "#e8f5fd", cursor: "default" }}>
                          
                          {equipmentType}
                        </td>
                      </tr>

                      {/* รายการอุปกรณ์ */}
                      {equipmentList.map((equipment, index) => (
                        <tr key={equipment._id}
                          onClick={() => handleRowClick(equipment.equipment_name, equipmentType)}
                          style={{ cursor: "pointer" }}>
                          <td style={{ width: "10%" }}>
                            <input
                              style={{ transform: 'scale(1.4)', marginLeft: "45px", pointerEvents: "none" }} // ป้องกัน input รับคลิกตรงๆ
                              
                              type="checkbox"
                              checked={selectedEquipments.some(
                                (equip) => equip.equipmentname_forUser === equipment.equipment_name
                              )}
                              readOnly
                            />
                          </td>
                          <td style={{ width: "10%" }}>{index + 1}</td>
                          <td>{equipment.equipment_name}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {/* ข้อความแจ้งเตือนกรณีมีข้อผิดพลาด */}
            {validationMessage && (
              <div style={{ color: "red", textAlign: "center" }}>{validationMessage}</div>
            )}

            {/* ปุ่มบันทึก */}
            <div className="btn-group mt-3">
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
