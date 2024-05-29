import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function AllUser({ }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
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
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverSurname, setCaregiverSurname] = useState('');
  const [Relationship, setRelationship] = useState('');
  const [caregiverTel, setCaregiverTel] = useState('');
  const [medicalInfo, setMedicalInfo] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลการดูแลผู้ป่วย
  const [mdata, setMData] = useState([]);
  const [docter, setDocter] = useState("");
  const [medicalEquipment, setMedicalEquipment] = useState(null);


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
        const response = await fetch(`http://localhost:5000/getcaregiver/${id}`);
        const caregiverData = await response.json();
        if (caregiverData.status === 'ok') {
          setCaregiverName(caregiverData.data.name);
          setCaregiverSurname(caregiverData.data.surname);
          setCaregiverTel(caregiverData.data.tel);
          setRelationship(caregiverData.data.Relationship);
        }
      } catch (error) {
        console.error("Error fetching caregiver data:", error);
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

  const deleteUser = async () => {
    if (window.confirm(`คุณต้องการลบ ${username} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteUser/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          navigate("/alluser");
        } else {
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
        const response = await fetch(`http://localhost:5000/deleteEquipuser/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ equipmentName, userId: id }),
        });

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

  // กำหนดวันที่ปัจจุบัน
  const currentDate = new Date();

  // คำนวณอายุและแสดงเป็นอายุที่มีเดือนด้วย
const userBirthday = new Date(birthday); // แปลงวันเกิดของผู้ใช้เป็นวัตถุ Date
const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear(); // คำนวณความแตกต่างระหว่างปีปัจจุบันกับปีเกิดของผู้ใช้
const monthDiff = currentDate.getMonth() - userBirthday.getMonth(); // คำนวณความแตกต่างระหว่างเดือนปัจจุบันกับเดือนเกิดของผู้ใช้

// ตรวจสอบว่าวันเกิดของผู้ใช้มีเกินวันปัจจุบันหรือไม่
// ถ้ายังไม่เกิน แสดงอายุเป็นผลลัพธ์ (ปี และ เดือน)
// ถ้าเกินแล้ว ลดอายุลง 1 ปี
let userAge = "";
if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < userBirthday.getDate())) {
  userAge = `${ageDiff - 1} ปี ${12 + monthDiff} เดือน`;
} else {
  userAge = `${ageDiff} ปี ${monthDiff} เดือน`;
}

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
              <span class="links_name" >จัดการอาการผู้ป่วย</span>
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
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
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
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ข้อมูลการดูแลผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <h3>ข้อมูลการดูแลผู้ป่วย</h3>
        <div>
          <div className="cardall card mb-3">
            <h5>
              <b>ข้อมูลทั่วไป</b>
            </h5>
            <div className="user-info">
              <div className="left-info">
                {name || surname ? (
                  <p>
                    ชื่อ-สกุล  <b>{name || '-'} {surname || '-'}</b>
                  </p>
                ) : (
                  <p>
                    ชื่อ-สกุล <b>-</b>
                  </p>
                )}
                {ID_card_number ? (
                  <p>
                    เลขบัตรประชาชน <b>{ID_card_number}</b>
                  </p>
                ) : (
                  <p>
                    เลขบัตรประชาชน <b>-</b>
                  </p>
                )}
                {birthday ? (
                  <p>
                    อายุ <b>{userAge} ปี</b> 
                  </p>
                ) : (
                  <p>
                    อายุ <b>-</b>
                  </p>
                )}
                {gender ? (
                  <p>
                    เพศ <b>{gender}</b>
                  </p>
                ) : (
                  <p>
                    เพศ <b>-</b>
                  </p>
                )}
                {nationality ? (
                  <p>
                    สัญชาติ <b>{nationality}</b>
                  </p>
                ) : (
                  <p>
                    สัญชาติ <b>-</b>
                  </p>
                )}
                {Address ? (
                  <p>
                    ที่อยู่ <b>{Address}</b>
                  </p>
                ) : (
                  <p>
                    ที่อยู่ <b>-</b>
                  </p>
                )}
                {tel ? (
                  <p>
                    เบอร์โทรศัพท์ <b>{tel}</b>
                  </p>
                ) : (
                  <p>
                    เบอร์โทรศัพท์<b>-</b>
                  </p>
                )}
                <b>ผู้ดูแล</b>
                {caregiverName || caregiverSurname ? (
                  <p>
                    ชื่อ-สกุล  <b>{caregiverName || '-'} {caregiverSurname || '-'}</b>
                  </p>
                ) : (
                  <p>
                    ชื่อ-สกุล <b>-</b>
                  </p>
                )}
                {Relationship ? (
                  <p>
                    ความสัมพันธ์ <b>{Relationship}</b>
                  </p>
                ) : (
                  <p>
                    ความสัมพันธ์<b>-</b>
                  </p>
                )}
                {tel ? (
                  <p>
                    เบอร์โทรศัพท์ <b>{caregiverTel}</b>
                  </p>
                ) : (
                  <p>
                    เบอร์โทรศัพท์<b>-</b>
                  </p>
                )}
              </div>
              <div className="right-info">
                {/* {name ? (
                  <p>
                    <b> {name}</b>
                  </p>
                ) : (
                  <p>
                    <b>-</b> ชื่อ:
                  </p>
                )} */}
              </div>
            </div>
            <div className="btn-group">
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

          <div className="cardall card mb-3">
            <h5><b>ข้อมูลการเจ็บป่วย</b></h5>
            {medicalInfo ? (
              <div className="user-info">
                <div className="left-info">
                  <p>
                    <b>HN:</b> {medicalInfo.HN || "-"}
                  </p>
                  <p>
                    <b>วันที่ Admit:</b>
                    {medicalInfo.Date_Admit
                      ? new Date(medicalInfo.Date_Admit).toLocaleDateString(
                        "th-TH",
                        { day: "numeric", month: "long", year: "numeric" }
                      )
                      : "-"}
                  </p>
                  <p><b>Diagnosis:</b> {medicalInfo.Diagnosis || "-"}</p>
                  <div>
                    {mdata && (
                      <div>
                        <p>
                          <b>แพทย์ผู้ดูแล:</b> {mdata.nametitle}
                          {mdata.name}
                        </p>
                      </div>
                    )}
                  </div>
                  <p><b>Present illness:</b> {medicalInfo.Present_illness || "-"}</p>
                  <div className="filename">
                    {medicalInfo.fileP && (
                      <p>
                        <a
                          onClick={() => {
                            const filePath = medicalInfo.fileP.replace(
                              /\\/g,
                              "/"
                            );
                            const fileName = filePath.split("/").pop();
                            console.log("fileName:", fileName);
                            window.open(
                              `http://localhost:5000/file/${fileName}`,
                              "_blank"
                            );
                          }}
                        >
                          {medicalInfo.fileP.split("/").pop().split("\\").pop()}
                        </a>
                      </p>
                    )}
                  </div>
                  <p><b>Management plan:</b> {medicalInfo.Management_plan || "-"}</p>
                  <div className="filename">
                    {medicalInfo.fileM && (
                      <p>
                        <a
                          onClick={() => {
                            const filePath = medicalInfo.fileM.replace(
                              /\\/g,
                              "/"
                            );
                            const fileName = filePath.split("/").pop();
                            console.log("fileName:", fileName);
                            window.open(
                              `http://localhost:5000/file/${fileName}`,
                              "_blank"
                            );
                          }}
                        >
                          {medicalInfo.fileM.split("/").pop().split("\\").pop()}
                        </a>
                      </p>
                    )}
                  </div>
                  <p>
                    <b>Phychosocial assessment:</b>
                    {medicalInfo.Phychosocial_assessment || "-"}
                  </p>
                  <div className="filename">
                    {medicalInfo.filePhy && (
                      <p>
                        <a
                          onClick={() => {
                            const filePath = medicalInfo.filePhy.replace(
                              /\\/g,
                              "/"
                            );
                            const fileName = filePath.split("/").pop();
                            console.log("fileName:", fileName);
                            window.open(
                              `http://localhost:5000/file/${fileName}`,
                              "_blank"
                            );
                          }}
                        >
                          {medicalInfo.filePhy
                            .split("/")
                            .pop()
                            .split("\\")
                            .pop()}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                <div className="right-info">
                  <p><b>AN:</b> {medicalInfo.AN || "-"}</p>
                  <p>
                    {" "}
                    <b>วันที่ D/C:</b>
                    {medicalInfo.Date_DC
                      ? new Date(medicalInfo.Date_DC).toLocaleDateString(
                        "th-TH",
                        { day: "numeric", month: "long", year: "numeric" }
                      )
                      : "-"}
                  </p>
                  <p><b>Chief complaint:</b> {medicalInfo.Chief_complaint || "-"}</p>
                </div>
                {/* 
                <div className="pdf-link">
                  <a
                    href={`http://localhost:5000/file/${medicalInfo.fileM}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    ดูไฟล์ PDF
                  </a>
                </div> */}

              </div>
            ) : (
              <div>
                <p className="no-equipment">ไม่มีข้อมูลการเจ็บป่วย</p>
                <div className="btn-group">
                  <div className="adddata">
                    <button onClick={() => navigate("/addmdinformation", { state: { id  } })}>
                      เพิ่มข้อมูล
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="cardall card mb-3">
            <h5><b>อุปกรณ์ทางการแพทย์</b></h5>
            {medicalEquipment && medicalEquipment.length > 0 ? (
              medicalEquipment.map((equipment, index) => (
                <div key={index} className="equip-container">
                  <p className="equipname">
                    {equipment.equipmenttype_forUser} <b> {equipment.equipmentname_forUser}</b>
                    <button className="delete-btn" onClick={() => handleDeleteEquipment(equipment.equipmentname_forUser)}>
                      ลบ
                    </button>
                  </p>
                </div>
              ))
            ) : (
              <div className="no-equipment">ไม่มีข้อมูลอุปกรณ์</div>
            )}
            <div className="btn-group">
              <div className="adddata">
                <button onClick={() => navigate("/addequipuser", { state: { id } })}>
                  เพิ่มอุปกรณ์
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
