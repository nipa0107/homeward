import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import imgdefault from "../img/image.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateCareManual() {
  const location = useLocation();
  const { id, caremanual } = location.state;
  const [caremanual_name, setCaremanualName] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [pdfURL, setPdfURL] = useState(null);
  const [token, setToken] = useState("");

  const defaultImageURL = imgdefault;
  // const defaultImageURL =
  //   "https://gnetradio.com/wp-content/uploads/2019/10/no-image.jpg";

  console.log(caremanual);

  // const handleImageChange = (e) => {
  //   const selectedImage = e.target.files[0];
  //   setImage(selectedImage);
  //   const previewImageElement = document.getElementById("previewImage");
  //   if (previewImageElement && selectedImage) {
  //     const imageURL = URL.createObjectURL(selectedImage);
  //     previewImageElement.src = imageURL;
  //   }
  // };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      if (typeof selectedImage === "object") {
        const imageURL = URL.createObjectURL(selectedImage);
        const previewImageElement = document.getElementById("previewImage");
        if (previewImageElement) {
          previewImageElement.src = imageURL;
        }
      }
    }
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setSelectedFileName(e.target.files[0].name);
    const pdfURL = URL.createObjectURL(e.target.files[0]);
    setPdfURL(pdfURL);
    console.log("a", pdfURL);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/getcaremanual/${id}`
        );
        const data = await response.json();
        setCaremanualName(data.caremanual_name);
        setDetail(data.detail);
        setImage(data.image);
        setFile(data.file);
      } catch (error) {
        console.error("Error fetching caremanual data:", error);
      }
    };

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
    fetchData();
  }, [id]);

  const removeImage = async () => {
    try {
      const response = await fetch(`http://localhost:5000/remove-image/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setImage(null);
        const previewImageElement = document.getElementById("previewImage");
        if (previewImageElement) {
          previewImageElement.src = defaultImageURL;
        }
      } else {
        toast.error("ไม่สามารถลบรูปภาพได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบรูปภาพ:", error);
      toast.error("เกิดข้อผิดพลาดในการลบรูปภาพ");
    }
  };

  const removeFile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/remove-file/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFile(null);
        setSelectedFileName("");
        setPdfURL(null);
      } else {
        toast.error("ไม่สามารถลบไฟล์ได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบไฟล์:", error);
      toast.error("เกิดข้อผิดพลาดในการลบไฟล์");
    }
  };

  const UpdateCareManual = async () => {
    console.log(caremanual_name, image, file, detail);
    if (!caremanual_name || !image) {
      toast.error("กรุณากรอกชื่อคู่มือและเลือกภาพก่อนทำการบันทึก");
      return; // หยุดการดำเนินการถ้าเงื่อนไขไม่ตรง
    }
    try {
      const formData = new FormData();
      formData.append("caremanual_name", caremanual_name);
      formData.append("detail", detail);

      if (image) {
        formData.append("image", image);
      }

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(
        `http://localhost:5000/updatecaremanual/${id}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedCaremanual = await response.json();
        console.log("แก้ไขคู่มือแล้ว:", updatedCaremanual);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate("/home");
        }, 1100);
      } else {
        console.error("แก้ไขไม่ได้:", response.statusText);
      }
    } catch (error) {
      console.error("การแก้ไขมีปัญหา:", error);
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
              <span className="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
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
            <a href="allsymptom">
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
          <div className="header">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</div>
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
              <a href="home">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขคู่มือ</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขคู่มือ</h3>
        <div className="adminall card mb-3">
          <div className="mb-3">
            <label>หัวข้อ</label>
            <input
              type="text"
              className="form-control"
              value={caremanual_name}
              onChange={(e) => setCaremanualName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>รูปภาพ</label> <br />
            <div className="centered-image">
              {image ? (
                typeof image === "string" ? (
                  <img id="previewImage" src={image} alt="Caremanual Image" />
                ) : (
                  <img
                    id="previewImage"
                    src={URL.createObjectURL(image)}
                    alt="Caremanual Image"
                  />
                )
              ) : (
                <img
                  id="previewImage"
                  src={defaultImageURL}
                  alt="Default Image"
                />
                
              )}
                      {image && (
              <button
                type="button"
                className="delete-button-image"
                onClick={removeImage}
              >
                <i className="bi bi-x"></i> 
              </button>
              // <button className="btn btn-danger mt-2" onClick={removeImage}>
              //   ลบรูปภาพ
              // </button>
            )}
            </div>
    
            {!image && (
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </div>

          <div className="mb-3">
            <label>แนบไฟล์</label>
            {file ? (
              <div className="filename">
                {typeof file === "string" ? (
                  // กรณีที่ไฟล์มาจากฐานข้อมูล (เป็น URL ของไฟล์)
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <i
                      className="bi bi-filetype-pdf"
                      style={{ color: "red" }}
                    ></i>{" "}
                    {selectedFileName || "ดูไฟล์"}
                  </a>
                ) : (
                  // กรณีที่ไฟล์เพิ่งถูกอัปโหลดใหม่
                  <a href={pdfURL} target="_blank" rel="noopener noreferrer">
                    <i
                      className="bi bi-filetype-pdf"
                      style={{ color: "red" }}
                    ></i>{" "}
                    {selectedFileName || "ดูไฟล์"}
                  </a>
                )}
                <button
                  type="button"
                  className="delete-button-file"
                  onClick={removeFile}
                >
                  <i className="bi bi-x"></i> {/* X icon */}
                </button>
              </div>
            ) : (
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            )}
          </div>

          <div className="mb-3">
            <label>รายละเอียด</label>
            <input
              type="text"
              value={detail}
              className="form-control"
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button onClick={UpdateCareManual} className="btn btn-outline py-2">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
