import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import deleteimg from "../img/delete.png";
import editimg from "../img/edit.png";

export default function Home({ }) {
  
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");

  useEffect(() => {
    getAllCaremanual();
}, []);

  const add = () => {
    window.location.href = "./addcaremanual";
  };
  useEffect(() => {
    const token = window.localStorage.getItem("token");
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
    }
  }, []); //ส่งไปครั้งเดียว



  const getAllCaremanual = () => {
    fetch("http://localhost:5000/allcaremanual", {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.data);
      })
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  const deleteCaremanual = async (id, caremanual_name) => {
    if (window.confirm(`คุณต้องการลบ ${caremanual_name} หรือไม่ ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteCaremanual/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          getAllCaremanual();
        } else {
          console.error('Error during deletion:', data.data);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };



  const [navCollpase, setNavCollapse] = useState(false);
  return (
    <div className="bartop">
      <div>
        <li onClick={() => navigate("/profile")}>{adminData && adminData.username}</li>
        <p onClick={() => navigate("/home")}>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</p>
        <p onClick={() => navigate("/allmpersonnel")}>จัดการข้อมูลบุคลากร</p>
        <p onClick={() => navigate("/allequip", { state: adminData })}>จัดการอุปกรณ์ทางการแพทย์</p>
        <p onClick={() => navigate("/alladmin")}>จัดการแอดมิน</p>
        <p onClick={logOut}>ออกจากระบบ</p>
        <h3>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</h3>
        <span></span>
        <button onClick={() => navigate("/addcaremanual")} className="add btn btn-outline-secondary py-1 px-4">
          เพิ่มคู่มือ
        </button>
        <p className="countadmin">จำนวน : {data.length} คู่มือ</p>

        { data == null
        ? ""
        : data.map((i) => {
        return (
          <div class="adminall card mb-3 ">
            <div class="card-body">
              <h5 class="card-title">{i.caremanual_name}</h5>
              <img src={editimg} className="editimg" alt="deleteimg" onClick={() => navigate("/updatecaremanual", { state: { id: i._id, caremanual: i } })}></img>
              <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteCaremanual(i._id, i.caremanual_name)}></img>
            </div>
          </div>
        );
      })}


      </div>
    </div>
  );
}
