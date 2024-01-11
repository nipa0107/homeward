import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteimg from "../img/delete.png";

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

  const getAllEquip = () => {
    fetch("http://localhost:5000/allequip", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllEquip");
        setData(data.data);
      });
  };

  const deleteEquipment = async (id, equipment_name) => {
    if (window.confirm( `คุณต้องการลบ ${equipment_name} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteEquipment/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          getAllEquip();
        } else {
          console.error('Error during deletion:', data.data);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };

  const addEquips = () => {
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

  return (
    <div>
      <h3 className="title">จัดการอุปกร์ทางการแพทย์</h3>

      <span></span>
      <button
        className="add btn btn-outline-secondary py-1 px-4"
        onClick={() => navigate("/addequip", { state: adminData })}
      >
        เพิ่มอุปกรณ์
      </button>
      <p className="countadmin">จำนวน : {data.length} ชิ้น</p>
      {/* {data.map((i) => {
          return (
            <div class="adminall card mb-3 ">
              <div class="card-body">
                <h5 class="card-title">{i.equipment_name}</h5>
              </div>
            </div>
          );
        })} */}

      <table className="table">
        <thead>
          <tr>
            <th>ชื่ออุปกรณ์</th>
            <th>ประเภทอุปกรณ์</th>
            <th>คำสั่ง</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i, index) => {
            return (
              <tr key={index}>
                <td>{i.equipment_name}</td>
                <td>{i.equipment_type}</td>
                <td><img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteEquipment(i._id, i.equipment_name)}></img></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
