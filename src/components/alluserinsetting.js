import React, { useEffect, useState } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

export default function AlluserInSetting() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const [token, setToken] = useState("");
  const [medicalData, setMedicalData] = useState({});

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
      const promises = data.map(async (user) => {
        if (user.deletedAt === null) {
          try {
            const response = await fetch(
              `http://localhost:5000/medicalInformation/${user._id}`
            );
            const medicalInfo = await response.json();
            return {
              userId: user._id,
              hn: medicalInfo.data?.HN,
              an: medicalInfo.data?.AN,
              diagnosis: medicalInfo.data?.Diagnosis,
            };
          } catch (error) {
            console.error(
              `Error fetching medical information for user ${user._id}:`,
              error
            );
            return {
              userId: user._id,
              hn: "Error",
              an: "Error",
              diagnosis: "Error fetching data",
            };
          }
        }
        return null;
      });
      const results = await Promise.all(promises);
      const medicalDataMap = results.reduce((acc, result) => {
        if (result) {
          acc[result.userId] = result;
        }
        return acc;
      }, {});
      setMedicalData(medicalDataMap);
    };

    if (data.length > 0) {
      fetchMedicalData();
    }
  }, [data]);

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

        <div className="content-toolbar">
          <div className="toolbar">
            <button
              onClick={() => navigate("/updatedefault")}
              className="btn btn-outline py-1 px-4"
            >
              <i className="bi bi-pencil" style={{ marginRight: "8px" }}></i>
              ตั้งค่าการแจ้งเตือนเริ่มต้น
            </button>
            <p className="countadmin">
              จำนวนผู้ป่วยทั้งหมด :{" "}
              {data.filter((user) => user.deletedAt === null).length} คน
            </p>
          </div>
        </div>
        <div className="content">
          {/* <div className="table100"> */}
          <table className="setting-table">
            <thead>
              <tr>
                {/* <th>HN </th>
                <th>AN</th> */}
                <th>ชื่อ-สกุล</th>
                {/* <th>อายุ</th> */}
                <th>ผู้ป่วยโรค</th>
                <th>ตั้งค่าการแจ้งเตือน</th>
              </tr>
            </thead>
            <tbody>
              {data.filter((user) => user.deletedAt === null).length > 0 ? (
                data
                  .filter((user) => user.deletedAt === null)
                  .map((i, index) => (
                    <tr key={index}>
                      {/* <td>
                        <span
                          style={{
                            color: medicalData[i._id]?.hn
                              ? "inherit"
                              : "#B2B2B2",
                          }}
                        >
                          {medicalData[i._id]?.hn
                            ? medicalData[i._id]?.hn
                            : "ไม่มีข้อมูล"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: medicalData[i._id]?.an
                              ? "inherit"
                              : "#B2B2B2",
                          }}
                        >
                          {medicalData[i._id]?.an
                            ? medicalData[i._id]?.an
                            : "ไม่มีข้อมูล"}
                        </span>
                      </td> */}

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
                            {/* <div className="icon-container">
                              <i className="bi bi-bell icon-bell"></i> */}
                              <i className="bi bi-gear icon-gear"></i>
                            {/* </div> */}
                          {/* ตั้งค่าการแจ้งเตือน */}
                        </button>
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
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
