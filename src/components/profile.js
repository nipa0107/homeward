import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState("");

  useEffect(() => {
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
  }, []); //ส่งไปครั้งเดียว

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  return (
    <div >
      <h3 className="title">โปรไฟล์ผู้ใช้</h3>
      <div className="containerprofile">
        <div className="formcontainerpf">
          <div>{adminData && adminData.username}</div> <br />
          <div>
            {adminData && adminData.password.replace(/./g, "•".repeat(1))}{" "}
            <p onClick={() => navigate("/updateadmin", { state: adminData })}>
              แก้ไข
            </p>
          </div>
        </div>
      </div>
      <button onClick={logOut} className="btn btn-primary">
        Log Out
      </button>
    </div>
  );
}
