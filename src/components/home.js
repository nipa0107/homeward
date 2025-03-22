import React, { useEffect, useState, useRef } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "../css/caremanual.css";
import "../css/couttopcaremanual.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // ค้นหา
  const [token, setToken] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");
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
    fetch("https://backend-deploy-render-mxok.onrender.com/allcaremanual", {
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

  const deleteCaremanual = async (id, caremanual_name) => {
    if (window.confirm(`คุณต้องการลบ ${caremanual_name} หรือไม่ ?`)) {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/deleteCaremanual/${id}`,
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

  useEffect(() => {
    const searchCaremanual = async () => {
      try {
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/searchcaremanual?keyword=${encodeURIComponent(
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

  const [topCaremanuals, setTopCaremanuals] = useState([]);
  const [allCaremanuals, setallCaremanuals] = useState([]);

  useEffect(() => {
    const fetchTopCaremanuals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/getcaremanuals/top5"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTopCaremanuals(data);
      } catch (error) {
        console.error("Error fetching top caremanuals:", error);
      }
    };

    fetchTopCaremanuals();
  }, []);

  useEffect(() => {
    const fetchallCaremanuals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/getcaremanuals/all"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setallCaremanuals(data);
      } catch (error) {
        console.error("Error fetching top caremanuals:", error);
      }
    };

    fetchallCaremanuals();
  }, []);

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>{payload[0].payload.caremanual_name}</strong>
          </p>
          <p>ยอดการดู: {payload[0].value}</p> {/* เปลี่ยนเป็น "ยอดการดู" */}
        </div>
      );
    }
    return null;
  };

  return (
    <main className="body">
      <Sidebar />
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
         {/*  */}
         {/* <div className="count-topCaremanuals">
          <h5>5 อันดับยอดเข้าชมคู่มือมากที่สุด</h5>
          <div className="count-topCaremanuals-content">

         
          <ul className="count-topCaremanuals-list">
          {topCaremanuals.map((manual, index) => (
            <li key={manual._id}>
              <span>{index + 1}.</span> {manual.caremanual_name}
              (ยอดการเข้าชม: {manual.views})
            </li>
          ))}
        </ul>
          <div className="chart-container">
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={allCaremanuals}
                  margin={{ top: 10, right: 20, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="caremanual_name"
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="views" className="bar-style"radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </div> */}
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
