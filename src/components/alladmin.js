import React, {useEffect, useState } from "react";
import deleteimg from "../img/delete.png";
import "../css/alladmin.css"


export default function Alladmin({}) {
  const [data, setData] = useState([]);
  // const [adminId, setAdminId] = useState('');

  useEffect(() => {
    getAllUser();
  }, []);
  
  const getAllUser = () => {
    fetch("http://localhost:5000/alladmin", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllAdmin");
        setData(data.data);
      });
  };

  const deleteAdmin = async (id, username) => {
    if (window.confirm(`Are you sure you want to delete ${username}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/deleteAdmin/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.data);
          // Refresh or update the admin list
        } else {
          console.error('Error during deletion:', data.data);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };

  const home = () => {
    window.location.href = "./home";
  };
  const add = () => {
    window.location.href = "./addadmin";
  };

  

  
 
  return (
    <div>
      <button onClick={home} className="btn">
        home
      </button> <br/>
      <span></span>
      <button onClick={add} className="add btn btn-outline-secondary py-1 px-4">
        เพิ่มแอดมิน
      </button>
      <p className="countadmin">จำนวน : {data.length} คน</p>
      {data.map((i) => {
        return (
          <div class="adminall card mb-3 ">
            <div class="card-body">
            {/* <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={deleteadmin}></img> */}
              <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteAdmin(i._id, i.username)}></img>
              <h5 class="card-title">{i.username}</h5>
            </div>
          </div>
        );
      })}
    </div>
  );
}
