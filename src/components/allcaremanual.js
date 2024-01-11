import React, {useEffect, useState } from "react";
import "../css/alladmin.css"
import deleteimg from "../img/delete.png";

export default function AllCaremanual({}) {
    const [data, setData] = useState([]);
    // const [allImage, setAllImage] = useState(null);

    useEffect(() => {
        getAllCaremanual();
    }, []);
    
    const getAllCaremanual = () => {
        fetch("http://localhost:5000/allcaremanual",{
            method:"GET"
        })
        .then((res) => res.json())
        .then((data) => {
        console.log(data);
        setData(data.data);
    })
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
  
  
  
    const home = () => {
      window.location.href = "./home";
    };
    const add = () => {
      window.location.href = "./addcaremanual";
    };
  
   
    return (
      <div>
          <h3>จัดการข้อมูลคู่มือการดูแลผู้ป่วย</h3>
        <button onClick={home} className="btn">
          home
        </button> <br/>
        <span></span>
        <button onClick={add} className="add btn btn-outline-secondary py-1 px-4">
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
              <img src={deleteimg} className="deleteimg" alt="deleteimg" onClick={() => deleteAdmin(i._id, i.username)}></img>
            </div>
          </div>
        );
      })}


      </div>
    );

}


