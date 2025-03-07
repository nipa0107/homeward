import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/caremanual.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
  const [searchKeyword, setSearchKeyword] = useState(""); // ค้นหา
  const [token, setToken] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const tokenExpiredAlertShown = useRef(false);

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
          if (
            data.data === "token expired" &&
            !tokenExpiredAlertShown.current
          ) {
            tokenExpiredAlertShown.current = true;
            alert("Token expired login again");
            window.localStorage.clear();
            window.location.href = "./";
          }
        })

        .catch((error) => {
          console.error("Error verifying token:", error);
          // logOut();
        });
    } else {
      // logOut();
    }
    getAllCaremanual();
  }, []); // ส่งไปครั้งเดียว

  const getAllCaremanual = () => {
    fetch("http://localhost:5000/allcaremanual", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.data);
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  const deleteCaremanual = async (id, caremanual_name) => {
    if (window.confirm(`คุณต้องการลบ ${caremanual_name} หรือไม่ ?`)) {
      try {
        const response = await fetch(
          `http://localhost:5000/deleteCaremanual/${id}`,
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
          getAllCaremanual();
        } else {
          console.error("Error during deletion:", data.data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  // bi-list
  const handleToggleSidebar = () => {
    setIsActive((prevState) => !prevState);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsActive(false); // ซ่อน Sidebar เมื่อจอเล็ก
      } else {
        setIsActive(true); // แสดง Sidebar เมื่อจอใหญ่
      }
    };

    handleResize(); // เช็กขนาดจอครั้งแรก
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const searchCaremanual = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/searchcaremanual?keyword=${encodeURIComponent(
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
    searchCaremanual();
  }, [searchKeyword, token]);

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a[sortBy]);
    const dateB = new Date(b[sortBy]);

    // การจัดเรียงตามลำดับ ascending หรือ descending
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const formatDate = (date) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(
      new Date(date)
    );
    const [datePart, timePart] = formattedDate.split(" ");
    const [hour, minute] = timePart.split(":");
    return `${datePart}, ${hour}.${minute} น.`;
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? (
        <i className="bi bi-caret-up-fill"></i>
      ) : (
        <i className="bi bi-caret-down-fill"></i>
      );
    }
    return <i className="bi bi-caret-down-fill"></i>;
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
            <a href="allsymptom">
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
            <a href="alladmin">
              <i className="bi bi-person-gear"></i>
              <span className="links_name">จัดการแอดมิน</span>
            </a>
          </li>
          <li>
            {adminData?._id && (
              <a
                href={`http://localhost:5173/auth?userId=${adminData._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-window-dock"></i>
                <span className="links_name">PTAH</span>
              </a>
            )}
          </li>

          {/* <li>
          <a       onClick={() => {
                sessionStorage.setItem("userId", adminData._id);
                window.location.href = "http://localhost:5173/auth";
              }}
              rel="noopener noreferrer"
            >
              <i className="bi bi-window"></i>
              <span className="links_name">เว็บ PTHA</span>
            </a>
          </li> */}
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
          <div className="header">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</div>
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
              <a>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</a>
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
                className="btn btn-outline py-1 px-4"
                onClick={() => navigate("/addcaremanual", { state: adminData })}
              >
                <i
                  className="bi bi-plus-circle"
                  style={{ marginRight: "8px" }}
                ></i>
                เพิ่มคู่มือ
              </button>
            </div>
          </div>
          <p className="countadmin">
            จำนวนคู่มือทั้งหมด : {data.length} คู่มือ
          </p>
        </div>

        <div className="content">
          <div className="table-container">
            <table className="caremanual-table table-all">
              <thead>
                <tr>
                  <th>ชื่อคู่มือ</th>
                  <th onClick={() => handleSort("createdAt")}>
                    สร้างเมื่อวันที่ {getSortIcon("createdAt")}
                  </th>
                  <th onClick={() => handleSort("updatedAt")}>
                    แก้ไขเมื่อวันที่ {getSortIcon("updatedAt")}
                  </th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((i, index) => {
                    const formattedCreateDate = formatDate(i.createdAt);
                    const formattedUpdateDate = formatDate(i.updatedAt);

                    return (
                      <tr key={index}>
                        <td>{i.caremanual_name}</td>
                        <td>{formattedCreateDate}</td>
                        <td>{formattedUpdateDate}</td>
                        <td className="buttongroup-in-table">
                          <button
                            className="editimg2"
                            onClick={() =>
                              navigate("/updatecaremanual", {
                                state: { id: i._id, caremanual: i },
                              })
                            }
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          <button
                            className="deleteimg2"
                            onClick={() =>
                              deleteCaremanual(i._id, i.caremanual_name)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
    </main>
  );
}
