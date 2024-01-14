import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function UpdateCareManual() {
  const location = useLocation();
  const { id, caremanual } = location.state;
  const [caremanual_name, setCaremanualName] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [detail, setDetail] = useState("");
  const defaultImageURL =
    "https://gnetradio.com/wp-content/uploads/2019/10/no-image.jpg";

  console.log(caremanual);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    const previewImageElement = document.getElementById("previewImage");
    if (previewImageElement && selectedImage) {
      const imageURL = URL.createObjectURL(selectedImage);
      previewImageElement.src = imageURL;
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    fetchData();
  }, [id]);

  const UpdateCareManual = async () => {
    console.log(caremanual_name, image, file, detail);
  
    try {
      const formData = new FormData();
      formData.append("caremanual_name", caremanual_name);
      formData.append("detail", detail);
  
      // ถ้ามีการเลือกรูปภาพใหม่
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
        }
      );
  
      if (response.ok) {
        const updatedCaremanual = await response.json();
        console.log("แก้ไขคู่มือแล้ว:", updatedCaremanual);
        window.location.href = "./home";
        console.log(caremanual_name, image, file, detail);

      } else {
        console.error("แก้ไขไม่ได้:", response.statusText);
      }
    } catch (error) {
      console.error("การแก้ไขมีปัญหา:", error);
    }
  };
  

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h3>แก้ไขคู่มือ</h3>

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
          <br />
          {image ? (
            <img
              src={
                typeof image === "string"
                  ? require(`../images/${image}`)
                  : URL.createObjectURL(image)
              }
              alt="Caremanual Image"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          ) : (
            <img
              id="previewImage"
              src={defaultImageURL}
              alt="Default Image"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}
          <br />
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          ></input>
        </div>

        <div className="mb-3">
          <label>แนบไฟล์</label>

          <input
            type="file"
            className="form-control"
            accept="application/pdf"
            onChange={handleFileChange}
          />
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
          <button onClick={UpdateCareManual} className="btn btn-primary">
            บันทึก
          </button>
          <br />
        </div>
      </div>
      <div></div>
    </div>
  );
}
