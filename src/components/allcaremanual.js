import React, {useEffect, useState } from "react";
import "../css/alladmin.css"

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
            </div>
          </div>
        );
      })}


      </div>
    );

}


