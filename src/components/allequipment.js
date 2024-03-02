import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteimg from "../img/delete.png";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";

export default function AllEquip({ }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token); 
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
    getAllEquip();
  }, []); //ส่งไปครั้งเดียว

  const getAllEquip = () => {
    fetch("http://localhost:5000/allequip", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}` // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllEquip");
        setData(data.data);
      });
  };

  const deleteEquipment = async (id, equipment_name) => {
    if (window.confirm(`คุณต้องการลบ ${equipment_name} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteEquipment/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
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


  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  const searchEquipment = async () => {
    try {
      const response = await fetch(`http://localhost:5000/searchequipment?keyword=${searchKeyword}`, {
        headers: {
          Authorization: `Bearer ${token}` // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอค้นหา
        }
        });
      const searchData = await response.json();
      if (response.ok) {
        setData(searchData.data); // อัพเดทข้อมูลคู่มือที่ได้จากการค้นหา
      } else {
        console.error('Error during search:', searchData.status);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
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
        <div className="header">จัดการอุปกรณ์ทางการแพทย์</div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a className="bihouse">
                <i class="bi bi-house-fill" onClick={() => navigate("/home")}></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a>จัดการอุปกรณ์ทางการแพทย์</a>
            </li>
          </ul>
        </div>

 
         {/*ค้นหา */}
         <div className="search-bar">
        <input
          type="text"
          placeholder="ค้นหา"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value) } 
        />
        <button onClick={searchEquipment}>ค้นหา</button>
        </div>

        <div className="toolbar">
          <button
            className="btn btn-outline py-1 px-4"
            onClick={() => navigate("/addequip", { state: adminData })}
          >
            เพิ่มอุปกรณ์
          </button>
          <p className="countadmin">จำนวน : {data.length} ชิ้น</p>
        </div>
        <div className="content">
          <div className="cardall card mb-3">
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
                    <tr key={index} >
                      <td data-title="">{i.equipment_name}</td>
                      <td>{i.equipment_type}</td>
                      <td><img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteEquipment(i._id, i.equipment_name)}></img></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
