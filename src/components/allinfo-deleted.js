import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./sidebar";

export default function AllInfoDeleted() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [token, setToken] = useState("");
  const location = useLocation();
  const { id } = location.state;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [tel, setTel] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ID_card_number, setIDCardNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [Address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverSurname, setCaregiverSurname] = useState("");
  const [Relationship, setRelationship] = useState("");
  const [caregiverTel, setCaregiverTel] = useState("");
  const [medicalInfo, setMedicalInfo] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลการดูแลผู้ป่วย
  const [mdata, setMData] = useState([]);
  const [docter, setDocter] = useState("");
  const [medicalEquipment, setMedicalEquipment] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [caregiverInfo, setCaregiverInfo] = useState(null);

  const tokenExpiredAlertShown = useRef(false); 

  const formatIDCardNumber = (id) => {
    if (!id) return "";
    return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5");
  };
  
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
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
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
        setEmail(userdata.data.email);
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
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "asc" });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEquipment = [...medicalEquipment].sort((a, b) => {
    if (sortConfig.key) {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      // ถ้าเป็นวันที่ ต้องแปลงเป็น Date object
      if (sortConfig.key === "createdAt") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }

      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const getSortIcon = (key) => {
    return (
      <i
        className={`bi ${sortConfig.key === key ?
          (sortConfig.direction === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill")
          : "bi-caret-down-fill" // ค่าเริ่มต้นเป็นลูกศรลง
          }`}
      ></i>
    );
  };

  const handleRowClick = (equipmentName) => {
    setSelectedEquipments((prevSelected) =>
      prevSelected.includes(equipmentName)
        ? prevSelected.filter((name) => name !== equipmentName)
        : [...prevSelected, equipmentName]
    );
  };

  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    return `${day < 10 ? "0" + day : day} ${thaiMonths[month - 1]} ${year + 543
      } เวลา ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes
      } น.`;
  };

  return (
    <main className="body">
      <Sidebar />
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
            <li className="middle">
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="alluser">...</a>
            </li>
            {/* <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li> */}
            <li className="middle">
              <a href="recover-patients">ข้อมูลผู้ป่วยที่ถูกลบ</a>
            </li>
            <li classNarecover-patientsme="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="recover-patients">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ข้อมูลการดูแลผู้ป่วย</a>
            </li>
          </ul>
        </div>
        {/* <h3>ข้อมูลการดูแลผู้ป่วย</h3> */}
        <p className="title-header-user">ข้อมูลการดูแลผู้ป่วย</p>
        <div className="forminfo mb-4">
          <fieldset className="user-fieldset">
            <legend><i className="bi bi-person-fill"></i> ข้อมูลทั่วไป</legend>
            <div className="user-info mt-3">
              <div className="row">
                {[
                  { label: "ชื่อ-สกุล", value: `${name || '-'} ${surname || '-'}` },
                  { label: "เลขบัตรประชาชน", value: `${formatIDCardNumber(ID_card_number || '-')}` },
                  { label: "อายุ", value: userAge },
                  { label: "เพศ", value: gender || '-' },
                  { label: "สัญชาติ", value: nationality || '-' },
                  { label: "ที่อยู่", value: Address || '-' },
                  { label: "เบอร์โทรศัพท์", value: tel || '-' }
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="col-sm-3" style={{ color: "#444" }}>
                      <p><span>{item.label} :</span></p>
                    </div>
                    <div className="col-sm-9">
                      <p><b>{item.value}</b></p>
                    </div>
                    <div className="w-100 d-none d-md-block"></div>
                  </React.Fragment>
                ))}
              </div>

            </div>
          </fieldset>
        </div>
        <div className="forminfo mb-4">
          <fieldset className="user-fieldset">
            <legend><i class="bi bi-person-fill"></i> ข้อมูลผู้ดูแล</legend>
            <div>
              {caregiverInfo && caregiverInfo.length > 0 ? (
                <div>
                  <div className="user-info-caregiver">
                    {caregiverInfo.map((caregiver, index) => (
                      <div className="inline-container-caregiver" key={index}>
                        <p>
                          <span><b>ผู้ดูแลคนที่ {index + 1} :</b> </span>
                        </p>
                        <div className="caregiver-card mb-4">
                          <div className="row">
                            {[
                              {
                                label: "เลขประจําตัวประชาชน", value: `${formatIDCardNumber(
                                  caregiver.ID_card_number || "-"
                                )}`
                              },
                              { label: "ชื่อ-สกุล", value: `${caregiver.name || "-"} ${caregiver.surname || "-"}` },
                              { label: "ความสัมพันธ์", value: caregiver.relationship || "ไม่ระบุ" }
                            ].map((item, index) => (
                              <React.Fragment key={index}>
                                <div className="col-sm-4" style={{ color: "#444" }}><p><span>{item.label} :</span></p></div>
                                <div className="col-sm-8 fw-bold text-dark"><p><span>{item.value}</span></p></div>
                                <div className="w-100 d-none d-md-block"></div>
                              </React.Fragment>
                            ))}
                            <div className="col-sm-4 " style={{ color: "#444" }}><p><span>เบอร์โทรศัพท์ :</span></p></div>
    
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="no-equipment">ไม่มีข้อมูลผู้ดูแล</p>
                </div>
              )}
            </div>
          </fieldset>
        </div>
        <div className="forminfo mb-4">
          <fieldset className="user-fieldset">
            <legend><i className="bi bi-journal-medical"></i> ข้อมูลการเจ็บป่วย</legend>
            {medicalInfo ? (
              <>
                <div className="user-info mt-3">
                  <div className="row">
                    {[
                      { label: "HN", value: medicalInfo.HN || "-" },
                      { label: "AN", value: medicalInfo.AN || "-" },
                      {
                        label: "วันที่ Admit",
                        value: medicalInfo.Date_Admit
                          ? new Date(medicalInfo.Date_Admit).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                          : "-",
                      },
                      {
                        label: "วันที่ D/C",
                        value: medicalInfo.Date_DC
                          ? new Date(medicalInfo.Date_DC).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                          : "-",
                      },
                      { label: "Diagnosis", value: medicalInfo.Diagnosis || "-" },
                      {
                        label: "แพทย์ผู้ดูแล",
                        value: (mdata.nametitle || mdata.name || mdata.surname)
                          ? `${mdata.nametitle || ""} ${mdata.name || ""} ${mdata.surname || ""}`.trim()
                          : "-",
                      },
                      { label: "Chief complaint", value: medicalInfo.Chief_complaint || "-" },
                      { label: "Present illness", value: medicalInfo.Present_illness || "-" },
                      {
                        label: (
                          <>
                            <i class="bi bi-file-earmark-pdf"></i> File Present illness
                          </>
                        ),
                        value: medicalInfo.fileP ? (
                          <a
                            className="blue-500"
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
                        ) : "-",
                      },

                      { label: "Management plan", value: medicalInfo.Management_plan || "-" },
                      {
                        label: (
                          <>
                            <i class="bi bi-file-earmark-pdf"></i> File Management plan
                          </>
                        ),
                        value: medicalInfo.fileM ? (
                          <a
                            className="blue-500"
                            href=""
                            onClick={() => {
                              window.open(`${medicalInfo.fileM}`, "_blank");
                            }}
                          >
                            {medicalInfo.fileMName}
                          </a>
                        ) : "-",
                      },
                      { label: "Phychosocial assessment", value: medicalInfo.Phychosocial_assessment || "-" },
                      {
                        label: (
                          <>
                            <i class="bi bi-file-earmark-pdf"></i> File Phychosocial assessment
                          </>
                        ),
                        value: medicalInfo.filePhy ? (
                          <a
                            className="blue-500"
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
                        ) : "-",
                      },
                    ].map((item, index) => (
                      <React.Fragment key={index}>
                        <div className="col-sm-5" style={{ color: "#444" }}>
                          <p><span>{item.label} :</span></p>
                        </div>
                        <div className="col-sm-7">
                          <p><b>{item.value}</b></p>
                        </div>
                        <div className="w-100 d-none d-md-block"></div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

              </>
            ) : (
              <div>
                <p className="no-equipment">ไม่พบข้อมูลการเจ็บป่วย</p>
              </div>
            )}
          </fieldset>
        </div>

        <div className="forminfo mb-1">
          <fieldset className="user-fieldset">
            <legend>
              <i className="bi bi-prescription2"></i> อุปกรณ์ทางการแพทย์
            </legend>
            {medicalEquipment && medicalEquipment.length > 0 ? (
              <>
                <div className="equipment-category">
                  <table className="equipment-table">
                    <thead>
                      <tr>
                        {/* <th scope="col">
                          <input
                            style={{ transform: 'scale(1.4)'}}
                            type="checkbox"
                            onChange={toggleAllCheckboxes}
                          />
                        </th> */}
                        <th scope="col">#</th>
                        <th scope="col" onClick={() => requestSort("equipmentname_forUser")} style={{ cursor: "pointer" }}>
                          ชื่ออุปกรณ์ {getSortIcon("equipmentname_forUser")}
                        </th>
                        <th scope="col" onClick={() => requestSort("equipmenttype_forUser")} style={{ cursor: "pointer" }}>
                          ประเภทอุปกรณ์ {getSortIcon("equipmenttype_forUser")}
                        </th>
                        <th scope="col" onClick={() => requestSort("createdAt")} style={{ cursor: "pointer" }}>
                          วันที่เพิ่ม {getSortIcon("createdAt")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedEquipment.map((equipment, index) => (
                        <tr
                          key={equipment._id}
                          onClick={() => handleRowClick(equipment.equipmentname_forUser)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* <td onClick={(e) => e.stopPropagation()}>
                            <input
                              style={{ transform: 'scale(1.4)' }}
                              type="checkbox"
                              checked={selectedEquipments.includes(equipment.equipmentname_forUser)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleRowClick(equipment.equipmentname_forUser);
                              }}
                            />
                          </td> */}
                          <td>{index + 1}</td>
                          <td>{equipment.equipmentname_forUser}</td>
                          <td>{equipment.equipmenttype_forUser}</td>
                          <td>{formatDate(equipment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </>
            ) : (
              <>
                <div className="no-equipment text-center mt-3">ไม่พบข้อมูลอุปกรณ์ทางการแพทย์</div>
              </>
            )}
          </fieldset>
        </div>
      </div>
    </main>
  );
}
