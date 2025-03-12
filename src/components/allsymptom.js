import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Allsymptom() {
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
    getSymptom();
  }, []);

  const getSymptom = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/allSymptom", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  };

  const deleteSymptom = async (id, username) => {
    if (window.confirm(`คุณต้องการลบ ${username} หรือไม่ ?`)) {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/deleteSymptom/${id}`,
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
          getSymptom();
        } else {
          console.error("Error during deletion:", data.data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  const add = () => {
    window.location.href = "./addsymptom";
  };

  useEffect(() => {
    const searchAdmins = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/searchsymptom?keyword=${encodeURIComponent(
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
          <div className="header">จัดการอาการผู้ป่วย</div>
          <div className="profile_details">
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
              <a>จัดการอาการผู้ป่วย</a>
            </li>
          </ul>
        </div>

        <div className="content-toolbar-symtom">
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
                เพิ่มอาการ
              </button>
            </div>
          </div>
          <p className="countadmin">จำนวนอาการทั้งหมด : {data.length} อาการ</p>
        </div>
        <div className="content">
          {data.length > 0 ? (
            data.map((i) => (
              <div key={i._id} className="adminall card mb-3 ">
                <div className="card-body">
                  <p className="card-title">{i.name}</p>
                  <div className="buttongroup">
                    <button
                      className="editimg"
                      onClick={() =>
                        navigate("/updatesymptom", {
                          state: { id: i._id, caremanual: i },
                        })
                      }
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="deleteimg"
                      alt="deleteimg"
                      onClick={() => deleteSymptom(i._id, i.name)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>ไม่พบข้อมูลที่อาการ</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
