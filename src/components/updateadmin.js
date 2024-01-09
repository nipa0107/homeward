import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Updateadmin(){
    const location=useLocation();
    const [oldpassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    useEffect(() =>{
        console.log(location);
        setOldPassword(location.state.oldpassword);
        setPassword(location.state.password);
        setConfirmPassword(location.state.confirmPassword);
    },[]);


    const profile = () => {
        window.location.href = "./profile";
      };
    return(
        <div className="auth-wrapper">
        <div className="auth-inner">
          รหัสผ่านเก่า
          <input className="form-control"/><br/>
          รหัสผ่านใหม่
          <input  className="form-control" /> 
          ยืนยันรหัสผ่านใหม่
          <input  className="form-control" /> 
        </div>
        <button onClick={profile} className="btn btn-primary">
            back
          </button>
      </div>
    )
}

export default Updateadmin;