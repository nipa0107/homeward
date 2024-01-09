// import React from "react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
          console.log(data)
          setAdminData(data.data);
        });
    }
  }, []); //ส่งไปครั้งเดียว

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
        

        <div>{adminData && adminData.username}</div> <br/>
        <div>{adminData && adminData.password} <p onClick={() => navigate("/updateadmin", {state: adminData})}>แก้ไข</p></div>
          <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}