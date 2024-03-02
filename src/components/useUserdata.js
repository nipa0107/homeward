//ไม่ใช้แล้ว
// import { useEffect, useState } from "react";

// const useUserData = () => {
//     const [adminData, setAdminData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = window.localStorage.getItem("token");
//     if (token) {
//       fetch("http://localhost:5000/profile", {
//         method: "POST",
//         crossDomain: true,
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify({
//           token: token,
//         }),
//       }).then((res) => {
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch');
//                 }
//                 return res.json();
//             })
//             .then((data) => {
//                 console.log(data);
//                 setAdminData(data.data);
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 setError(error.message);
//                 setLoading(false);
//             });
//         }
//     }, []); // ส่งไปครั้งเดียว

//     return { adminData, loading, error };
// }

// export default useUserData;