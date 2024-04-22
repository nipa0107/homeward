import React, { useEffect, useState } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateMPersonnel() {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState("");
    const [adminData, setAdminData] = useState("");
    const {id} = location.state;
    const [isActive, setIsActive] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [nametitle, setNameTitle] = useState("");
    const [error, setError] = useState(""); 



    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/getmpersonnel/${id}`
          );
          const data = await response.json();
          setUsername(data.username);
          setPassword(data.password);
          setConfirmPassword(data.confirmPassword)
          setTel(data.tel);
          setEmail(data.email);
          setName(data.name);
          setNameTitle(data.nametitle);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
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
      fetchData();
    }, [id]);
   
    const UpdateMP = async () => {

      try {
        const MPUpdate = {
            username,
            password,
            confirmPassword,
            email,
            tel,
            name,
            nametitle,
        };
        const response = await fetch(
       `http://localhost:5000/updatemp/${id}`,          
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
            },
            body: JSON.stringify(MPUpdate),
          }
        );
        if (response.ok) {
          const UpdatedMP = await response.json();
          console.log("แก้ไขคู่มือแล้ว:", UpdatedMP);
          toast.success("แก้ไขข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate("/allmpersonnel");
          }, 1100);
        } else {
          console.error("แก้ไขไม่ได้:", response.statusText);
        }
      } catch (error) {
        console.error("การแก้ไขมีปัญหา:", error);
      }
    };


  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleBreadcrumbClick = () => {
    navigate("/allequipment");
  };

  return (
    <main className="body">
            <ToastContainer />
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name">
              <img src={logow} className="logow" alt="logo"></img>
            </div>
          </div>
          <i class="bi bi-list" id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul class="nav-list">
          <li>
            <a href="home">
              <i class="bi bi-book"></i>
              <span class="links_name">จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i class="bi bi-person-plus"></i>
              <span class="links_name">จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i class="bi bi-people"></i>
              <span class="links_name">จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i class="bi bi-prescription2"></i>
              <span class="links_name">จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name">จัดการแอดมิน</span>
            </a>
          </li>
          <div class="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i
                  class="bi bi-box-arrow-right"
                  id="log_out"
                  onClick={logOut}
                ></i>
                <span class="links_name">ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="header">จัดการข้อมูลบุคลากร</div>
        <div class="profile_details ">
          <li>
            <a href="profile">
              <i class="bi bi-person"></i>
              <span class="links_name">{adminData && adminData.username}</span>
            </a>
          </li>
        </div>
        <hr></hr>
        <div className="breadcrumbs">
          <ul>
            <li>
              <a href="home">
                <i class="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a href="allmpersonnel">จัดการข้อมูลบุคลากร</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลบุคลากร</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขข้อมูลบุคลากร</h3>
        <div className="adminall card mb-1">
          <div className="mb-1">
            <label>เลขที่ใบประกอบวิชาชีพ</label>
            <input
              type="text"
              value={username}
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {/* <div className="mb-3">
              <label>รหัสผ่าน</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div> */}
            <div className="mb-3">
              <label>อีเมล</label>
              <input
              value={email}
                type="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>เบอร์โทรศัพท์</label>
              <input
              value={tel}
                type="text"
                className="form-control"
                onChange={(e) => setTel(e.target.value)}
              />
            </div>
          <div className="mb-1">
            <label>คำนำหน้าชื่อ</label>
            <select
              className="form-control"
              value={nametitle}
              onChange={(e) => setNameTitle(e.target.value)}
            >
              <option value="">กรุณาเลือก</option>
              <option value="แพทย์หญิง">แพทย์หญิง</option>
                <option value="นายแพทย์">นายแพทย์</option>
            </select>
          </div>
          <div className="mb-3">
              <label>ชื่อ - นามสกุล</label>
              <input
                type="text"
                value={name}
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          <div className="d-grid">
            <button
              onClick={UpdateMP}
              type="submit"
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>

      <div></div>
    </main>
  );
}

