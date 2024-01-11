import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import "../css/alladmin.css";
import "../css/sidebar.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";


export default function Alladmin({ }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");

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

  const deleteAdmin = async (id, username) => {
    if (window.confirm(`คุณต้องการลบ ${username} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteAdmin/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          getAllUser();
        } else {
          console.error('Error during deletion:', data.data);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };




  const home = () => {
    window.location.href = "./home";
  };
  const add = () => {
    window.location.href = "./addadmin";
  };
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  // const [navCollpase, setNavCollapse] = useState(false);
  // const [smallNavCollpase, setSmallNavCollapse] = useState(false);
  return (
    /* <nav className="nav">
      <div className="logo">
        <img src={logow} className="logow" alt="logo"></img>
        <i className="bi bi-justify largeDeviceIcon" onClick={e => setNavCollapse(!navCollpase)}></i>
        <i className="bi bi-justify smallDeviceIcon" onClick={e => setSmallNavCollapse(!smallNavCollpase)}></i>
      </div>
      <ul>
        <i class="bi bi-person"></i>
        <li onClick={() => navigate("/profile")}>{adminData && adminData.username}</li>
      </ul>
    </nav> */
    /* <div className="sidebar_content">
      <div className={`${smallNavCollpase ? "smalNav" : ""}sidebar-container ${navCollpase ? "navCollaps" : ""}`}>
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
          <i class="bi bi-person-gear" onClick={() => navigate("/alladmin")}></i>
          <p onClick={() => navigate("/alladmin")}>จัดการแอดมิน</p>
        </div>
        <div className="nav-option option1">
          <i class="bi bi-box-arrow-right" onClick={logOut}></i>
          <p onClick={logOut}>ออกจากระบบ</p>
        </div>
      </div>
    </div> */

    <main>
      <div className="sidebar">
        <div className="logo_content">
          <div className="logo">
          <i className="bi bi-justify"></i>
          <img src={logow} className="logow" alt="logo"></img>
          </div>
        </div>
      </div>
      <button onClick={add} className="bi bi-plus-circle add btn btn-outline-secondary py-1 px-4">
        เพิ่มแอดมิน
      </button>
      <p className="countadmin">จำนวน : {data.length} คน</p>
      {data.map((i) => {
        return (
          <div class="adminall card mb-3 ">
            <div class="card-body">
              <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteAdmin(i._id, i.username)}></img>
              <h5 class="card-title">{i.username}</h5>
            </div>
          </div>
        );
      })}
    </main>
  );
}
