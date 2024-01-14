import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";

export default function Home({ }) {

  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [caremanual, setCaremanual] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    getAllCaremanual();
  }, []);

  const add = () => {
    window.location.href = "./addcaremanual";
  };
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



  const getAllCaremanual = () => {
    fetch("http://localhost:5000/allcaremanual", {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.data);
      })
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  const deleteCaremanual = async (id, caremanual_name) => {
    if (window.confirm(`คุณต้องการลบ ${caremanual_name} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteCaremanual/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          getAllCaremanual();
        } else {
          console.error('Error during deletion:', data.data);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };

  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <main className="body">
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name" >
              <img src={logow} className="logow" alt="logo" ></img>
            </div>
          </div>
          <i class='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul class="nav-list">
          <li>
            <a href="#" onClick={() => navigate("/home")}>
              <i class="bi bi-book"></i>
              <span class="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allmpersonnel")}>
              <i class="bi bi-people"></i>
              <span class="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/allequip", { state: adminData })}>
              <i class="bi bi-prescription2"></i>
              <span class="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
        </ul>
        <div class="profile_content">
          <div className="profile">
            <div class="profile_details">
              <i class="bi bi-person" onClick={() => navigate("/profile")}></i>
              <div class="name_job">
                <div class="name"><li onClick={() => navigate("/profile")}>{adminData && adminData.username}</li></div>
              </div>
            </div>
            <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
          </div>
        </div>
      </div>
      <div className="home_content">
        <div className="header">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</div>
        <hr></hr>
        <div className="toolbar">
          <button onClick={() => navigate("/addcaremanual")} className="bi bi-plus-circle add btn btn-outline py-1 px-4">
            เพิ่มคู่มือ
          </button>
          <p className="countadmin">จำนวน : {data.length} คู่มือ</p>
        </div>
        <div className="content">
        {data == null
          ? ""
          : data.map((i) => {
            return (
              <div class="adminall card mb-3 ">
                <div class="card-body">
                  <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteCaremanual(i._id, i.caremanual_name)}></img><span></span>
                  <img src={editimg} className="editimg" alt="deleteimg" onClick={() => navigate("/updatecaremanual", { state: { id: i._id, caremanual: i } })}></img>
                  <h5 class="card-title">{i.caremanual_name}</h5>
                </div>
              </div>
            );
          })}
          </div>
      </div>
    </main>
  );
}
