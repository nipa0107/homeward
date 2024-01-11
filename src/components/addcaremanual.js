import { useEffect, useState } from "react";

export default function AddCaremanual({}) {
    const [caremanual_name, setCaremanualName] = useState("");
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [detail, setDetail] = useState("");
    const [allImage, setAllImage] = useState(null);

    useEffect(() => {
        // getImage();
      }, []);

    const onInputChange = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
      };
    
    const handleSubmit = (e) => {
        e.preventDefault(); 
        const formData = new FormData();
        formData.append("caremanual_name", caremanual_name);
        // formData.append("image", image);
        // formData.append("file", file);
        formData.append("detail", detail);
        

        fetch("http://localhost:5000/addcaremanual", {
            method: "POST",
            body: formData,
  
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data, "Addcaremanual");
              if (data.status === "ok") {
                console.log(caremanual_name, image, file,detail);
                window.location.href = "./allcaremanual";
              }
            });

        
    }
        
    
    //   const getImage = () => {
    //     fetch("http://localhost:5000/get-image",{
    //         method:"GET"
    //     })
    //     .then((res) => res.json())
    //     .then((data) => {
    //     console.log(data);
    //     setAllImage(data.data);
    // })
    //   };

    //   const getImage = async () => {
    //     const result = await axios.get("http://localhost:5000/get-image");
    //     console.log(result);
    //     setAllImage(result.data.data);
    //   };
    
      return (
        <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            <h3>เพิ่มคู่มือ</h3>
  
            <div className="mb-3">
              <label>หัวข้อ</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setCaremanualName(e.target.value)}
              />
            </div>
  
            {/* <div className="mb-3">
              <label>รูปภาพ</label>
                <input 
                type="file"
                className="form-control"
                accept="image/*"
                onChange={onInputChange}></input>
            </div> */}
  
            {/* <div className="mb-3">
              <label>แนบไฟล์</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.value)}
              />
            </div> */}

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

        <div>

      {/* {allImage == null
        ? ""
        : allImage.map((data) => {
            return (
              <img
                src={require(`../images/${data.image}`).default}
                height={100}
                width={100}
              />
            );
          })} */}
    </div>
      </div>


      );
    }