import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import "../css/alladmin.css"
import "../css/sidebar.css";
import logow from "../img/logow.png";


export default function Alladmin({ userData }) {
  const [data, setData] = useState([]);
  const [itemId, setItemId] = useState('');

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
          console.log(data)
          setAdminData(data.data);
        });
    }
  }, []); //ส่งไปครั้งเดียว


  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const admin = () => {
    window.location.href = "./alladmin";
  };

  const profile = () => {
    window.location.href = "./profile";
  };
  const [navCollpase, setNavCollapse] = useState(false);
  return (
    <div className="bartop">
      <nav className="nav">
        <div className="logo">
          <img src={logow} className="logow" alt="logo"></img>
          <i className="bi bi-justify" onClick={e => setNavCollapse(!navCollpase)}></i>
        </div>
        <ul>
          <i class="bx bx-user"></i>
          {/*เช็คว่ามีdataไหม */}
          {/* <li onClick={navCollpase}>{adminData && adminData.username}</li> */}
          <li onClick={profile}>{adminData && adminData.username}</li>
        </ul>
      </nav>
      <div className="sidebar_content">
        <div className={'sidebar-container ${navCollpase ? "navCollaps" : ""}'}>
          <div className="nav-option option1">
            <i class="bi bi-house" onClick={home}></i>
            <p onClick={home}>หน้าหลัก</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-book"></i>
            <p>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-people">
            </i>
            <p>จัดการข้อมูลบุคลากร</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-prescription2"></i>
            <p>จัดการอุปกรณ์ทางการแพทย์</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-person-gear" onClick={admin}></i>
            <p onClick={admin}>จัดการแอดมิน</p>
          </div>
          <div className="nav-option option1">
            <i class="bi bi-box-arrow-right" onClick={logOut}></i>
            <p onClick={logOut}>ออกจากระบบ</p>
          </div>
        </div>
      </div>
      <div className="container .col-md-8">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
