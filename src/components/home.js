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
  const [isActive, setIsActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // ค้นหา
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
          if (data.data == "token expired") {
            // alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }

        })
        
        .catch((error) => {
          console.error("Error verifying token:", error);
          logOut();
        });
    } else {
      logOut();
    }
    getAllCaremanual();
  }, []); // ส่งไปครั้งเดียว

  const getAllCaremanual = () => {
    fetch("http://localhost:5000/allcaremanual", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}` // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      }
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
            Authorization: `Bearer ${token}`
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

  useEffect(() => {
    const searchCaremanual = async () => {
      try {
        const response = await fetch(`http://localhost:5000/searchcaremanual?keyword=${encodeURIComponent(searchKeyword)}`, {
          headers: {
            Authorization: `Bearer ${token}` // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอค้นหา
          }
        });
        const searchData = await response.json();
        if (response.ok) {
          if (searchData.data.length > 0) {
            setData(searchData.data);
          } else {
            setData([]); // ล้างข้อมูลเดิมในกรณีไม่พบข้อมูล
          }
        } else {
          console.error('Error during search:', searchData.status);
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    };
    searchCaremanual();
  }, [searchKeyword, token]);

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
            <a href="home">
              <i class="bi bi-book"></i>
              <span class="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i class="bi bi-person-plus"></i>
              <span class="links_name" >จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i class="bi bi-people"></i>
              <span class="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i class="bi bi-prescription2"></i>
              <span class="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" >
              <i class="bi bi-bandaid"></i>
              <span class="links_name" >จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting" >
            <i class="bi bi-bell"></i>              
            <span class="links_name" >ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" >
              <i class="bi bi-person-gear"></i>
              <span class="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
          <div class="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span class="links_name" >ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
      <div className="homeheader">
        <div className="header">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</div>
        <div class="profile_details">
        <ul className="nav-list">
          <li>
            <a href="profile" >
              <i class="bi bi-person"></i>
              <span class="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
          </ul>
        </div>
        </div>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a href="home">
                <i class="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</a>
            </li>

          </ul>
        </div>
        {/* <h3>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</h3> */}

        {/* ค้นหา */}
        <div className="search-bar">
          <input
            className="search-text"
            type="text"
            placeholder="ค้นหา"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>


        <div className="toolbar">
        <button
        className="btn btn-outline py-1 px-4"
        onClick={() => navigate("/addcaremanual", { state: adminData })}
      >
        <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i>
        เพิ่มคู่มือ
      </button>
          <p className="countadmin">จำนวนคู่มือทั้งหมด : {data.length} คู่มือ</p>
        </div>


 
        <div className="content">
          {data == null
            ? ""
            : data.map((i) => {
              // แปลงเวลา
              const formattedDate = new Intl.DateTimeFormat('th-TH', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              }).format(new Date(i.updatedAt));
              return (
                <div class="adminall card mb-3 ">
                  <div class="card-body">
                    <button className="deleteimg" onClick={() => deleteCaremanual(i._id, i.caremanual_name)}>ลบ</button>
                    <button className="editimg" onClick={() => navigate("/updatecaremanual", { state: { id: i._id, caremanual: i } })}>แก้ไข</button>
                    <h5 class="card-title">{i.caremanual_name}</h5>
                    {/* <h5 class="card-title">แก้ไขครั้งล่าสุดเมื่อ : {formattedDate}</h5> */}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
