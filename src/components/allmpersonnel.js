import React, { useEffect, useState } from "react";
import "../css/alladmin.css"
import deleteimg from "../img/delete.png";
import "../css/sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

export default function AllMpersonnel({ }) {
  const [data, setData] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
  const [adminData, setAdminData] = useState("");
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
    getAllMpersonnel();
  }, []);


  const getAllMpersonnel = () => {
    fetch("http://localhost:5000/allMpersonnel", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}` // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      }
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

  const deleteMPersonnel = async (id, nametitle, name) => {
    if (window.confirm(`คุณต้องการลบ ${nametitle} ${name} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteMPersonnel/${id} `, {
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
          getAllMpersonnel();
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
  useEffect(() => {
    const searchMPersonnel = async () => {
      try {
        const response = await fetch(`http://localhost:5000/searchmpersonnel?keyword=${encodeURIComponent(searchKeyword)}`, {
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
    searchMPersonnel();
  }, [searchKeyword, token]);

  return (
    <main className="body">
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name">
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
        <div className="header">จัดการข้อมูลบุคลากร</div>
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
              <a href="#" >
                <i class="bi bi-house-fill" onClick={home}></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li><a>จัดการข้อมูลบุคลากร</a>
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
          />
        </div>

        <div className="toolbar">
          <button onClick={add} className="bi bi-plus-circle btn btn-outline py-1 px-4">
            เพิ่มบุคลากร
          </button>
          <p className="countadmin">จำนวน : {data.length} คน</p>
        </div>

        <div className="content">
          <div className="cardall card mb-3">
            <table className="table">
              <thead>
                <tr>
                  <th>คำนำหน้าชื่อ</th>
                  <th>ชื่อ-สกุล</th>
                  <th>คำสั่ง</th>
                </tr>
              </thead>
              <tbody>
                {data.map((i, index) => (
                  <tr key={index}>
                    <td>{i.nametitle}</td>
                    <td>{i.name}</td>
                    <td>
                      <img
                        src={deleteimg}
                        className="deleteimg"
                        alt="deleteimg"
                        onClick={() => deleteMPersonnel(i._id, i.nametitle, i.name)}
                      ></img>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
