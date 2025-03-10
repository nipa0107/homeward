import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/recover.css";
import "../css/sidebar.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

export default function Recover() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState("");
  const [isActive, setIsActive] = useState(window.innerWidth > 967);  
  const [searchKeyword, setSearchKeyword] = useState(""); //ค้นหา
  const [token, setToken] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
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
        const response = await fetch(
          `https://backend-deploy-render-mxok.onrender.com/recoveruser/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          alert("กู้คืนข้อมูลสำเร็จ");
          // getAllUser();
          navigate("/alluser");
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

  const formatDate = (date) => {
    // ตรวจสอบว่า date เป็นวันที่ที่ถูกต้องหรือไม่
    const validDate = new Date(date);
    if (isNaN(validDate)) {
      return "ข้อมูลวันที่ไม่ถูกต้อง";
    }

    // กำหนดรูปแบบวันที่
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    // ใช้ Intl.DateTimeFormat เพื่อแสดงวันที่และเวลา
    const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(
      validDate
    );

    // แยกวันที่และเวลา
    const [datePart, timePart] = formattedDate.split(" ");
    const [hour, minute] = timePart.split(":");

    return `${datePart}, ${hour}.${minute} น.`;
  };

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.deletedAt);
      const dateB = new Date(b.deletedAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    setData(sortedData); // อัปเดตข้อมูลหลังจากการเรียงลำดับ
    setSortOrder(sortOrder === "desc" ? "asc" : "desc"); // เปลี่ยนทิศทางการเรียง
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
            <li className="middle">
              <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow middle">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li className="ellipsis">
              <a href="alluser">...</a>
            </li>
            <li className="arrow ellipsis">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>ข้อมูลผู้ป่วยที่ถูกลบ</a>
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
          </div>
        </div>
        <p className="countadmin">
              จำนวนผู้ป่วยที่ถูกลบทั้งหมด :{" "}
              {data.filter((user) => user.deletedAt !== null).length} คน
            </p>
        </div>

        <div className="content">
          <div className="info-alert">
            <p>ข้อมูลผู้ป่วยที่ถูกลบจะถูกเก็บไว้ในระบบ</p>
            <p>
              <strong>30 วัน</strong>
            </p>
            <p>หลังจากนั้นข้อมูลจะถูกลบถาวรจากฐานข้อมูล</p>
          </div>

          <div className="table-container">
            <table className="recover-table table-all">
              <thead>
                <tr>
                  {/* <th>ลำดับ</th> */}
                  <th>เลขประจำตัวประชาชน</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>รายละเอียด</th>
                  <th onClick={handleSort}>
                    วันที่ลบข้อมูล
                    {sortOrder === "desc" ? (
                      <i class="bi bi-caret-down-fill"></i>
                    ) : (
                      <i class="bi bi-caret-up-fill"></i>
                    )}{" "}
                    {/* แสดงลูกศรขึ้นหรือลง */}
                  </th>
                  <th>กู้คืนข้อมูลผู้ป่วย</th>
                </tr>
              </thead>
              <tbody>
                {data.filter((user) => user.deletedAt !== null).length > 0 ? (
                  data
                    .filter((user) => user.deletedAt !== null) // กรองออกเฉพาะข้อมูลที่มีค่า deleteAt เป็น null
                    // .sort((a, b) => new Date(a.deletedAt) - new Date(b.deletedAt))
                    .map((i, index) => (
                      <tr key={index}>
                        {/* <td>{index + 1}</td> */}
                        <td>{formatIDCardNumber(i.username)}</td>
                        <td>
                          {i.name} {i.surname}
                        </td>
                        <td>
                          <a
                            className="info"
                            onClick={() =>
                              navigate("/allinfodeleted", {
                                state: { id: i._id },
                              })
                            }
                          >
                            รายละเอียด
                          </a>
                        </td>
                        <td>{formatDate(i.deletedAt)}</td>
                        <td className="buttongroup-in-table">
                          <button
                            className="btn-recover"
                            onClick={() => recoverUser(i._id, i.username)} // เรียกใช้ฟังก์ชัน recoverUser
                          >
                            <i class="bi bi-recycle"></i>{" "}
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      ไม่พบข้อมูลที่คุณค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* <div className="content">
             */}
          </div>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
