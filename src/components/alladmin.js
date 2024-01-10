import React, {useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import "../css/alladmin.css"


export default function Alladmin({}) {
  const [data, setData] = useState([]);
  // const [adminId, setAdminId] = useState('');

  useEffect(() => {
    getAllUser();
  }, []);
  
  const getAllUser = () => {
    fetch("http://localhost:5000/alladmin", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllAdmin");
        setData(data.data);
      });
  };



  const home = () => {
    window.location.href = "./home";
  };
  const add = () => {
    window.location.href = "./addadmin";
  };

  

  
  // const deleteadmin = (id, username) => {
   

    // if(window.confirm(`คุณต้องการลบ ${username}`)){}
  //   const Confirmdelete = window.confirm(`คุณต้องการลบ ${username}?`);
  //   if (Confirmdelete) {
  //     fetch("http://localhost:5000/deleteadmin", {
  //       method: "POST",
  //       crossDomain: true,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //       body: JSON.stringify({
  //         adminid: id,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         alert(data.data);
  //         getAllUser();
  //       });
  //   } else {
  //   }
  // };

  const deleteadmin = async () => {


  //   const confirmDelete = window.confirm(`คุณต้องการลบ ${username}?`);
  
  //   if (confirmDelete) {
  //     try {
  //       const response = await fetch("http://localhost:5000/deleteadmin", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //         body: JSON.stringify({
  //           adminid: id,
  //         }),
  //       });
  
  //       if (!response.ok) {
  //         throw new Error(`เกิดข้อผิดพลาด: ${response.status}`);
  //       }
  
  //       const data = await response.json();
  //       alert(data.data);
  //       getAllUser();
  //     } catch (error) {
  //       console.error("เกิดข้อผิดพลาดในการลบผู้ดูแลระบบ:", error.message);
  //     }
  //   }
  };
  
 
  return (
    <div>
      <button onClick={home} className="btn">
        home
      </button> <br/>
      <span></span>
      <button onClick={add} className="add btn btn-outline-secondary py-1 px-4">
        เพิ่มแอดมิน
      </button>
      <p className="countadmin">จำนวน : {data.length} คน</p>
      {data.map((i) => {
        return (
          <div class="adminall card mb-3 ">
            <div class="card-body">
            {/* <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={deleteadmin}></img> */}
              <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={deleteadmin}></img>
              <h5 class="card-title">{i.username}</h5>
            </div>
          </div>
        );
      })}
    </div>
  );
}
