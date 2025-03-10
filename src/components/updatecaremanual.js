import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/form.css";
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
  const [fileName, setFileName] = useState(null);
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
  const [selectedFileName, setSelectedFileName] = useState("");
  const [pdfURL, setPdfURL] = useState(null);
  const [token, setToken] = useState("");
  const [caremanualNameError, setCaremanualNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [deletedImage, setDeletedImage] = useState(false); // สำหรับภาพ
  const [deletedFile, setDeletedFile] = useState(false); // สำหรับไฟล์
  const tokenExpiredAlertShown = useRef(false);

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
          `https://backend-deploy-render-mxok.onrender.com/getcaremanual/${id}`
        );
        const data = await response.json();
        setCaremanualName(data.caremanual_name);
        setDetail(data.detail);
        setImage(data.image);
        setFile(data.file);
        setFileName(data.originalFileName);
      } catch (error) {
        console.error("Error fetching caremanual data:", error);
      }
    };

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
    fetchData();
  }, [id]);

  // const removeImage = async () => {
  //   try {
  //     const response = await fetch(`https://backend-deploy-render-mxok.onrender.com/remove-image/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       setImage(null);
  //       const previewImageElement = document.getElementById("previewImage");
  //       if (previewImageElement) {
  //         previewImageElement.src = defaultImageURL;
  //       }
  //     } else {
  //       toast.error("ไม่สามารถลบรูปภาพได้");
  //     }
  //   } catch (error) {
  //     console.error("เกิดข้อผิดพลาดในการลบรูปภาพ:", error);
  //     toast.error("เกิดข้อผิดพลาดในการลบรูปภาพ");
  //   }
  // };

  // const removeFile = async () => {
  //   try {
  //     const response = await fetch(`https://backend-deploy-render-mxok.onrender.com/remove-file/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       setFile(null);
  //       setSelectedFileName("");
  //       setPdfURL(null);
  //     } else {
  //       toast.error("ไม่สามารถลบไฟล์ได้");
  //     }
  //   } catch (error) {
  //     console.error("เกิดข้อผิดพลาดในการลบไฟล์:", error);
  //     toast.error("เกิดข้อผิดพลาดในการลบไฟล์");
  //   }
  // };
  const removeImage = () => {
    setImage(null); // ลบภาพออกจากหน้า
    setDeletedImage(true); // ระบุว่าภาพถูกลบ
  };

  const removeFile = () => {
    setFile(null); // ลบไฟล์ออกจากหน้า
    setSelectedFileName(""); // รีเซ็ตชื่อไฟล์ที่เลือก
    setPdfURL(null); // ลบลิงก์ PDF
    setDeletedFile(true); // ระบุว่าไฟล์ถูกลบ
  };

  const UpdateCareManual = async () => {
    console.log(caremanual_name, image, file, detail);
    // if (!caremanual_name || !image) {
    //   toast.error("กรุณากรอกชื่อคู่มือและเลือกภาพก่อนทำการบันทึก");
    //   return; // หยุดการดำเนินการถ้าเงื่อนไขไม่ตรง
    // }
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

    // const isDuplicate = await checkDuplicateName(caremanual_name);
    // if (isDuplicate) {
    //   toast.error("ชื่อคู่มือซ้ำในระบบ กรุณาเปลี่ยนชื่อ");
    //   return; // หยุดการดำเนินการถ้าชื่อซ้ำ
    // }
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
        `https://backend-deploy-render-mxok.onrender.com/updatecaremanual/${id}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("แก้ไขคู่มือแล้ว:", result);
        toast.success("แก้ไขข้อมูลสำเร็จ");
        if (deletedImage) {
          await fetch(`https://backend-deploy-render-mxok.onrender.com/remove-image/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        if (deletedFile) {
          await fetch(`https://backend-deploy-render-mxok.onrender.com/remove-file/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setTimeout(() => {
          navigate("/home");
        }, 1100);
      } else {
        if (result.error) {
          toast.error(result.error); // แสดงข้อความจาก Backend
        } else {
          toast.error("ไม่สามารถแก้ไขคู่มือได้");
        }
        console.error("แก้ไขไม่ได้:", result.error || response.statusText);
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
              <a>แก้ไขคู่มือ</a>
            </li>
          </ul>
        </div>

        <div className="adminall card mb-1">
          <p className="title-header">แก้ไขคู่มือ</p>
          <div className="mb-1">
            <label>หัวข้อ</label>
            <input
              type="text"
              className={`form-control ${
                caremanualNameError ? "input-error" : ""
              }`}
              value={caremanual_name}
              onChange={(e) => setCaremanualName(e.target.value)}
            />
            {caremanualNameError && (
              <span className="error-text">{caremanualNameError}</span>
            )}
          </div>

          <div className="mb-1">
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
              )}
            </div>
            {!image && (
              <input
                type="file"
                className={`form-control ${imageError ? "input-error" : ""}`}
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
            {imageError && <span className="error-text">{imageError}</span>}
          </div>

          <div className="mb-1">
            <label>แนบไฟล์</label>
            {file ? (
              <div className="filename">
                {typeof file === "string" ? (
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <i
                      className="bi bi-filetype-pdf"
                      style={{ color: "red" }}
                    ></i>{" "}
                    {selectedFileName || fileName}
                  </a>
                ) : (
                  <a href={pdfURL} target="_blank" rel="noopener noreferrer">
                    <i
                      className="bi bi-filetype-pdf"
                      style={{ color: "red" }}
                    ></i>{" "}
                    {selectedFileName || fileName}
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

          <div className="mb-1">
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
