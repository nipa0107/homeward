import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/mpersonnel.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

export default function AllMpersonnel() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
  const [adminData, setAdminData] = useState("");
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
          if (data.data === "token expired" && !tokenExpiredAlertShown.current) {
            tokenExpiredAlertShown.current = true; 
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        });
    }
    getAllMpersonnel();
  }, []);

  const getAllMpersonnel = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/allMpersonnel", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllMpersonnel");
        setData(data.data);
      });
  };

  const add = () => {
    window.location.href = "./addmpersonnel";
  };

  const deleteMPersonnel = async (id, nametitle, name) => {
    if (window.confirm(`คุณต้องการลบ ${nametitle} ${name} หรือไม่ ?`)) {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/deleteMPersonnel/${id} `,
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
          getAllMpersonnel();
        } else {
          console.error("Error during deletion:", data.data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };


  useEffect(() => {
    const searchMPersonnel = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/searchmpersonnel?keyword=${encodeURIComponent(
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
    searchMPersonnel();
  }, [searchKeyword, token]);

  return (
    <main className="body">
      <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการข้อมูลบุคลากร</div>
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
              <a>จัดการข้อมูลบุคลากร</a>
            </li>
          </ul>
        </div>


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
              เพิ่มบุคลากร
            </button>
            </div>
          </div>
          <p className="countadmin">จำนวนบุคลากรทั้งหมด : {data.length} คน</p>
        </div>

        <div className="content">
        <div className="table-container">
            <table className="mpersonnel-table table-all">
              <thead>
                <tr>
                  <th>เลขใบประกอบวิชาชีพ</th>
                  <th>คำนำหน้าชื่อ</th>
                  <th>ชื่อ-สกุล</th>
                  {/* <th>อีเมล</th> */}
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
              {data.length > 0 ? (
                data.map((i) => (
                  <tr key={i._id}>
                    <td>{i.username}</td>
                    <td>{i.nametitle}</td>
                    <td>
                      {i.name} {i.surname}
                    </td>
                    <td className="buttongroup-in-table">
                      <button
                        className="editimg2"
                        onClick={() =>
                          navigate("/updatempersonnel", {
                            state: { id: i._id, caremanual: i },
                          })
                        }
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        className="deleteimg2"
                        alt="deleteimg"
                        onClick={() =>
                          deleteMPersonnel(i._id, i.nametitle, i.name)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                    ไม่พบข้อมูลที่คุณค้นหา
                  </td>
                </tr>
                )
              }
              </tbody>
            </table>
            </div>
        </div>
      </div>
    </main>
  );
}
