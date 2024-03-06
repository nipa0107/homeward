import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";
import "../css/alladmin.css";
import "../css/sidebar.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";


export default function AllUser({ }) {
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
          console.log(data);
          setAdminData(data.data);
        });
    }
    getAllUser();
  }, []);

  const getAllUser = () => {
    fetch("http://localhost:5000/alluser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}` // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllUser");
        setData(data.data);
      });
  };

  const deleteUser = async (id, username) => {
    if (window.confirm(`คุณต้องการลบ ${username} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteUser/${id}`, {
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
          getAllUser();
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

  const searchUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/searchuser?keyword=${searchKeyword}`, {
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
  //ค้นหาโดย กด Enter 
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchUser();
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
            <a href="#" onClick={() => navigate("/alluser")}>
              <i class="bi bi-person-plus"></i>
              <span class="links_name" >จัดการข้อมูลผู้ป่วย</span>
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
          <div class="nav-logout">
            <li>
              <a href="#" onClick={logOut}>
                <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span class="links_name" >ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div class="profile_details ">
          <li>
            <a href="#" onClick={() => navigate("/profile")}>
              <i class="bi bi-person"></i>
              <span class="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
        </div>
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
            <li><a>จัดการข้อมูลผู้ป่วย</a>
            </li>
          </ul>
        </div>


        {/*ค้นหา */}
        <div className="search-bar">
          <input
            className="search-text"
            type="text"
            placeholder="ค้นหา"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={searchUser} className="btn btn-outline py-1 px-4">ค้นหา</button>
        </div>

        <div className="toolbar">
          <button onClick={() => navigate("/adduser")} className="bi bi-plus-circle btn btn-outline py-1 px-4">
            เพิ่มข้อมูลผู้ป่วย
          </button>
          <p className="countadmin">จำนวน : {data.length} คน</p>
        </div>


        <div className="content">
          {data.length === 0 ? (
            <p className="not-found-data">ไม่พบข้อมูลที่ค้นหา</p>
          ) : (
            <div className="cardall card mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>ชื่อผู้ใช้</th>
                    <th>ชื่อ-สกุล</th>
                    <th>คำสั่ง</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((i, index) => (
                    <tr key={index}>
                      <td>{i.username}</td>
                      <td>{i.name}</td>
                      <td>
                        <img
                          src={editimg}
                          className="editimg"
                          alt="editimg"
                          onClick={() => navigate("/updateuser", { state: { id: i._id, user: i } })}
                        ></img>
                      </td>
                      <td>
                        <img
                          src={deleteimg}
                          className="deleteimg"
                          alt="deleteimg"
                          onClick={() => deleteUser(i._id, i.username, i.name)}
                        ></img>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
