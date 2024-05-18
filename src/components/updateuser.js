import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateUser() {
    const location = useLocation();
    const { id, user } = location.state;
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tel, setTel] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");
    const [ID_card_number, setIDCardNumber] = useState("");
    const [nationality, setNationality] = useState("");
    const [Address, setAddress] = useState("");
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

      const formatDate = (date) => {
        const formattedDate = new Date(date);
        // ตรวจสอบว่า date เป็น NaN หรือไม่
        if (isNaN(formattedDate.getTime())) {
            return ""; // ถ้าเป็น NaN ให้ส่งค่าว่างกลับไป
        }
        return formattedDate.toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(
              `http://localhost:5000/getuser/${id}`
            );
            const data = await response.json();
            setUsername(data.username);
            setName(data.name);
            setEmail(data.email);
            setPassword(data.password);
            setTel(data.tel);
            setGender(data.gender);
            setBirthday(data.birthday);
            setIDCardNumber(data.ID_card_number);
            setNationality(data.nationality);
            setAddress(data.Address);
          } catch (error) {
            console.error("Error fetching caremanual data:", error);
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

    
const UpdateUser = async () => {
    try {
      const userData = {
        username,
        name,
        email,
        password,
        tel,
        gender,
        birthday,
        ID_card_number,
        nationality,
        Address,
      };
  
      const response = await fetch(`http://localhost:5000/updateuser/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        console.log("แก้ไขผู้ใช้แล้ว:", updatedUser);
        // window.location.href = "./alluser";
        toast.success("แก้ไขข้อมูลสำเร็จ");
        setTimeout(() => {
          // navigate("/allinfo");
          navigate("/allinfo", { state: { id: id, user: user } });

        },1100); 
      } else {
        toast.error("ไม่สามารถแก้ไขผู้ใช้ได้:", response.statusText);
        // setTimeout(() => {
        //   navigate("/alluser");
        // },1100); 
        // console.error("ไม่สามารถแก้ไขผู้ใช้ได้:", response.statusText);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้:", error);
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
    navigate("/allinfo", { state: { id: id, user: user } });
  };

  return (
    <main className="body">
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
              <span class="links_name" >จัดการข้อมูลคู่มือการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alluser">
              <i class="bi bi-person-plus"></i>
              <span class="links_name" >จัดการข้อมูลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="allmpersonnel">
              <i class="bi bi-people"></i>
              <span class="links_name" >จัดการข้อมูลบุคลากร</span>
            </a>
          </li>
          <li>
            <a href="allequip">
              <i class="bi bi-prescription2"></i>
              <span class="links_name" >จัดการอุปกรณ์ทางการแพทย์</span>
            </a>
          </li>
          <li>
            <a href="allsymptom" onClick={() => navigate("/allsymptom")}>
              <i class="bi bi-bandaid"></i>
              <span class="links_name" >จัดการอาการผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="alladmin" onClick={() => navigate("/alladmin")}>
              <i class="bi bi-person-gear"></i>
              <span class="links_name" >จัดการแอดมิน</span>
            </a>
          </li>
          <div class="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span class="links_name" >ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="header">จัดการข้อมูลผู้ป่วย</div>
        <div class="profile_details ">
          <li>
            <a href="profile" >
              <i class="bi bi-person"></i>
              <span class="links_name" >{adminData && adminData.username}</span>
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
            <li><a href="alluser">จัดการข้อมูลผู้ป่วย</a>
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
               <a onClick={handleBreadcrumbClick} className="info">ข้อมูลการดูแลผู้ป่วย</a>
              {/* <a href="allinfo">ข้อมูลการดูแลผู้ป่วย</a> */}
            </li>
            <li className="arrow">
              <i class="bi bi-chevron-double-right"></i>
            </li>
            <li>
              <a>แก้ไขข้อมูลผู้ป่วย</a>
            </li>
          </ul>
        </div>
        <h3>แก้ไขข้อมูลผู้ป่วย</h3>
        <div className="adminall card mb-3">
          <div className="mb-3">
            <label>ชื่อผู้ใช้</label>
            <input
              type="text"
              readOnly
              className="form-control gray-background"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>อีเมล</label>
            <input
              type="text"
              value={email}
              readOnly
              className="form-control gray-background"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* <div className="mb-3">
              <label>รหัสผ่าน</label>
              <input
                type="password"
                readOnly
                className="form-control gray-background"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}
            <div className="mb-3">
              <label>ชื่อ-นามสกุล</label>
              <input
              value={name}
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>เพศ</label>
              <select
              value={gender}
                id="gender"
                className="form-select"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">โปรดเลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่นๆ">อื่น ๆ</option>
              </select>
            </div>
            <div className="mb-3">
              <label>วันเกิด</label>
              <input
                value={formatDate(birthday)}                    
                type="date"
                className="form-control"
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>เลขประจำตัวบัตรประชาชน</label>
              <input
              value={ID_card_number}
                type="text"
                className="form-control"
                onChange={(e) => setIDCardNumber(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>สัญชาติ</label>
              <input
              value={nationality}
                type="text"
                className="form-control"
                onChange={(e) => setNationality(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>ที่อยู่</label>
              <input
              value={Address}
                type="text"
                className="form-control"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-3">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={tel}
              className="form-control"
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button
              onClick={UpdateUser}
              // onClick={() => UpdateUser(id)}
              className="btn btn-outline py-2"
            >
              บันทึก
            </button>
            <br />
          </div>
        </div>
      </div>
      <div></div>
    </main>
  );
}