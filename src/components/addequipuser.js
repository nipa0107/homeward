import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddEquip({ }) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [validationMessage, setValidationMessage] = useState("");
    const [adminData, setAdminData] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [token, setToken] = useState('');
    const [selectedEquipType1, setSelectedEquipType1] = useState("");
    const [selectedEquipType2, setSelectedEquipType2] = useState("");
    const [selectedEquipType3, setSelectedEquipType3] = useState("");
    const { state } = useLocation();
    const lastAddedUser = state && state.lastAddedUser;

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
                    console.log(data)
                    setAdminData(data.data);
                });
        } getAllEquip();
        if (lastAddedUser) {
            // Display toast notification if lastAddedUser exists
            toast.success(`Last added user: ${lastAddedUser}`);
        }
    }, [lastAddedUser]);//ส่งไปครั้งเดียว

    const getAllEquip = () => {
        fetch("http://localhost:5000/allequip", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "AllEquip");
                setData(data.data);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedEquipments = [];

    // ตรวจสอบและเพิ่มข้อมูลอุปกรณ์ที่ผู้ใช้เลือกเข้าในอาร์เรย์ selectedEquipments
    if (selectedEquipType1) {
        selectedEquipments.push({
            equipmentname_forUser: selectedEquipType1,
            equipmenttype_forUser: "อุปกรณ์ติดตัว"
        });
    }
    if (selectedEquipType2) {
        selectedEquipments.push({
            equipmentname_forUser: selectedEquipType2,
            equipmenttype_forUser: "อุปกรณ์เสริม"
        });
    }
    if (selectedEquipType3) {
        selectedEquipments.push({
            equipmentname_forUser: selectedEquipType3,
            equipmenttype_forUser: "อุปกรณ์อื่นๆ"
        });
    }

    // ตรวจสอบว่าผู้ใช้เลือกอุปกรณ์หรือไม่
    if (selectedEquipments.length === 0) {
        console.log("Please select at least one equipment");
        setValidationMessage("โปรดเลือกอุปกรณ์อย่างน้อยหนึ่งรายการ");
        return;
    }
    selectedEquipments.forEach((equipment) => {
        fetch("http://localhost:5000/addequipuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                equipmentname_forUser: equipment.equipmentname_forUser,
                equipmenttype_forUser: equipment.equipmenttype_forUser,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.status === "ok") {
                    toast.success("เพิ่มข้อมูลสำเร็จ");
                    setTimeout(() => {
                        navigate("/alluser");
                    }, 1100);
                }
            });
        });
    };

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "./";
    };
    // bi-list
    const handleToggleSidebar = () => {
        setIsActive(!isActive);
    };

    return (
        <main className="body">
            <div className={`sidebar ${isActive ? 'active' : ''}`}>
                <div class="logo_content">
                    <div class="logo">
                        <div class="logo_name" >
                            <img src={logow} className="logow" alt="logo" ></img>
                        </div>
                    </div>
                    <i class='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
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
                                <i className="bi bi-house-fill"></i>
                            </a>
                        </li>
                        <li className="arrow">
                            <i className="bi bi-chevron-double-right"></i>
                        </li>
                        <li>
                            <a href="alluser">จัดการข้อมูลผู้ป่วย</a>
                        </li>
                        <li className="arrow">
                            <i className="bi bi-chevron-double-right"></i>
                        </li>
                        <li>
                            <a href="adduser">เพิ่มข้อมูลผู้ป่วยทั่วไป</a>
                        </li>
                        <li className="arrow">
                            <i className="bi bi-chevron-double-right"></i>
                        </li>
                        <li>
                            <a href="addmdinformation">เพิ่มข้อมูลการเจ็บป่วย</a>
                        </li>
                        <li className="arrow">
                            <i className="bi bi-chevron-double-right"></i>
                        </li>
                        <li>
                            <a>เพิ่มอุปกรณ์สำหรับผู้ป่วย</a>
                        </li>
                    </ul>
                </div>
                <h3>เพิ่มอุปกรณ์สำหรับผู้ป่วย</h3>
                <div className="adminall card mb-3">
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label>อุปกรณ์ติดตัว</label>
                            <select
                                className="form-select"
                                value={selectedEquipType1}
                                onChange={(e) => setSelectedEquipType1(e.target.value)}
                            >
                                {/* ตรวจสอบว่าข้อมูลอุปกรณ์ติดตัวมีข้อมูลหรือไม่ก่อนที่จะแสดงผล */}
                                <option value="" >
                                    เลือกอุปกรณ์ติดตัว
                                </option>
                                {data.length > 0 ? (
                                    data
                                        .filter((equipment) => equipment.equipment_type === "อุปกรณ์ติดตัว")
                                        .map((equipment) => (
                                            <option key={equipment._id} value={equipment.equipment_name}>
                                                {equipment.equipment_name}
                                            </option>
                                        ))
                                ) : (
                                    <option value="">ไม่มีข้อมูลอุปกรณ์ติดตัว</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>อุปกรณ์เสริม</label>
                            <select
                                className="form-select"
                                value={selectedEquipType2}
                                onChange={(e) => setSelectedEquipType2(e.target.value)}
                            >
                                {/* ตรวจสอบว่าข้อมูลอุปกรณ์เสริมมีข้อมูลหรือไม่ก่อนที่จะแสดงผล */}
                                <option value="" >
                                    เลือกอุปกรณ์เสริม
                                </option>
                                {data.length > 0 ? (
                                    data
                                        .filter((equipment) => equipment.equipment_type === "อุปกรณ์เสริม")
                                        .map((equipment) => (
                                            <option key={equipment._id} value={equipment.equipment_name}>
                                                {equipment.equipment_name}
                                            </option>
                                        ))
                                ) : (
                                    <option value="">ไม่มีข้อมูลอุปกรณ์เสริม</option>
                                )}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>อุปกรณ์อื่นๆ</label>
                            <select
                                className="form-select"
                                value={selectedEquipType3}
                                onChange={(e) => setSelectedEquipType3(e.target.value)}
                            >
                                {/* ตรวจสอบว่าข้อมูลอุปกรณ์อื่นๆ มีข้อมูลหรือไม่ก่อนที่จะแสดงผล */}
                                <option value="" >
                                    เลือกอุปกรณ์อื่นๆ
                                </option>
                                {data.length > 0 ? (
                                    data
                                        .filter((equipment) => equipment.equipment_type === "อุปกรณ์อื่นๆ")
                                        .map((equipment) => (
                                            <option key={equipment._id} value={equipment.equipment_name}>
                                                {equipment.equipment_name}
                                            </option>
                                        ))
                                ) : (
                                    <option value=""> ไม่มีข้อมูลอุปกรณ์อื่นๆ</option>
                                )}
                            </select>
                        </div>
                        {validationMessage && (
                            <div style={{ color: "red" }}>{validationMessage}</div>
                        )}
                        <div className="d-grid">
                            <button type="submit" className="btn btn-outline py-2">
                                บันทึก
                            </button>
                            <br />
                        </div>
                    </form>
                </div>
                <div className="btn-group">
                    <div className="btn-pre">
                        <button
                            onClick={() => navigate("/addmdinformation")}
                            className="btn btn-outline py-2"
                        >
                            ก่อนหน้า
                        </button>
                    </div>
                    {/* <div className="btn-next">
            <button
              onClick={() => navigate("/addequipment")}
              className="btn btn-outline py-2"
            >
              ถัดไป
            </button>
          </div> */}
                </div>
            </div>
        </main>
    );
}
