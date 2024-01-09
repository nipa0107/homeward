// import React, { useEffect, useState } from "react";
// import Home from "./home";
// // import Profile from "./profile";

// export default function Detail() {
//     const [adminData, setAdminData] = useState("");

//   useEffect(() => {
    
//     fetch("http://localhost:5000/profile", {
//       method: "POST",
//       crossDomain: true,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({
//         token: window.localStorage.getItem("token"),
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data, "adminData");
//         setAdminData(data.data);
//       });
//   });

// return<Home adminData={adminData} />;
// // return < Profile adminData={adminData} />;
// }
import React, { useEffect, useState } from "react";
import Home from "./home";

export default function Detail({}) {
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
          console.log(data, "adminData");
          setAdminData(data.data);
        });
    }
  }, []); //ส่งไปครั้งเดียว

  return(
    <Home adminData={adminData} />
  );
    
  
}
