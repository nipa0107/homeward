import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

export default function AlluserInSetting() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const [token, setToken] = useState("");
  const [medicalData, setMedicalData] = useState({});
  const tokenExpiredAlertShown = useRef(false); 
  const [thresholdData, setThresholdData] = useState([]);

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
    getAllUser();
    getAllUserWithThreshold(); 
  }, []);

  const getAllUser = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/alluser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllUser");
        setData(data.data);
      });
  };
  useEffect(() => {
    const fetchMedicalData = async () => {
      if (data.length === 0) return; 
  
      const userIds = data
        .filter((user) => user.deletedAt === null)
        .map((user) => user._id); 
  
      if (userIds.length === 0) return;
  
      try {
        const response = await fetch("https://backend-deploy-render-mxok.onrender.com/medicalInformation/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
        });
  
        const result = await response.json();
        if (result.status === "ok") {
          setMedicalData(result.data); 
        } else {
          console.error("Error fetching medical data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching medical data:", error);
      }
    };
  
    fetchMedicalData();
  }, [data]);


  const getAllUserWithThreshold = () => {
    fetch("https://backend-deploy-render-mxok.onrender.com/alluserwiththreshold", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((thresholdData) => {
        console.log(thresholdData, "UserWithThreshold");
        setThresholdData(thresholdData.data); // Save threshold data
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
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
            setData([]); // ล้างข้อมูลเดิมในกรณีไม่พบข้อมูล
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
          <div className="header">ตั้งค่าการแจ้งเตือน</div>
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
              <a>รายชื่อผู้ป่วย</a>
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
              onClick={() => navigate("/updatedefault")}
              className="btn btn-outline py-1 px-4"
            >
              <i className="bi bi-pencil" style={{ marginRight: "8px" }}></i>
              ตั้งค่าการแจ้งเตือนเริ่มต้น
            </button>
          </div>
        </div>
        <p className="countadmin">
              จำนวนผู้ป่วยทั้งหมด :{" "}
              {data.filter((user) => user.deletedAt === null).length} คน
            </p>
        </div>

        <div className="content">
        <div className="table-container">         
           <table className="setting-table table-all">
            <thead>
              <tr>
                <th>ชื่อ-สกุล</th>
                <th>ผู้ป่วยโรค</th>
                <th>การแจ้งเตือน</th>
                <th>ตั้งค่าการแจ้งเตือน</th>
              </tr>
            </thead>
            <tbody>
              {data.filter((user) => user.deletedAt === null).length > 0 ? (
                data
                  .filter((user) => user.deletedAt === null)
                  .map((i, index) => {
                    const userThreshold = thresholdData.find(
                      (userThreshold) => userThreshold.user === i._id
                    );
                    return (
                    <tr key={index}>
                      <td>
                        {i.name} {i.surname}
                      </td>
                      <td>
                        <span
                          style={{
                            color: medicalData[i._id]?.diagnosis
                              ? "inherit"
                              : "#B2B2B2",
                          }}
                        >
                          {medicalData[i._id]?.diagnosis
                            ? medicalData[i._id]?.diagnosis
                            : "ไม่มีข้อมูล"}
                        </span>
                      </td>
                      <td>
                            {userThreshold && userThreshold.thresholdMatch ? (
                              <span className="matches-default">ค่าเริ่มต้น</span>
                            ) : (
                              <span  className="not-matches">ค่าใหม่</span>
                            )}
                          </td>
                      <td className="buttongroup-in-table">
                        <button
                          className="icon-container-out"
                          onClick={() =>
                            navigate("/settingnoti", {
                              state: {
                                id: i._id,
                                name: i.name,
                                surname: i.surname,
                                gender: i.gender,
                                birthday: i.birthday,
                              },
                            })
                          }
                        >
                              <i className="bi bi-gear icon-gear"></i>
                         
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
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
