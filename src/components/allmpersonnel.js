import React, {useEffect, useState } from "react";
import "../css/alladmin.css"


export default function AllMpersonnel({}) {
  const [data, setData] = useState([]);
  // const [adminId, setAdminId] = useState('');

  useEffect(() => {
    getAllMpersonnel();
  }, []);
  
  const getAllMpersonnel = () => {
    fetch("http://localhost:5000/allMpersonnel", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllMpersonnel");
        setData(data.data);
      });
  };



  const home = () => {
    window.location.href = "./home";
  };
  const add = () => {
    window.location.href = "./addmpersonnel";
  };

 
  return (
    <div>
        <h3>จัดการข้อมูลบุคลากร</h3>
      <button onClick={home} className="btn">
        home
      </button> <br/>
      <span></span>
      <button onClick={add} className="add btn btn-outline-secondary py-1 px-4">
        เพิ่มบุคคลากร
      </button>
      <p className="countadmin">จำนวน : {data.length} คน</p>
      <table className="table">
        <thead>
          <tr>
            <th>คำนำหน้าชื่อ</th>
            <th>ชื่อ-สกุล</th>
            <th>คำสั่ง</th>
          </tr>
          </thead>
          <tbody>
           
            {data.map((i, index) => {
               return (
               <tr key={index}>
              <td>{i.nametitle}</td>
              <td>{i.name}</td>
              <td>คำสั่ง</td>
              </tr>
               );
            })}
          </tbody>
      </table>
    </div>
  );
}
