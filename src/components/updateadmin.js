import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Updateadmin() {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

useEffect(() => {
    console.log(location);
    // setUsername(location.state.username);
    // setOldPassword(location.state.Oldpassword);
    // setOldPassword(location.state.Oldpassword);
    // setNewPassword(location.state.Newpassword);
    // setConfirmNewPassword(location.state.ConfirmPassword);
  }, [location]);

  const profile = () => {
    window.location.href = "./profile";
  };

  const Updateadmin = () => {
    console.log(password, newPassword, confirmNewPassword);

      fetch(`http://localhost:5000/updateadmin/${location.state._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          id: location.state._id,
          password: password,
          newPassword,
          confirmNewPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "ok") {
            window.location.href = "./profile";
          }
        })
        .catch((error) => {
          console.error(error);
        });
    // }
  };

  return (
    <div>
      <h3 className="title">แก้ไขรหัสผ่าน</h3>
    <div className="formcontainerpf">
      
      <div className="auth-inner">
        รหัสผ่านเก่า
        <input
          className="form-control"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        รหัสผ่านใหม่
        <input
          className="form-control"
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br />
        ยืนยันรหัสผ่านใหม่
        <input
          className="form-control"
          type="password"
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <br />
      </div>
      <button onClick={Updateadmin} className="btn bthsave btn-primary">
        บันทึก
      </button>

      <br /><br />



    </div>
    <button onClick={profile} className="btn btn-primary">
        Back
      </button>
    </div>

  );
}

export default Updateadmin;
