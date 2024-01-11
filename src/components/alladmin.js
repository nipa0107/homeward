import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import "../css/alladmin.css"
import "../css/sidebar.css";
import logow from "../img/logow.png";
import sidebar from "../components/sidebar";


export default function Alladmin({ }) {
  const [data, setData] = useState([]);

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

  
 
  return (

    <div>
      <sidebar/>

      {/* <li onClick={profile}>{adminData && adminData.username}</li>
      <i class="bi bi-person-gear" onClick={admin}></i>
      <p onClick={admin}>จัดการแอดมิน</p>
      <i class="bi bi-box-arrow-right" onClick={logOut}></i>
      <p onClick={logOut}>ออกจากระบบ</p> */}
      <button onClick={add} className="bi bi-plus-circle add btn btn-outline-secondary py-1 px-4">
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
              {/* <i class="bi bi-trash3" onClick={() => deleteAdmin(i._id, i.username)}></i> */}
            </div>
          </div>
        );
      })}
    </div>

    // <div className="bartop">
    //   <nav className="nav">
    //     <div className="logo">
    //       <img src={logow} className="logow" alt="logo"></img>
    //       <i className="bi bi-justify largeDeviceIcon" onClick={e => setNavCollapse(!navCollpase)}></i>
    //       <i className="bi bi-justify smallDeviceIcon" onClick={e => setSmallNavCollapse(!smallNavCollpase)}></i>
    //     </div>
    //     <ul>
    //       <i class="bi bi-person"></i>
    //       {/*เช็คว่ามีdataไหม */}
    //       {/* <li onClick={navCollpase}>{adminData && adminData.username}</li> */}
    //       <li onClick={profile}>{adminData && adminData.username}</li>
    //     </ul>
    //   </nav>
    //   <div className="sidebar_content">
    //     <div className={`${smallNavCollpase ? "smalNav":""}sidebar-container ${navCollpase ? "navCollaps" : ""}`}>
    //       <div className="nav-option option1">
    //         <i class="bi bi-book"></i>
    //         <p>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</p>
    //       </div>
    //       <div className="nav-option option1">
    //         <i class="bi bi-people">
    //         </i>
    //         <p>จัดการข้อมูลบุคลากร</p>
    //       </div>
    //       <div className="nav-option option1">
    //         <i class="bi bi-prescription2"></i>
    //         <p>จัดการอุปกรณ์ทางการแพทย์</p>
    //       </div>
    //       <div className="nav-option option1">
    //         <i class="bi bi-person-gear" onClick={admin}></i>
    //         <p onClick={admin}>จัดการแอดมิน</p>
    //       </div>
    //       <div className="nav-option option1">
    //         <i class="bi bi-box-arrow-right" onClick={logOut}></i>
    //         <p onClick={logOut}>ออกจากระบบ</p>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="container">
    //     <button onClick={add} className="bi bi-plus-circle add btn btn-outline-secondary py-1 px-4">
    //       เพิ่มแอดมิน
    //     </button>
    //     <p className="countadmin">จำนวน : {data.length} คน</p>
    //     {data.map((i) => {
    //       return (
    //         <div class="adminall card mb-3 ">
    //           <div class="card-body">
    //             {/* <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={deleteadmin}></img> */}
    //             <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteAdmin(i._id, i.username)}></img>

    //             <h5 class="card-title">{i.username}</h5>
    //             {/* <i class="bi bi-trash3" onClick={() => deleteAdmin(i._id, i.username)}></i> */}
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
  );
}
