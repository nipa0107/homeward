import { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import imgdefault from "../img/image.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddCaremanual({ }) {
  const [caremanual_name, setCaremanualName] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [detail, setDetail] = useState("");
  const [defaultImageURL, setDefaultImageURL] = useState(imgdefault); // เปลี่ยน defaultImageURL เป็น imgdefault
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [pdfURL, setPdfURL] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState("");


  
  useEffect(() => {
    // const preview = document.getElementById("previewImage");
    // if (preview) {
    //   preview.src = defaultImageURL;

    setDefaultImageURL(defaultImageURL);
    
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
          setError()
        });
    }
  }, [defaultImageURL]);

  const onInputimgChange = (e) => {
    const selectedImage = e.target.files[0];
    console.log(selectedImage);
    setImage(selectedImage);
    const imageURL = URL.createObjectURL(selectedImage);
    document.getElementById("previewImage").src = imageURL;
  };

  const onInputfileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);

    setSelectedFileName(e.target.files[0].name);

    const pdfURL = URL.createObjectURL(e.target.files[0]);
    setPdfURL(pdfURL);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caremanual_name", caremanual_name);
    formData.append("image", image);
    formData.append("file", file);
    formData.append("detail", detail);

    fetch(`http://localhost:5000/addcaremanual1`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addcaremanual");
        if (data.status === "ok") {
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/");
          },1050); 
        } else {
          setError(data.error); 
        }
      });
  };
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <main className="body">
      <ToastContainer />
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name" >
              <img src={logow} className="logow" alt="logo" ></img>
            </div>
          </div>
          <i class='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul class="nav-list">
          <li>
            <a href="home">
              <i class="bi bi-book"></i>
              <span class="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i class="bi bi-person-plus"></i>
              <span class="links_name" >จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i class="bi bi-people"></i>
              <span class="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i class="bi bi-prescription2"></i>
              <span class="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i class="bi bi-bandaid"></i>
              <span class="links_name" >จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting" >
            <i class="bi bi-bell"></i>              
            <span class="links_name" >ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
          <div class="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span class="links_name" >ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
      <div className="homeheader">
        <div className="header">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</div>
        <div class="profile_details">
        <ul className="nav-list">
          <li>
            <a href="profile" >
              <i class="bi bi-person"></i>
              <span class="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
          </ul>
        </div>
        </div>
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
            <li><a href="home">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a>เพิ่มคู่มือ</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มคู่มือ</h3>
        <div className="adminall card">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-1">
              <label>หัวข้อ<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setCaremanualName(e.target.value)}
              />
            </div>
            <div className="mb-1">
              <label>รูปภาพ<span className="required">*</span></label> <br />
              <div className="centered-image">
              <img
                // แสดงรูปที่เลือก
                id="previewImage"
                src={defaultImageURL}
                alt="Preview"
                style={{ }}
              /></div> <br />

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={onInputimgChange}
              ></input>
            </div>
            
            <div className="mb-1">
              <label>แนบไฟล์</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={onInputfileChange}
              />
            </div>
            <div className="filename">
              {selectedFileName && (
                <div className="pdf">
                  <a href={pdfURL} target="_blank" rel="noopener noreferrer">
                    {selectedFileName}
                  </a>
                </div>
              )}
            </div>
            <div className="mb-1">
              <label>รายละเอียด</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
            <p id="errormessage" className="errormessage">
              {error}
            </p>
            <div className="d-grid">
              <button type="submit"className="btn btn-outline py-2">
                บันทึก
              </button>
         </div>
          </form>
        </div>

      </div>
    </main>
  );
}
