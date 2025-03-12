import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import imgdefault from "../img/image.png";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddCaremanual() {
  const [caremanual_name, setCaremanualName] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [detail, setDetail] = useState("");
  const [defaultImageURL, setDefaultImageURL] = useState(imgdefault);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [pdfURL, setPdfURL] = useState(null);
  const [token, setToken] = useState("");
  const [caremanualNameError, setCaremanualNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const tokenExpiredAlertShown = useRef(false);

  useEffect(() => {
    // const preview = document.getElementById("previewImage");
    // if (preview) {
    //   preview.src = defaultImageURL;

    setDefaultImageURL(defaultImageURL);

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
  }, [defaultImageURL]);

  const onInputimgChange = (e) => {
    const selectedImage = e.target.files[0];
    console.log(selectedImage);
    setImage(selectedImage);
    setImageError('');
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
  const handleDeleteImage = () => {
    setImage(null);
    setDefaultImageURL(imgdefault); // ตั้งค่าให้กลับไปใช้รูปภาพเริ่มต้น
    document.getElementById("previewImage").src = imgdefault; // ตั้งค่าให้แสดงรูปภาพเริ่มต้น
  };

  const handleDeleteFile = () => {
    setFile(null);
    setSelectedFileName("");
    setPdfURL(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!caremanual_name.trim()) {
      setCaremanualNameError("กรุณากรอกชื่อคู่มือ");
      hasError = true;
    } else {
      setCaremanualNameError(""); // เคลียร์ error ถ้ามีการกรอกค่า
    }
    if (!image) {
      setImageError("กรุณาเลือกภาพ");
      hasError = true;
    } else {
      setImageError(""); // เคลียร์ error ถ้ามีการเลือกภาพ
    }
    if (!caremanual_name.trim() || !image) {
      return;
    }
    if (hasError) return;
    const formData = new FormData();
    formData.append("caremanual_name", caremanual_name);
    formData.append("image", image);
    formData.append("file", file);
    formData.append("detail", detail);

    fetch(`https://backend-deploy-render-mxok.onrender.com/addcaremanual`, {
      method: "POST",
      body: formData,
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addcaremanual");
        if (data.status === "ok") {
          toast.success("เพิ่มข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/");
          }, 1050);
        } else {
          toast.error(data.error);
        }
      });
  };

  return (
    <main className="body">
      <ToastContainer />
      <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</div>
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
              <a href="home">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="home">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>เพิ่มคู่มือ</a>
            </li>
          </ul>
        </div>
        <div className="adminall card">
          <p className="title-header">เพิ่มคู่มือ</p>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-1">
              <label>
                หัวข้อ<span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  caremanualNameError ? "input-error" : ""
                }`}
                onChange={(e) => setCaremanualName(e.target.value)}
              />
              {caremanualNameError && (
                <span className="error-text">{caremanualNameError}</span>
              )}{" "}
            </div>
            <div className="mb-1">
              <label>
                รูปภาพ<span className="required">*</span>
              </label>{" "}
              <br />
              <div className="centered-image">
                <img
                  // แสดงรูปที่เลือก
                  id="previewImage"
                  src={defaultImageURL}
                  alt="Preview"
                  style={{}}
                />
                {image && (
                  <button
                    type="button"
                    className="delete-button-image"
                    onClick={handleDeleteImage}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
              {!image && (
                <input
                  type="file"
                  className={`form-control ${imageError ? "input-error" : ""}`}
                  accept="image/*"
                  onChange={onInputimgChange}
                />
              )}
              {imageError && <span className="error-text">{imageError}</span>}
            </div>

            <div className="mb-1">
              <label>แนบไฟล์</label>
              {file ? (
                <div className="filename">
                  <div className="pdf">
                    <a href={pdfURL} target="_blank" rel="noopener noreferrer">
                      <i
                        className="bi bi-filetype-pdf"
                        style={{ color: "red" }}
                      ></i>{" "}
                      {selectedFileName}
                    </a>
                    <button
                      type="button"
                      className="delete-button-file"
                      onClick={handleDeleteFile}
                    >
                      <i className="bi bi-x"></i> 
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  onChange={onInputfileChange}
                />
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
            <div className="d-grid">
              <button type="submit" className="btn btn-outline py-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
