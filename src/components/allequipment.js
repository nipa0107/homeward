import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllEquip({}) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
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
        getAllEquip();
    }, []); //ส่งไปครั้งเดียว

    const getAllEquip =() => {
        fetch("http://localhost:5000/allequip", {
            method: "GET",
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data, "AllEquip");
              setData(data.data);
            });
    };


        
    const addEquips =() => {

        



//    const token = window.localStorage.getItem("token");
//       if (token) {
//         fetch("http://localhost:5000/profile", {
//           method: "POST",
//           crossDomain: true,
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//           body: JSON.stringify({
//             token: token,
//           }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             console.log(data);
//             setAdminData(data.data);
//           });
//       }
    };
   


    return(
        <div>
            <h3 className="title">จัดการอุปกรณ์</h3>

        <span></span>
        <button className="add btn btn-outline-secondary py-1 px-4"  onClick={() => navigate("/addequip", { state: adminData }) }>
          เพิ่มอุปกรณ์
        </button>
        <p className="countadmin">จำนวน : {data.length} คน</p>
        {data.map((i) => {
          return (
            <div class="adminall card mb-3 ">
              <div class="card-body">
                <h5 class="card-title">{i.equipment_name}</h5>
              </div>
            </div>
          );
        })}
      </div>
        
    );

}