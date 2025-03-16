import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import "../css/form.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";

export default function Updatemedicalinformation() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [adminData, setAdminData] = useState("");
  const location = useLocation();
  const { id, user } = location.state;
  //   const { idmd: medicalInfoId } = location.state;
  const [HN, setHN] = useState("");
  const [AN, setAN] = useState("");
  const [Diagnosis, setDiagnosis] = useState("");
  const [Chief_complaint, setChief_complaint] = useState("");
  const [Present_illness, setPresent_illness] = useState("");
  const [Phychosocial_assessment, setPhychosocial_assessment] = useState("");
  const [Management_plan, setManagement_plan] = useState("");
  const [Date_Admit, setDate_Admit] = useState("");
  const [Date_DC, setDate_DC] = useState("");
  const [fileM, setFileM] = useState(null);
  const [fileP, setFileP] = useState(null);
  const [filePhy, setFilePhy] = useState(null);
  const [fileMName, setFileMName] = useState(null);
  const [filePName, setFilePName] = useState(null);
  const [filePhyName, setFilePhyName] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [selectedFileNameP, setSelectedFileNameP] = useState("");
  const [selectedFileNameM, setSelectedFileNameM] = useState("");
  const [selectedFileNamePhy, setSelectedFileNamePhy] = useState("");
  const [pdfURLP, setPdfURLP] = useState("");
  const [pdfURLM, setPdfURLM] = useState("");
  const [pdfURLPhy, setPdfURLPhy] = useState("");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const tokenExpiredAlertShown = useRef(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFilteredPersonnel(data);
  }, [data]);

  const handleSearchChange = (inputValue) => {
    setSearchTerm(inputValue);
    const filtered = data.filter((personnel) =>
      `${personnel.nametitle} ${personnel.name} ${personnel.surname}`
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
    setFilteredPersonnel(filtered);
  };

  const initialSelectedPersonnel = medicalInfo
    ? medicalInfo.selectedPersonnel
    : "";

  const [selectedPersonnel, setSelectedPersonnel] = useState("");

  const handleFileChangeP = (e) => {
    setFileP(e.target.files[0]); // อัปเดต state ของไฟล์ Present illness
    setSelectedFileNameP(e.target.files[0].name); // อัปเดตชื่อไฟล์ที่เลือก
    const pdfURLP = URL.createObjectURL(e.target.files[0]);
    setPdfURLP(pdfURLP);
  };

  const handleFileChangeM = (e) => {
    setFileM(e.target.files[0]); // อัปเดต state ของไฟล์ Management plan
    setSelectedFileNameM(e.target.files[0].name); // อัปเดตชื่อไฟล์ที่เลือก
    const pdfURLM = URL.createObjectURL(e.target.files[0]);
    setPdfURLM(pdfURLM);
  };

  const handleFileChangePhy = (e) => {
    setFilePhy(e.target.files[0]); // อัปเดต state ของไฟล์ Phychosocial assessment
    setSelectedFileNamePhy(e.target.files[0].name); // อัปเดตชื่อไฟล์ที่เลือก
    const pdfURLPhy = URL.createObjectURL(e.target.files[0]);
    setPdfURLPhy(pdfURLPhy);
  };
  const handleRemoveFileP = () => {
    setFileP(null);
    setPdfURLP(null);
    setSelectedFileNameP(""); // ลบชื่อไฟล์ที่แสดง
  };

  const handleRemoveFileM = () => {
    setFileM(null);
    setPdfURLM(null);
    setSelectedFileNameM("");
  };

  const handleRemoveFilePhy = () => {
    setFilePhy(null);
    setPdfURLPhy(null);
    setSelectedFileNamePhy("");
  };

  const formatDate = (date) => {
    if (!date) {
      return ""; // Return an empty string if the date is null, undefined, or empty
    }
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return ""; // If the date is invalid, return an empty string
    }
    return formattedDate.toISOString().split("T")[0];
  };

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
        body: JSON.stringify({
          token: token,
        }),
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
    getAllMpersonnel();
  }, []);

  useEffect(() => {
    const fetchMedicalInformation = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/medicalInformation/${id}`
        );
        const medicalData = await response.json();

        if (medicalData && medicalData.data) {
          setMedicalInfo(medicalData.data);
          console.log("medicalDataupdate:", medicalData);
          setHN(medicalData.data.HN);
          setAN(medicalData.data.AN);
          setDiagnosis(medicalData.data.Diagnosis);
          setChief_complaint(medicalData.data.Chief_complaint);
          setPresent_illness(medicalData.data.Present_illness);
          setPhychosocial_assessment(medicalData.data.Phychosocial_assessment);
          setManagement_plan(medicalData.data.Management_plan);
          setDate_Admit(formatDate(medicalData.data.Date_Admit));
          setSelectedPersonnel(medicalData.data.selectedPersonnel || "");
          setDate_DC(formatDate(medicalData.data.Date_DC));
          setFileP(medicalData.data.fileP);
          setFileM(medicalData.data.fileM);
          setFilePhy(medicalData.data.filePhy);
          setFilePName(medicalData.data.filePName);
          setFileMName(medicalData.data.fileMName);
          setFilePhyName(medicalData.data.filePhyName);
          // const filePath = medicalData.data.fileP.replace(/\\/g, "/");
          // const fileName = filePath.split("/").pop();
          // setFileP(fileName);

          // const filePathM = medicalData.data.fileM.replace(/\\/g, "/");
          // const fileNameM = filePathM.split("/").pop();
          // setFileM(fileNameM);

          // const filePathPhy = medicalData.data.filePhy.replace(/\\/g, "/");
          // const fileNamePhy = filePathPhy.split("/").pop();
          // setFilePhy(fileNamePhy);
        } else {
          console.error("Medical information not found for this user");
        }
      } catch (error) {
        console.error("Error fetching medical information:", error);
      }
    };
    fetchMedicalInformation();
  }, [id]);

  const getAllMpersonnel = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/allMpersonnel", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllMpersonnel");
        setData(data.data);
        console.log("info:", id);
      });
  };

  const UpdateMedical = async (e) => {
    e.preventDefault();

    // if (!HN.trim() ||!AN.trim() ||!Diagnosis.trim() || !selectedPersonnel) {
    //   toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    //   return;
    // }

    let newErrors = {};

    if (!HN.trim()) newErrors.HN = "กรุณากรอก HN";
    if (!AN.trim()) newErrors.AN = "กรุณากรอก AN";
    if (!Diagnosis.trim()) newErrors.Diagnosis = "กรุณากรอก Diagnosis";
    if (!selectedPersonnel)
      newErrors.selectedPersonnel = "กรุณาเลือกแพทย์ผู้ดูแล";

    // ถ้ามี error ให้อัปเดต state และไม่ส่งฟอร์ม
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ล้าง error เมื่อข้อมูลถูกต้อง
    setErrors({});
    try {
      if (!medicalInfo) {
        console.error("ไม่พบข้อมูลการแพทย์");
        return;
      }

      const updatedSelectedPersonnel = selectedPersonnel
        ? selectedPersonnel
        : medicalInfo.selectedPersonnel;

      const formData = new FormData();
      formData.append("HN", HN);
      formData.append("AN", AN);
      formData.append("Date_Admit", Date_Admit);
      formData.append("Date_DC", Date_DC);
      formData.append("Diagnosis", Diagnosis);
      formData.append("Chief_complaint", Chief_complaint);
      formData.append("Present_illness", Present_illness);
      formData.append("selectedPersonnel", updatedSelectedPersonnel); // ใช้ค่าที่อัปเดตแล้ว
      formData.append("Phychosocial_assessment", Phychosocial_assessment);
      formData.append("Management_plan", Management_plan);

      if (fileP) {
        formData.append("fileP", fileP);
      } else {
        formData.append("deleteFileP", "true");
      }

      if (fileM) {
        formData.append("fileM", fileM);
      }else {
        formData.append("deleteFileM", "true");
      }

      if (filePhy) {
        formData.append("filePhy", filePhy);
      }else {
        formData.append("deleteFilePhy", "true");
      }

      console.log("info:", id);
      const response = await fetch(
        `https://backend-deploy-render-mxok.onrender.com/updatemedicalinformation/${medicalInfo._id}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const updatemedicalinformation = data; // ใช้ข้อมูลที่อ่านได้ในการทำงานต่อไป
        console.log("แก้ไข้อมูลแล้ว:", updatemedicalinformation);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/allinfo", { state: { id: id, user: user } });
        }, 1100);
      } else {
        console.error("แก้ไขไม่ได้:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating medical information:", error);
      // ดำเนินการเมื่อเกิดข้อผิดพลาดในการส่งคำขอ
    }
  };

  return (
    <main className="body">
      <ToastContainer />
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
              <a
                onClick={() => navigate("/allinfo", { state: { id } })}
                className="info"
              >
                ...
              </a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลการเจ็บป่วย</a>
            </li>
          </ul>
        </div>

        {medicalInfo && (
          <div className="adminall card mb-3">
            <p className="title-header">แก้ไขข้อมูลการเจ็บป่วย</p>
            <div className="mb-2">
              <label>HN</label>
              <input
                type="text"
                className={`form-control ${errors.HN ? "input-error" : ""}`}
                value={HN}
                onChange={(e) => {
                  setHN(e.target.value);
                  setErrors((prev) => ({ ...prev, HN: "" }));
                }}
              />
              {errors.HN && <span className="error-text">{errors.HN}</span>}
            </div>
            <div className="mb-2">
              <label>AN</label>
              <input
                type="text"
                value={AN}
                className={`form-control ${errors.AN ? "input-error" : ""}`}
                onChange={(e) => {
                  setAN(e.target.value);
                  setErrors((prev) => ({ ...prev, AN: "" }));
                }}
              />
              {errors.AN && <span className="error-text">{errors.AN}</span>}
            </div>

            <div className="mb-2">
              <label>วันที่ Admit </label>
              <input
                type="date"
                value={Date_Admit}
                className="form-control"
                onChange={(e) => setDate_Admit(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label>วันที่ D/C</label>
              <input
                type="date"
                value={Date_DC}
                className="form-control"
                onChange={(e) => setDate_DC(e.target.value)}
              />
            </div>
            {/* <div className="mb-2">
              <label>แพทย์ผู้ดูแล</label>
              <select
                id="selectedPersonnel"
                className="form-select"
                value={selectedPersonnel}
                onChange={(e) => setSelectedPersonnel(e.target.value)}
              >
                <option value="">โปรดเลือกแพทย์</option>
                {data.length > 0 ? (
                  data.map((personnel) => (
                    <option key={personnel._id} value={personnel._id}>
                      {`${personnel.nametitle} ${personnel.name} ${personnel.surname}`}
                    </option>
                  ))
                ) : (
                  <option value="">ไม่มีข้อมูลแพทย์</option>
                )}
              </select>
            </div> */}
            <div className="mb-2">
              <label>แพทย์ผู้ดูแล</label>
              <Select
                options={filteredPersonnel.map((personnel) => ({
                  value: personnel._id,
                  label: `${personnel.nametitle} ${personnel.name} ${personnel.surname}`,
                }))}
                value={
                  selectedPersonnel
                    ? {
                        value: selectedPersonnel,
                        label: `${
                          filteredPersonnel.find(
                            (personnel) => personnel._id === selectedPersonnel
                          )?.nametitle
                        } ${
                          filteredPersonnel.find(
                            (personnel) => personnel._id === selectedPersonnel
                          )?.name
                        } ${
                          filteredPersonnel.find(
                            (personnel) => personnel._id === selectedPersonnel
                          )?.surname
                        }`,
                      }
                    : null
                }
                onInputChange={handleSearchChange}
                onChange={(selectedOption) => {
                  setSelectedPersonnel(
                    selectedOption ? selectedOption.value : null
                  );
                  setErrors((prev) => ({ ...prev, selectedPersonnel: "" }));
                  setSearchTerm("");
                }}
                placeholder="ค้นหาแพทย์..."
                isSearchable
                isClearable
                className={`custom-select ${
                  errors.selectedPersonnel ? "input-error" : ""
                }`}
                classNamePrefix="custom"
                noOptionsMessage={() => "ไม่มีข้อมูลแพทย์"}
              />
              {filteredPersonnel.length === 0 && searchTerm && (
                <div className="no-results">ไม่มีข้อมูลแพทย์</div>
              )}
              {errors.selectedPersonnel && (
                <span className="error-text">{errors.selectedPersonnel}</span>
              )}
            </div>

            <div className="mb-2">
              <label>Diagnosis</label>
              <textarea
                className={`form-control ${
                  errors.Diagnosis ? "input-error" : ""
                }`}
                value={Diagnosis}
                rows="2" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }} // ให้ textarea สามารถปรับขนาดได้ในทิศทางดิสพล์เมนต์
                onChange={(e) => setDiagnosis(e.target.value)}
              />
              {errors.Diagnosis && (
                <span className="error-text">{errors.Diagnosis}</span>
              )}
            </div>
            <div className="mb-2">
              <label>Chief complaint</label>
              <textarea
                className="form-control"
                value={Chief_complaint}
                rows="2" // กำหนดจำนวนแถวเริ่มต้น
                style={{ resize: "vertical" }}
                onChange={(e) => setChief_complaint(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label>Present illness</label>
              {!pdfURLP && !fileP && (
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleFileChangeP}
              />
              )}
              <div className="filename">
                {pdfURLP ? (
                  <div className="mb-2 pdf">
                    <a href={pdfURLP} target="_blank" rel="noopener noreferrer">
                      <i
                        className="bi bi-filetype-pdf"
                        style={{ color: "red" }}
                      ></i>{" "}
                      {selectedFileNameP}
                    </a>
                    <button
                      onClick={handleRemoveFileP}
                      className="delete-button-file"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ) : (
                  fileP && (
                    <div className="mb-2 pdf">
                      <a onClick={() => window.open(`${fileP}`, "_blank")}>
                        <i
                          className="bi bi-filetype-pdf"
                          style={{ color: "red" }}
                        ></i>{" "}
                        {filePName}
                      </a>
                      <button
                        onClick={handleRemoveFileP}
                        className="delete-button-file"
                      >
                      <i className="bi bi-x"></i>
                      </button>
                    </div>
                  )
                )}
              </div>

              <textarea
                className="form-control"
                value={Present_illness} // Set the value attribute
                rows="2"
                style={{ resize: "vertical" }}
                onChange={(e) => setPresent_illness(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label>Management plan</label>
              {!pdfURLM && !fileM && (
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleFileChangeM}
              />
              )}
              <div className="filename">
                {pdfURLM ? (
                  <div className="mb-2 pdf">
                    <a href={pdfURLM} target="_blank" rel="noopener noreferrer">
                      <i
                        className="bi bi-filetype-pdf"
                        style={{ color: "red" }}
                      ></i>{" "}
                      {selectedFileNameM}
                    </a>
                    <button
                        onClick={handleRemoveFileM}
                        className="delete-button-file"
                      >
                      <i className="bi bi-x"></i>
                      </button>
                  </div>
                ) : (
                  fileM && (
                    <div className="mb-2 pdf">
                      <a
                        onClick={() => {
                          window.open(`${fileM}`, "_blank");
                        }}
                      >
                        <i
                          className="bi bi-filetype-pdf"
                          style={{ color: "red" }}
                        ></i>{" "}
                        {fileMName}
                      </a>
                      <button
                        onClick={handleRemoveFileM}
                        className="delete-button-file"
                      >
                      <i className="bi bi-x"></i>
                      </button>
                    </div>
                  )
                )}
              </div>
              <textarea
                className="form-control"
                value={Management_plan} // Set the value here
                rows="2"
                style={{ resize: "vertical" }}
                onChange={(e) => setManagement_plan(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label>Psychosocial assessment</label>
              {!pdfURLPhy && !filePhy && (
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleFileChangePhy}
              />
            )}
              <div className="filename">
                {pdfURLPhy ? (
                  <div className="mb-2 pdf">
                    <a
                      href={pdfURLPhy}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i
                        className="bi bi-filetype-pdf"
                        style={{ color: "red" }}
                      ></i>{" "}
                      {selectedFileNamePhy}
                    </a>
                    <button
                        onClick={handleRemoveFilePhy}
                        className="delete-button-file"
                      >
                      <i className="bi bi-x"></i>
                      </button>
                  </div>
                ) : (
                  filePhy && (
                    <div className="mb-2 pdf">
                      <a
                        onClick={() => {
                          window.open(`${filePhy}`, "_blank");
                        }}
                      >
                        <i
                          className="bi bi-filetype-pdf"
                          style={{ color: "red" }}
                        ></i>{" "}
                        {filePhyName}
                      </a>
                      <button
                        onClick={handleRemoveFilePhy}
                        className="delete-button-file"
                      >
                      <i className="bi bi-x"></i>
                      </button>
                    </div>
                  )
                )}
              </div>
              <textarea
                className="form-control"
                value={Phychosocial_assessment} // Set the value here
                rows="2"
                style={{ resize: "vertical" }}
                onChange={(e) => setPhychosocial_assessment(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button onClick={UpdateMedical} className="btn btn-outline py-2">
                บันทึก
              </button>
              
            </div>
          </div>
        )}
      </div>

      <div></div>
    </main>
  );
}
