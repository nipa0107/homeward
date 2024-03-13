import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";
import "../css/alladmin.css";
import "../css/sidebar.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function AllUser({}) {
  const navigate = useNavigate();
  const [equipData, setEquipData] = useState([]);
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
  const [token, setToken] = useState("");
  const location = useLocation();
  const { id } = location.state;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ID_card_number, setIDCardNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [Address, setAddress] = useState("");
  const [medicalInfo, setMedicalInfo] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลการดูแลผู้ป่วย

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
    fetchUserId();
  }, [id]);

  // useEffect(() => {
  //   const fetchMedicalInformation = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/medicalInformation/${id}`); // ใช้ id เป็น userId ใน URL
  //       const medicalData = await response.json();
  //       console.log(medicalData);
  //       setMedicalInfo([medicalData.data]);
  //       setHn(medicalData.data.HN);
  //     } catch (error) {
  //       console.error("Error fetching medical information:", error);
  //     }
  //   };
  //   fetchMedicalInformation();
  // }, [id]);

  useEffect(() => {
    const fetchMedicalInformation = async () => {
      try {
        console.log("UserID:", id);
        const response = await fetch(
          `http://localhost:5000/medicalInformation/${id}`
        );
        const medicalData = await response.json();
        console.log("Medical Data:", medicalData);
        if (medicalData && medicalData.data) {
          setMedicalInfo(medicalData.data);
        } else {
          console.error("Medical information not found for this user");
        }
      } catch (error) {
        console.error("Error fetching medical information:", error);
      }
    };
    fetchMedicalInformation();
  }, [id]);

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

  // แปลงวันเกิดของผู้ใช้เป็นวัตถุ Date
  const userBirthday = new Date(birthday);

  // คำนวณความแตกต่างระหว่างปีปัจจุบันกับปีเกิดของผู้ใช้
  const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();

  // ตรวจสอบว่าวันเกิดของผู้ใช้มีเกินวันปัจจุบันหรือไม่
  // ถ้ายังไม่เกิน แสดงอายุเป็นผลลัพธ์
  // ถ้าเกินแล้ว ลดอายุลง 1 ปี
  const isBeforeBirthday =
    currentDate.getMonth() < userBirthday.getMonth() ||
    (currentDate.getMonth() === userBirthday.getMonth() &&
      currentDate.getDate() < userBirthday.getDate());

  const userAge = isBeforeBirthday ? ageDiff - 1 : ageDiff;

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
            <h6>1.ข้อมูลทั่วไป</h6>
            <div className="user-info">
              <div className="left-info">
                {/* {username ? (<p>ชื่อผู้ใช้: {username}</p>) : (<p>ชื่อผู้ใช้: -</p>)} */}
                {name ? <p>ชื่อ-สกุล: {name}</p> : <p>ชื่อ-สกุล: -</p>}
                {birthday ? <p>อายุ: {userAge} ปี</p> : <p>อายุ: - ปี</p>}
                {ID_card_number ? (
                  <p>เลขบัตรประชาชน: {ID_card_number}</p>
                ) : (
                  <p>เลขบัตรประชาชน: -</p>
                )}
                {Address ? <p>ที่อยู่: {Address}</p> : <p>ที่อยู่: -</p>}
              </div>
              <div className="right-info">
                {gender ? <p>เพศ: {gender}</p> : <p>เพศ: -</p>}
                {nationality ? (
                  <p>สัญชาติ: {nationality}</p>
                ) : (
                  <p>สัญชาติ: -</p>
                )}
                {tel ? <p>เบอร์โทรศัพท์: {tel}</p> : <p>เบอร์โทรศัพท์: -</p>}
              </div>
            </div>
            <div className="action-icons">
              <img
                src={editimg}
                className="editimg1"
                alt="editimg"
                onClick={() =>
                  navigate("/updateuser", {
                    state: { id },
                  })
                }
              ></img>
              <img
                src={deleteimg}
                className="deleteimg1"
                alt="deleteimg"
                onClick={() => deleteUser()}
              ></img>
            </div>
          </div>

          {/* <div className="cardall card mb-3">
            <h6>2.ข้อมูลการเจ็บป่วย</h6>
            {medicalInfo && (
              <div>
                <p>HN: {medicalInfo.HN}</p>
                <p>AN: {medicalInfo.AN}</p>
                <p>
                  วันที่ Admit:{" "}
                  {new Date(medicalInfo.Date_Admit).toLocaleDateString(
                    "th-TH",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>
                <p>
                  วันที่ D/C:{" "}
                  {new Date(medicalInfo.Date_DC).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>Diagnoosis: {medicalInfo.Diagnosis}</p>
                <p>Chief complaint: {medicalInfo.Chief_complaint}</p>
                <p>
                  Phychosocial assessment: {medicalInfo.Phychosocial_assessment}
                </p>
                <p>Present illness: {medicalInfo.Present_illness}</p>
              </div>
            )}
          </div> */}

          <div className="cardall card mb-3">
            <h6>2.ข้อมูลการเจ็บป่วย</h6>
            {medicalInfo && (
              <div className="user-info">
                <div className="left-info">
                  <p>HN: {medicalInfo.HN || "-"}</p>
                  <p>
                    วันที่ Admit:
                    {medicalInfo.Date_Admit
                      ? new Date(medicalInfo.Date_Admit).toLocaleDateString(
                          "th-TH",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "-"}
                  </p>
                  <p>Diagnosis: {medicalInfo.Diagnosis || "-"}</p>
                  <p>Chief complaint: {medicalInfo.Chief_complaint || "-"}</p>
                </div>
                <div className="right-info">
                  <p>AN: {medicalInfo.AN || "-"}</p>
                  <p>
                    {" "}
                    วันที่ D/C:
                    {medicalInfo.Date_DC
                      ? new Date(medicalInfo.Date_DC).toLocaleDateString(
                          "th-TH",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "-"}
                  </p>
                  <p>Present illness: {medicalInfo.Present_illness || "-"}</p>
                  <p>
                    Phychosocial assessment:{" "}
                    {medicalInfo.Phychosocial_assessment || "-"}
                  </p>
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
            )}
          </div>

          <div className="cardall card mb-3">
            <h6>3.อุปกรณ์ทางการแพทย์</h6>
          </div>
        </div>
      </div>
    </main>
  );
}
