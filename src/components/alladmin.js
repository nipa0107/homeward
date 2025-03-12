import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/admin.css";
import "../css/sidebar.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Alladmin() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
  const [token, setToken] = useState("");
  const tokenExpiredAlertShown = useRef(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token);
    if (token) {
      fetch("https://backend-deploy-render-mxok.onrender.com/profile", {
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
          if (
            data.data === "token expired" &&
            !tokenExpiredAlertShown.current
          ) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
    getAllAdmin();
  }, []);

  const getAllAdmin = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/alladmin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
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
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/deleteAdmin/${id}`,
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
          getAllAdmin();
        } else {
          console.error("Error during deletion:", data.data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  const add = () => {
    window.location.href = "./addadmin";
  };

  useEffect(() => {
    const searchAdmins = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/searchadmin?keyword=${encodeURIComponent(
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
            setData([]); // ล้างข้อมูลเดิมในกรณีไม่พบข้อมูล
          }
        } else {
          console.error("Error during search:", searchData.status);
        }
      } catch (error) {
        console.error("Error during search:", error);
      }
    };
    searchAdmins();
  }, [searchKeyword, token]);

  return (
    <main className="body">
      <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการแอดมิน</div>
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
              <a>จัดการแอดมิน</a>
            </li>
          </ul>
        </div>

        {/*ค้นหา */}
        {/* <h3>จัดการแอดมิน</h3> */}


        <div className="content-toolbar">
        <div className="toolbar-container">
        <div className="search-bar">
        <i className="bi bi-search search-icon"></i>
          <input
            className="search-text"
            type="text"
            placeholder="ค้นหา"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
          <div className="toolbar">
            <button onClick={add} className="btn btn-outline py-1 px-4">
              <i
                className="bi bi-plus-circle"
                style={{ marginRight: "8px" }}
              ></i>
              เพิ่มแอดมิน
            </button>
            </div>
            </div>
            <p className="countadmin">จำนวนแอดมินทั้งหมด : {data.length} คน</p>
        </div>

        <div className="content">
          <div className="table-container">
            <table className="admin-table table-all">
              <thead>
                <tr>
                  <th className="sticky-column">ชื่อผู้ใช้</th>
                  <th>อีเมล</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data
                    .sort((a, b) => {
                      if (a.username === adminData.username) return -1;
                      if (b.username === adminData.username) return 1;
                      return new Date(a.createdAt) - new Date(b.createdAt);
                    })
                    .map((i) => (
                      <tr key={i._id}>
                        <td className="sticky-column">{i.username}</td>
                        <td>{i.email}</td>
                        <td
                          className={
                            i.isEmailVerified ? "verified" : "not-verified"
                          }
                        >
                          {i.isEmailVerified ? (
                            <div>
                              <i
                                className="bi bi-check-circle"
                                style={{ color: "#42bd41", marginRight: "5px" }}
                              ></i>
                              ยืนยันแล้ว
                            </div>
                          ) : (
                            <div>
                              <i
                                className="bi bi-x-circle"
                                style={{ color: "#bdbdbd", marginRight: "5px" }}
                              ></i>
                              ยังไม่ยืนยัน
                            </div>
                          )}
                        </td>
                        <td className="buttongroup-in-table">
                          {i.username !== adminData.username && (
                            <button
                              className="deleteimg"
                              onClick={() => deleteAdmin(i._id, i.username)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      ไม่พบข้อมูลที่คุณค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
