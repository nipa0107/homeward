import React, { useEffect, useState, useRef } from "react";

import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/user.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
export default function AllUser() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
  const [token, setToken] = useState("");
  const tokenExpiredAlertShown = useRef(false);

  const formatIDCardNumber = (id) => {
    if (!id) return "";
    return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5");
  };

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
    getAllUser();
  }, []);

  const getAllUser = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/alluser", {
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

  useEffect(() => {
    const searchUser = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/searchuser?keyword=${encodeURIComponent(
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

  return (
    <main className="body">
     <Sidebar />
      <div className="home_content">
        <div className="homeheader">
          <div className="header">จัดการข้อมูลผู้ป่วย</div>
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
              <a>จัดการข้อมูลผู้ป่วย</a>
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
            <button
              onClick={() => navigate("/recover-patients")}
              className="btn btn-outline py-1 px-4 recover"
            >
              <i class="bi bi-trash3" style={{ marginRight: "8px" }}></i>
              ข้อมูลผู้ป่วยที่ถูกลบ
            </button>
            <button
              onClick={() => navigate("/adduser")}
              className="btn btn-outline py-1 px-4"
            >
              <i
                className="bi bi-plus-circle"
                style={{ marginRight: "8px" }}
              ></i>
              เพิ่มข้อมูลผู้ป่วย
            </button>
            </div>
          </div>
          <p className="countadmin">
              จำนวนผู้ป่วยทั้งหมด :{" "}
              {
                data.filter(
                  (user) =>
                    user.deletedAt === null || user.deletedAt === undefined
                ).length
              }{" "}
              คน
            </p>
        </div>
        <div className="content">
          <div className="table-container">
            {/* <div className="table100"> */}
            <table className="user-table table-all">
              <thead>
                <tr>
                  <th>เลขประจำตัวประชาชน</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>รายละเอียด</th>
                  <th>ข้อมูลใช้เข้าสู่ระบบ</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(
                  (user) =>
                    user.deletedAt === null || user.deletedAt === undefined
                ).length > 0 ? (
                  data
                    .filter(
                      (user) =>
                        user.deletedAt === null || user.deletedAt === undefined
                    )
                    .map((i, index) => (
                      <tr key={index}>
                        <td>{formatIDCardNumber(i.username)}</td>
                        <td>
                          {i.name} {i.surname}
                        </td>
                        <td>
                          <a
                            className="info"
                            onClick={() =>
                              navigate("/allinfo", { state: { id: i._id } })
                            }
                          >
                            รายละเอียด
                          </a>
                        </td>
                        <td className="buttongroup-in-table">
                          {/* {i.AdddataFirst ? (
                          <span>-</span>
                        ) : (
                          <button
                            className="btn btn-save"
                            onClick={() => {
                              if (i.physicalTherapy) {
                                navigate("/physicalTherapyUser", {
                                  state: { userData: i },
                                });
                              } else {
                                navigate("/displayUser", {
                                  state: { userData: i },
                                });
                              }
                            }}
                          >
                            <i className="bi bi-download"></i>
                          </button>
                        )} */}
                          <button
                            className="save"
                            onClick={() => {
                              if (i.physicalTherapy) {
                                navigate("/physicalTherapyUser", {
                                  state: { userData: i },
                                });
                              } else {
                                navigate("/displayUser", {
                                  state: { userData: i },
                                });
                              }
                            }}
                          >
                            <i className="bi bi-download"></i>
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
          </div>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
