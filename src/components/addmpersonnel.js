import React, { useState } from "react";
// import Alladmin from "./alladmin";

export default function AddMpersonnel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [tel, setTel] = useState("");
  const [name, setName] = useState("");
  const [nametitle, setNameTitle] = useState("");

  const home = () => {
    window.location.href = "./home";
  };

  const All = () => {
    window.location.href = "./allmpersonnel";
  };
  const handleSubmit = (e) => {
    e.preventDefault(); 

   
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    fetch("http://localhost:5000/addmpersonnel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username,
        password,
        confirmPassword,
        tel,
        name,
        nametitle
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addmpersonnel");
        if (data.status === "ok") {
          console.log(username, password, confirmPassword,tel,name,nametitle);
          window.location.href = "./allmpersonnel";
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>เพิ่มบุคลากร</h3>

          <div className="mb-3">
            <label>เลขที่ใบประกอบวิชาชีพ</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>รหัสผ่าน</label>
            <input
              type="password" 
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setTel(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>คำนำหน้าชื่อ</label>
            <select
              className="form-control"
              onChange={(e) => setNameTitle(e.target.value)}
            >
              <option value="">กรุณาเลือก</option>
              <option value="แพทย์หญิง">แพทย์หญิง</option>
              <option value="นายแพทย์">นายแพทย์</option>
              {/* <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่น ๆ</option> */}
            </select>
          </div>
          <div className="mb-3">
            <label>ชื่อ - นามสกุล</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>


          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
            <br />
          </div>
        </form>
        <button onClick={All} className="btn btn-primary">
          Back
        </button>
        <button onClick={home} className="btn btn-primary">
          Home
        </button>

      </div>
    </div>
  );
}
