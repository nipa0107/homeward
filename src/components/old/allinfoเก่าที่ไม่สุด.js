import React, { useEffect, useState } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function AllUser() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [token, setToken] = useState("");
  const location = useLocation();
  const { id } = location.state;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  // const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ID_card_number, setIDCardNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [Address, setAddress] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverSurname, setCaregiverSurname] = useState("");
  const [Relationship, setRelationship] = useState("");
  const [caregiverTel, setCaregiverTel] = useState("");
  const [medicalInfo, setMedicalInfo] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลการดูแลผู้ป่วย
  const [mdata, setMData] = useState([]);
  const [docter, setDocter] = useState("");
  const [medicalEquipment, setMedicalEquipment] = useState(null);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [error, setError] = useState("");
  const [caregiverInfo, setCaregiverInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${id}`);
        const userdata = await response.json();
        setData([data.data]);
        setUsername(userdata.data.username);
        setName(userdata.data.name);
        setSurName(userdata.data.surname);
        setBirthday(userdata.data.birthday);
        setGender(userdata.data.gender);
        setNationality(userdata.data.nationality);
        setIDCardNumber(userdata.data.ID_card_number);
        setTel(userdata.data.tel);
        setAddress(userdata.data.Address);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    const fetchCaregiverData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/getcaregiver/${id}`
        );
        const caregiverData = await response.json();
        if (caregiverData.status === "ok") {
          setCaregiverInfo(caregiverData.data);
          setCaregiverName(caregiverData.data.name);
          setCaregiverSurname(caregiverData.data.surname);
          setCaregiverTel(caregiverData.data.tel);
          setRelationship(caregiverData.data.Relationship);
        }
        console.log("caregiverData", caregiverInfo);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCaregiverInfo(null);
        } else {
          console.error("Error fetching caregiver info:", error);
        }
      }
    };
    fetchUserId();
    fetchCaregiverData();
  }, [id]);

  useEffect(() => {
    const fetchMedicalInformation = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/medicalInformation/${id}`
        );
        const medicalData = await response.json();

        if (medicalData && medicalData.data) {
          setMedicalInfo(medicalData.data);
          console.log("medicalDataupdate:", medicalData);
        } else {
          console.error("Medical information not found for this user");
        }
      } catch (error) {
        console.error("Error fetching medical information:", error);
      }
    };
    fetchMedicalInformation();
  }, [id]);

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/equipment/${id}`);
        const equipmentData = await response.json();
        setMedicalEquipment(equipmentData);
        console.log("EquipmentUser Data:", equipmentData);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };
    fetchEquipmentData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (medicalInfo && medicalInfo.selectedPersonnel) {
          const response = await fetch(
            `http://localhost:5000/getmpersonnel/${medicalInfo.selectedPersonnel}`
          );
          const mdata = await response.json();
          setMData(mdata);
          console.log("Data:", mdata);
        }
      } catch (error) {
        console.error("Error fetching caremanual data:", error);
      }
    };
    fetchData();
  }, [medicalInfo]);

  // const deleteUser = async () => {
  //   if (window.confirm(`คุณต้องการลบ ${username} หรือไม่ ?`)) {
  //     try {
  //       const response = await fetch(`http://localhost:5000/deleteUser/${id}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         alert(data.data);
  //         navigate("/alluser");
  //       } else {
  //         console.error("Error during deletion:", data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error during fetch:", error);
  //     }
  //   }
  // };
  const deleteUser = async () => {
    const adminPassword = prompt("กรุณากรอกรหัสผ่านของคุณเพื่อยืนยันการลบ:");

    if (!adminPassword) {
      alert("การลบถูกยกเลิกเนื่องจากไม่ได้กรอกรหัสผ่าน");
      return;
    }

    if (window.confirm(`คุณต้องการลบ ${username} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteUser/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // ใช้ token ของ Admin
          },
          body: JSON.stringify({
            adminPassword,
            adminId: adminData._id, // ส่ง ID ของ Admin ที่เข้าสู่ระบบ
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // alert(data.data);
          toast.success("ลบข้อมูลผู้ป่วยสำเร็จ");
          setTimeout(() => {
            navigate("/alluser");
          }, 1050);
        } else {
          // setError(data.error);

          alert(data.data);
          console.error("Error during deletion:", data.data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  const handleDeleteEquipment = async (equipmentName) => {
    if (window.confirm(`คุณต้องการลบอุปกรณ์ ${equipmentName} หรือไม่?`)) {
      try {
        const response = await fetch(
          `http://localhost:5000/deleteEquipuser/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ equipmentName, userId: id }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          // รีเฟรชหน้าหลังจากลบข้อมูล
          window.location.reload();
        } else {
          console.error("Error during deletion:", data.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  const handleDeleteMedicalInfo = async () => {
    if (window.confirm("คุณต้องการลบข้อมูลการเจ็บป่วยหรือไม่?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/deletemedicalInformation/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          window.location.reload(); // รีเฟรชหน้าหลังจากลบข้อมูล
        } else {
          console.error("Error during deletion:", data.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  const handleViewPDF = () => {
    // ทำการเรียกดูไฟล์ PDF ที่เกี่ยวข้อง
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };
  const currentDate = new Date();
  let userAge = "0 ปี 0 เดือน"; // เริ่มต้นให้แสดง "0 ปี 0 เดือน"

  if (birthday) {
    const userBirthday = new Date(birthday);
    const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();
    const monthDiff = currentDate.getMonth() - userBirthday.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < userBirthday.getDate())
    ) {
      userAge = `${ageDiff - 1} ปี ${12 + monthDiff} เดือน`;
    } else {
      userAge = `${ageDiff} ปี ${monthDiff} เดือน`;
    }
  }

  console.log(userAge); // แสดงผลอายุผู้ใช้

  const handleCheckboxChange = (equipmentName) => {
    setSelectedEquipments((prevSelected) =>
      prevSelected.includes(equipmentName)
        ? prevSelected.filter((name) => name !== equipmentName)
        : [...prevSelected, equipmentName]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedEquipments.length === 0) {
      alert("กรุณาเลือกอุปกรณ์ที่ต้องการลบ");
      return;
    }

    if (window.confirm(`คุณต้องการลบอุปกรณ์ที่เลือกหรือไม่?`)) {
      try {
        const response = await fetch(
          `http://localhost:5000/deleteEquipuser/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              equipmentNames: selectedEquipments,
              userId: id,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          // รีเฟรชหน้าหลังจากลบข้อมูล
          window.location.reload();
        } else {
          console.error("Error during deletion:", data.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
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
          <div className="header">จัดการข้อมูลผู้ป่วย</div>
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
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ข้อมูลการดูแลผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <h3>ข้อมูลการดูแลผู้ป่วย</h3>
        <div className="info3 card mb-1">
          <div className="header">
            <b>ข้อมูลทั่วไป</b>
          </div>
          <div className="user-info mt-3">
            <div className="left-info">
              <p>
                <span>ชื่อ-สกุล</span>
              </p>
              <p>
                <span>เลขบัตรประชาชน</span>
              </p>
              <p>
                <span>อายุ</span>
              </p>
              <p>
                <span>เพศ</span>
              </p>
              <p>
                <span>สัญชาติ</span>
              </p>
              <p>
                <span>ที่อยู่</span>
              </p>
              <p>
                <span>เบอร์โทรศัพท์</span>
              </p>
              {/* <p>
                <span>ผู้ดูแล</span>
              </p>
              <p>
                <span>ความสัมพันธ์</span>
              </p>
              <p>
                <span>เบอร์โทรศัพท์ผู้ดูแล</span>
              </p> */}
            </div>
            <div className="right-info">
              <p>
                <b>{name || "-"}</b> <b>{surname || "-"}</b>
              </p>
              <p>
                <b>{ID_card_number || "-"}</b>
              </p>
              <p>
                <b>{userAge}</b>
              </p>
              <p>
                <b>{gender || "-"}</b>
              </p>
              <p>
                <b>{nationality || "-"}</b>
              </p>
              <p>
                <b>{Address || "-"}</b>
              </p>
              <p>
                <b>{tel || "-"}</b>
              </p>
              {/* <p>

                <b>{caregiverName || '-'}</b> <b>{caregiverSurname || '-'}</b>
              </p>
              <p>
                <b>{Relationship || '-'}</b>
              </p>
              <p>
                <b>{caregiverTel || '-'}</b>
              </p> */}
            </div>
          </div>

          <div className="btn-group mb-4">
            <div className="editimg1">
              <button
                onClick={() =>
                  navigate("/updateuser", {
                    state: { id },
                  })
                }
              >
                แก้ไข
              </button>
            </div>
            <div className="deleteimg1">
              <button onClick={() => deleteUser()}>ลบ</button>
            </div>
          </div>
        </div>
        <br></br>
        <div className="info3 card mb-3">
          <div className="header">
            <b>ข้อมูลผู้ดูแล</b>
          </div>
          <div className="user-info-caregiver">
            {caregiverInfo && caregiverInfo.length > 0 ? (
              <div>
                {caregiverInfo.map((caregiver, index) => (
                  <div className="inline-container" key={index}>
                    <p>
                    <span>ผู้ดูแลคนที่ {index + 1}:</span>
                    </p>
                    <div className="caregiver-card">
                      <p>
                        <span>ชื่อ-สกุล:</span> {caregiver.name || "-"}{" "}
                        {caregiver.surname || "-"}
                      </p>
                      <p>
                        <span>ความสัมพันธ์:</span> {caregiver.Relationship || "-"}
                      </p>
                      <p>
                        <span>เบอร์โทรศัพท์:</span> {caregiver.tel || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p>ไม่มีข้อมูลผู้ดูแล</p>
              </div>
            )}
          </div>
        </div>

        <br></br>
        <div className="info3 card mb-1">
          <div className="header">
            <b>ข้อมูลการเจ็บป่วย</b>
          </div>
          {medicalInfo ? (
            <>
              <div className="user-info mt-3">
                <div className="left-info">
                  <p>
                    <span>HN</span>
                  </p>
                  <p>
                    <span>AN</span>
                  </p>
                  <p>
                    <span>วันที่ Admit</span>
                  </p>
                  <p>
                    <span>วันที่ D/C</span>
                  </p>
                  <p>
                    <span>Diagnosis</span>
                  </p>
                  <p>
                    <span>แพทย์ผู้ดูแล</span>
                  </p>
                  <p>
                    <span>Chief_complaint</span>
                  </p>
                  <p>
                    <span>Present illness</span>
                  </p>
                  <p>
                    <span>File Present illness</span>
                  </p>
                  <p>
                    <span>Management plan</span>
                  </p>
                  <p>
                    <span>File Management plan</span>
                  </p>
                  <p>
                    <span>Phychosocial assessment</span>
                  </p>
                  <p>
                    <span>File Phychosocial assessment</span>
                  </p>
                </div>
                <div className="right-info">
                  <p>
                    <b>{medicalInfo.HN || "-"}</b>
                  </p>
                  <p>
                    <b>{medicalInfo.AN || "-"}</b>
                  </p>
                  <p>
                    <b>
                      {medicalInfo.Date_Admit
                        ? new Date(medicalInfo.Date_Admit).toLocaleDateString(
                            "th-TH",
                            { day: "numeric", month: "long", year: "numeric" }
                          )
                        : "-"}
                    </b>
                  </p>
                  <p>
                    <b>
                      {medicalInfo.Date_DC
                        ? new Date(medicalInfo.Date_DC).toLocaleDateString(
                            "th-TH",
                            { day: "numeric", month: "long", year: "numeric" }
                          )
                        : "-"}
                    </b>
                  </p>
                  <p>
                    <b>{medicalInfo.Diagnosis || "-"}</b>
                  </p>
                  <p>
                    <b>
                      {mdata.nametitle || mdata.name || mdata.surname
                        ? `${mdata.nametitle || ""} ${mdata.name || ""} ${
                            mdata.surname || ""
                          }`.trim()
                        : "-"}
                    </b>
                  </p>
                  <p>
                    <b>{medicalInfo.Chief_complaint || "-"}</b>
                  </p>
                  <p>
                    <b>{medicalInfo.Present_illness || "-"}</b>
                  </p>
                  <p>
                    <b>
                      {medicalInfo.fileP ? (
                        <a
                          style={{ color: "grey" }}
                          href=""
                          onClick={() => {
                            // const filePath = medicalInfo.fileP.replace(/\\/g, "/");
                            // const fileName = filePath.split("/").pop();
                            // console.log("fileName:", fileName);
                            window.open(`${medicalInfo.fileP}`, "_blank");
                          }}
                        >
                          {medicalInfo.filePName}
                        </a>
                      ) : (
                        "-"
                      )}
                    </b>
                  </p>
                  <p>
                    <b>{medicalInfo.Management_plan || "-"}</b>
                  </p>
                  <p>
                    <b>
                      {medicalInfo.fileM ? (
                        <a
                          style={{ color: "grey" }}
                          href=""
                          onClick={() => {
                            // const filePath = medicalInfo.fileM.replace(/\\/g, "/");
                            // const fileName = filePath.split("/").pop();
                            // console.log("fileName:", fileName);
                            window.open(`${medicalInfo.fileM}`, "_blank");
                          }}
                        >
                          {medicalInfo.fileMName}
                        </a>
                      ) : (
                        "-"
                      )}
                    </b>
                  </p>
                  <p>
                    <b>{medicalInfo.Phychosocial_assessment || "-"}</b>
                  </p>
                  <p>
                    <b>
                      {medicalInfo.filePhy ? (
                        <a
                          style={{ color: "grey" }}
                          href=""
                          onClick={() => {
                            // const filePath = medicalInfo.filePhy.replace(/\\/g, "/");
                            // const fileName = filePath.split("/").pop();
                            // console.log("fileName:", fileName);
                            window.open(`${medicalInfo.filePhy}`, "_blank");
                          }}
                        >
                          {medicalInfo.filePhyName}
                        </a>
                      ) : (
                        "-"
                      )}
                    </b>
                  </p>
                </div>
              </div>
              <div className="btn-group mb-4">
                <div className="editimg1">
                  <button
                    onClick={() =>
                      navigate("/updatemedicalinformation", {
                        state: { id },
                      })
                    }
                  >
                    แก้ไข
                  </button>
                </div>
                <div className="deleteimg1">
                  <button onClick={handleDeleteMedicalInfo}>ลบ</button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <p className="no-equipment">ไม่พบข้อมูล</p>
              <div className="btn-group mb-4">
                <div className="adddata">
                  <button
                    onClick={() =>
                      navigate("/addmdinformation", { state: { id } })
                    }
                  >
                    เพิ่มข้อมูล
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <br></br>
        <div className="info3 card mb-1">
          <div className="header">
            <b>อุปกรณ์ทางการแพทย์</b>
          </div>
          {medicalEquipment && medicalEquipment.length > 0 ? (
            <>
              {Object.entries(
                medicalEquipment.reduce((acc, equipment) => {
                  if (!acc[equipment.equipmenttype_forUser]) {
                    acc[equipment.equipmenttype_forUser] = [];
                  }
                  acc[equipment.equipmenttype_forUser].push(equipment);
                  return acc;
                }, {})
              ).map(([type, equipments]) => {
                // Determine if all items in this category are selected
                const allSelected = equipments.every((equipment) =>
                  selectedEquipments.includes(equipment.equipmentname_forUser)
                );

                return (
                  <div key={type} className="equipment-category">
                    <h4 className="mt-3">
                      <b>{type}</b>
                    </h4>
                    <table className="equipment-table mb-5">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() => {
                                if (allSelected) {
                                  // Unselect all items in this category
                                  setSelectedEquipments((prevSelected) =>
                                    prevSelected.filter(
                                      (name) =>
                                        !equipments.some(
                                          (equipment) =>
                                            equipment.equipmentname_forUser ===
                                            name
                                        )
                                    )
                                  );
                                } else {
                                  // Select all items in this category
                                  setSelectedEquipments((prevSelected) => [
                                    ...prevSelected,
                                    ...equipments
                                      .filter(
                                        (equipment) =>
                                          !prevSelected.includes(
                                            equipment.equipmentname_forUser
                                          )
                                      )
                                      .map(
                                        (equipment) =>
                                          equipment.equipmentname_forUser
                                      ),
                                  ]);
                                }
                              }}
                            />
                          </th>
                          <th>ลำดับ</th>
                          <th>ชื่ออุปกรณ์</th>
                          <th>วันที่เพิ่ม</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipments.map((equipment, index) => (
                          <tr key={equipment._id}>
                            <td>
                              <input
                                type="checkbox"
                                className="mb-2"
                                checked={selectedEquipments.includes(
                                  equipment.equipmentname_forUser
                                )}
                                onChange={() =>
                                  handleCheckboxChange(
                                    equipment.equipmentname_forUser
                                  )
                                }
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{equipment.equipmentname_forUser}</td>
                            <td>
                              {new Date(equipment.createdAt).toLocaleDateString(
                                "th-TH",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
              <div className="btn-group mb-4">
                <div className="adddata">
                  <button
                    onClick={() => navigate("/addequipuser", { state: { id } })}
                  >
                    เพิ่มอุปกรณ์
                  </button>
                </div>
                <div className="deleteimg1 mt-2">
                  <button onClick={handleDeleteSelected}>ลบอุปกรณ์</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="no-equipment">ไม่พบข้อมูล</div>
              <div className="btn-group mb-4">
                <div className="adddata">
                  <button
                    onClick={() => navigate("/addequipuser", { state: { id } })}
                  >
                    เพิ่มอุปกรณ์
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
