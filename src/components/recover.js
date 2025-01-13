import React, { useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";
import "../css/alladmin.css";
import "../css/sidebar.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

export default function Recover({}) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
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
    getAllUser();
  }, []);

  const getAllUser = () => {
    fetch("http://localhost:5000/alluser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllUser");
        setData(data.data);
      });
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
    const searchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/searchuser?keyword=${encodeURIComponent(
            searchKeyword
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอค้นหา
            },
          }
        );

        const searchData = await response.json();
        if (response.ok) {
          if (searchData.data.length > 0) {
            setData(searchData.data);
          } else {
            setData([]);
          }
        } else {
          console.error("Error during search:", searchData.status);
        }
      } catch (error) {
        console.error("Error during search:", error);
      }
    };
    searchUser();
  }, [searchKeyword, token]);

  const recoverUser = async (id, username) => {
    if (window.confirm(`คุณต้องการกู้คืน ${username} นี้ใช่หรือไม่?`)) {

    try {
    
      // ดำเนินการเรียก API
      const response = await fetch(`http://localhost:5000/recoveruser/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        alert("กู้คืนข้อมูลสำเร็จ");
        getAllUser(); // เรียกข้อมูลใหม่หลังจากกู้คืน
      } else {
        alert(
          "เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถกู้คืนข้อมูลได้")
        );
      }
    } catch (error) {
      console.error("Error recovering user:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  }
};
  

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
              <span className="links_name">
                จัดการข้อมูลคู่มือการดูแลผู้ป่วย
              </span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i className="bi bi-person-plus"></i>
              <span className="links_name">จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>

          <li>
            <a href="allmpersonnel">
              <i className="bi bi-people"></i>
              <span className="links_name">จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i className="bi bi-prescription2"></i>
              <span className="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i className="bi bi-bandaid"></i>
              <span className="links_name">จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="/alluserinsetting">
              <i className="bi bi-bell"></i>
              <span className="links_name">ตั้งค่าการแจ้งเตือน</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i className="bi bi-person-gear"></i>
              <span className="links_name">จัดการแอดมิน</span>
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
                <i
                  className="bi bi-box-arrow-right"
                  id="log_out"
                  onClick={logOut}
                ></i>
                <span className="links_name">ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการข้อมูลผู้ป่วยที่ถูกลบ</div>
          <div className="profile_details ">
            <ul className="nav-list">
              <li>
                <a href="profile">
                  <i className="bi bi-person"></i>
                  <span className="links_name">
                    {adminData && adminData.username}
                  </span>
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
            <li>
              <a>จัดการข้อมูลผู้ป่วยที่ถูกลบ</a>
            </li>
          </ul>
        </div>

        {/*ค้นหา */}
        {/* <h3>จัดการข้อมูลผู้ป่วย</h3> */}
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
          <p className="countadmin">
            จำนวนผู้ป่วยที่ถูกลบทั้งหมด :{" "}
            {data.filter((user) => user.deletedAt !== null).length} คน
          </p>
        </div>
       
        <div className="content">
        {/* <div className="info-alert"> */}
              <p className="info-alert">
                ข้อมูลผู้ป่วยที่ถูกลบจะถูกเก็บไว้ในระบบ &nbsp;<strong> 30 วัน </strong>&nbsp;
                หลังจากนั้นข้อมูลจะถูกลบถาวรจากฐานข้อมูล
              </p>
        {/* </div> */}
          {/* <div className="table100"> */}
          <table className="table">
            <thead>
              <tr>
                <th>เลขประจำตัวประชาชน</th>
                <th>ชื่อ-นามสกุล</th>
                <th>วันที่ลบข้อมูล</th>
                {/* <th>รายละเอียด</th> */}
                <th className="centered-cell">กู้คืนข้อมูลผู้ป่วย</th>
              </tr>
            </thead>
            <tbody>
            {data.filter((user) => user.deletedAt !== null).length > 0 ? (
            data
                .filter((user) => user.deletedAt !== null) // กรองออกเฉพาะข้อมูลที่มีค่า deleteAt เป็น null
                .sort((a, b) => new Date(a.deletedAt) - new Date(b.deletedAt))
                .map((i, index) => (
                  
                    <tr key={index}>
                      <td>{i.username}</td>
                      <td>
                        {i.name} {i.surname}
                      </td>
                      {/* <td>
                        <a
                          className="info"
                          onClick={() =>
                            navigate("/allinfo", { state: { id: i._id } })
                          }
                        >
                          รายละเอียด
                        </a>
                      </td> */}
                      <td>
                        {new Date(i.deletedAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="centered-cell">
                        <button
                          className="btn btn-recover"
                          onClick={() => recoverUser(i._id, i.username)} // เรียกใช้ฟังก์ชัน recoverUser
                        >
                          <i className="bi bi-arrow-counterclockwise"></i>{" "}
                          กู้คืน
                        </button>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        ไม่พบข้อมูลที่คุณค้นหา
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
          {/* <div className="content">
         
          </div> */}
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
