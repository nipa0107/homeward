// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// function Updateadmin(){


//     const location=useLocation();
//     const [oldpassword, setOldPassword] = useState("");
//     const [password, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmNewPassword] = useState(""); 

    

//     useEffect(() =>{
//         console.log(location);
//         setOldPassword(location.state.oldpassword);
//         setNewPassword(location.state.password);
//         setConfirmNewPassword(location.state.confirmPassword);

//     },[]);


//     const profile = () => {
//         window.location.href = "./profile";
//       };

//       const Updateadmin = () => {
//         console.log(oldpassword, password,confirmPassword);

//         const token = window.localStorage.getItem("token");
//         if (token) {
//           fetch("http://localhost:5000/updateadmin/:id", {
//             method: "POST",
//             crossDomain: true,
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//               "Access-Control-Allow-Origin": "*",
//             },
//             body: JSON.stringify({
//               // id:location.state._id
//               oldpassword: oldpassword,
//               password: password,
//               confirmPassword: confirmPassword,
//             }),
//           })
//             .then((res) => res.json())
//             .then((data) => {
//               console.log(data)
//               // setAdminData(data.data);
//             });
//         }
//       }
//     return(
//         <div className="auth-wrapper">
//         <div className="auth-inner">
//           รหัสผ่านเก่า
//           <input className="form-control" 
//           type="password"
//           onChange={(e) => setOldPassword(e.target.value)}/><br/>
//           รหัสผ่านใหม่
//           <input  className="form-control" 
//            type="password"
//            onChange={(e) => setNewPassword(e.target.value)}/><br/>
//           ยืนยันรหัสผ่านใหม่
//           <input  className="form-control" 
//            type="password"
//            onChange={(e) => setConfirmNewPassword(e.target.value)}/><br/>
//         </div>
      
//           <button onClick={Updateadmin} className="btn btn-primary">
//             Update
//           </button>

//           <button onClick={profile} className="btn btn-primary">
//             back
//           </button>
//       </div>
//     )
// }

// export default Updateadmin;


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Updateadmin() {
  const location = useLocation();
  // const [username, setUsername] = useState("");
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
    // const location = useLocation();
    console.log(password, newPassword, confirmNewPassword);

    const token = window.localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:5000/updateadmin/${location.state._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
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
          // ทำอะไรบางอย่างหลังจากที่อัปเดตข้อมูล
        })
        .catch((error) => {
          console.error(error);
          // จัดการ error ตามที่คุณต้องการ
        });
    }
  };

  return (
    <div className="auth-wrapper">
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
      <button onClick={Updateadmin} className="btn btn-primary">
        Update
      </button>

      <br /><br />
      <button onClick={profile} className="btn btn-primary">
        Back
      </button>


    </div>
  );
}

export default Updateadmin;
