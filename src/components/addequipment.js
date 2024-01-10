import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AddEquip({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [equipment_name, setEquipName] = useState("");
  const [equipment_type, setEquipType] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  useEffect(() => {
    console.log(location);
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equipment_name.trim() || !equipment_type) {
      console.log("Please fill in all fields");
      setValidationMessage("ชื่ออุปกรณ์และประเภทอุปกรณ์ไม่ควรเป็นค่าว่าง");
      return;
    }

    fetch("http://localhost:5000/addequip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        equipment_name,
        equipment_type,
        adminId: location.state._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          window.location.href = "./allequip";
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>เพิ่มอุปกรณ์</h3>

          <div className="mb-3">
            <label>ชื่ออุปกรณ์</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setEquipName(e.target.value)}
            />
          </div>
          {/* {validationMessage && (
            <div style={{ color: "red" }}>{validationMessage}</div>
          )} */}
          <div className="mb-3">
            <label>ประเภทอุปกรณ์</label>
            <select
              className="form-control"
              onChange={(e) => setEquipType(e.target.value)}
            >
              <option value="">กรุณาเลือก</option>
              <option value="อุปกรณ์ติดตัว">อุปกรณ์ติดตัว</option>
              <option value="อุปกรณ์เสริม">อุปกรณ์เสริม</option>
              <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่น ๆ</option>
            </select>
          </div>
          {validationMessage && (
            <div style={{ color: "red" }}>{validationMessage}</div>
          )}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
            <br />
          </div>
        </form>
      </div>
    </div>
  );
}
