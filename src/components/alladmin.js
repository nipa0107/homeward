import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import "../css/alladmin.css"
import "../css/sidebar.css";
import logow from "../img/logow.png";


export default function Alladmin({}) {
  const [data, setData] = useState([]);
  const [adminId, setAdminId] = useState('');

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


  const deleteAdmin = (id, username) => {
    if (window.confirm(`คุณต้องการลบ ${username}`)) {
      fetch(`http://localhost:5000/deleteAdmin`, {
        method: "DELETE",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          adminId: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getAllUser();
        });
    } else {

    }
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
                <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteAdmin(i._id, i.username)}></img>

                <h5 class="card-title">{i.username}</h5>
                {/* <i class="bi bi-trash3" onClick={() => deleteAdmin(i._id, i.username)}></i> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
