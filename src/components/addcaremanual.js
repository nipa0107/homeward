import { useEffect, useState } from "react";

export default function AddCaremanual({}) {
  const [caremanual_name, setCaremanualName] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [detail, setDetail] = useState("");
  const defaultImageURL = "https://gnetradio.com/wp-content/uploads/2019/10/no-image.jpg";

  useEffect(() => {
    const preview= document.getElementById("previewImage");
    if (preview) {
      preview.src = defaultImageURL;
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
          window.location.href = "./allcaremanual";
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3>เพิ่มคู่มือ</h3>

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
            <br />
            <br />

            
            <img
            // แสดงรูปที่เลือก
              id="previewImage"
              src={defaultImageURL} 
              alt="Preview"
              style={{ maxWidth: "20%" }}
            /> <br/><br/>
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

          <div className="mb-3">
            <label>รายละเอียด</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              บันทึก
            </button>
            <br />
          </div>
        </form>
      </div>

      <div></div>
    </div>
  );
}
