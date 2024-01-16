import { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";


export default function AddCaremanual({ }) {
  const [caremanual_name, setCaremanualName] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [detail, setDetail] = useState("");
  const defaultImageURL = "https://gnetradio.com/wp-content/uploads/2019/10/no-image.jpg";
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [pdfURL, setPdfURL] = useState(null);

  useEffect(() => {
    const preview = document.getElementById("previewImage");
    if (preview) {
      preview.src = defaultImageURL;
    }
    const token = window.localStorage.getItem("token");
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

    fetch(`http://localhost:5000/addcaremanual`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addcaremanual");
        if (data.status === "ok") {
          console.log(caremanual_name, image, detail);
          window.location.href = "./home";
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
            <a href="#" onClick={() => navigate("/home")}>
              <i class="bi bi-book"></i>
              <span class="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allmpersonnel")}>
              <i class="bi bi-people"></i>
              <span class="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allequip", { state: adminData })}>
              <i class="bi bi-prescription2"></i>
              <span class="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
        </ul>
        <div class="profile_content">
          <div className="profile">
            <div class="profile_details">
              <i class="bi bi-person" onClick={() => navigate("/profile")}></i>
              <div class="name_job">
                <div class="name"><li onClick={() => navigate("/profile")}>{adminData && adminData.username}</li></div>
              </div>
            </div>
            <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
          </div>
        </div>
      </div>
      <div className="home_content">
        <div className="header">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a href="#">
                <i class="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a href="#" onClick={() => navigate("/home")}>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a>เพิ่มคู่มือ</a>
            </li>
          </ul>
        </div>
        <h3>เพิ่มคู่มือ</h3>
        <div className="adminall card mb-3">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label>หัวข้อ</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setCaremanualName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>รูปภาพ</label> <br />
              <img
                // แสดงรูปที่เลือก
                id="previewImage"
                src={defaultImageURL}
                alt="Preview"
                style={{ maxWidth: "20%" }}
              /> <br /><br />
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={onInputimgChange}
              ></input>
            </div>
            
            <div className="mb-3">
              <label>แนบไฟล์</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={onInputfileChange}
              />
            </div>
            <div className="filename ">
              {selectedFileName && (
                <div className="mb-3 pdf">
                  <a href={pdfURL} target="_blank" rel="noopener noreferrer">
                    {selectedFileName}
                  </a>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label>รายละเอียด</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="add btn btn-outline py-2 ">
                บันทึก
              </button>
              <br />
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
