import React, { useState } from "react";
import Alladmin from "./alladmin";

export default function AddAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 

  const home = () => {
    window.location.href = "./home";
  };

  const All = () => {
    window.location.href = "./alladmin";
  };
  const handleSubmit = (e) => {
    e.preventDefault(); 

   
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    fetch("http://localhost:5000/addadmin", {
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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Addadmain");
        if (data.status === "ok") {
          console.log(username, password, confirmPassword);
          window.location.href = "./alladmin";
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Add Admin</h3>

          <div className="mb-3">
            <label>ชื่อผู้ใช้</label>
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
