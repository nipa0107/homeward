import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteimg from "../img/delete.png";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";

export default function AllEquip({}) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // ค้นหา
  const [token, setToken] = useState("");

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
    getAllEquip();
  }, []); // ส่งไปครั้งเดียว

  const getAllEquip = () => {
    fetch("http://localhost:5000/allequip", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
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
        const response = await fetch(
          `http://localhost:5000/deleteEquipment/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          getAllEquip();
        } else {
          console.error("Error during deletion:", data.data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
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
    const searchEquipment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/searchequipment?keyword=${encodeURIComponent(searchKeyword)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
        console.error("Error during search:", error);
      }
    };
    searchEquipment();
}, [searchKeyword, token]);

  return (
    <main className="body">
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
            </div>
          </div>
          <i className="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <a href="home">
              <i className="bi bi-book"></i>
              <span className="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i className="bi bi-person-plus"></i>
              <span className="links_name" >จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i className="bi bi-people"></i>
              <span className="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i className="bi bi-prescription2"></i>
              <span className="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i className="bi bi-bandaid"></i>
              <span className="links_name" >จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting" >
            <i className="bi bi-bell"></i>              
            <span className="links_name" >ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i className="bi bi-person-gear"></i>
              <span className="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
          <li>
            <a href="recover-patients">
              <i className="bi bi-trash"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วยที่ถูกลบ</span>
            </a>
          </li>
          <div className="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i className='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span className="links_name" >ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
      <div className="homeheader">
        <div className="header">จัดการอุปกรณ์ทางการแพทย์</div>
        <div className="profile_details">
          <ul className="nav-list">
          <li>
            <a href="profile" >
              <i className="bi bi-person"></i>
              <span className="links_name" >{adminData && adminData.username}</span>
            </a>
          </li>
          </ul>
        </div>
        </div>
        <div className="breadcrumbs">
          <ul>
            <li>
            <a href="home">
                <i className="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li><a>จัดการอุปกรณ์ทางการแพทย์</a>
            </li>
          </ul>
        </div>
        {/* <h3>จัดการอุปกรณ์ทางการแพทย์</h3> */}

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
        onClick={() => navigate("/addequip", { state: adminData })}
      >
        <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i>
        เพิ่มอุปกรณ์
      </button>
      <p className="countadmin">จำนวนอุปกรณ์ทั้งหมด : {data.length} ชิ้น</p>
    </div>
        <div className="content">
          {/* <div className="cardall card mb-3"> */}
            <table className="table">
              <thead>
                <tr>
                  <th>ชื่ออุปกรณ์</th>
                  <th>ประเภทอุปกรณ์</th>
                  <th className="success">จัดการ</th>
                </tr>
              </thead>
              <tbody>
              {data.length > 0 ? (
                data.map((i, index) => (
                  <tr key={index}>
                    <td data-title="">{i.equipment_name}</td>
                    <td>{i.equipment_type}</td>
                    <td className="buttongroup-in-table">
                    <button className="editimg2" onClick={() => navigate("/updateequip", { state: { id: i._id,equip: i} })}>แก้ไข</button>
                      <button
                        className="deleteimg2"
                        alt="deleteimg"
                        onClick={() => deleteEquipment(i._id, i.equipment_name)}
                      >ลบ</button>

                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                     ไม่พบข้อมูลที่คุณค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          {/* </div> */}
        </div>
      </div>
    </main>
  );
}
