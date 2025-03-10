import React, { Component } from "react";
import "../css/styles.css";
import logo from "../img/logo.png";
import "../css/alladmin.css";

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
    this.hanleSubmit = this.hanleSubmit.bind(this);
  }
  hanleSubmit(e) {
    e.preventDefault();
    const { email } = this.state;
    console.log("Email submitted: ", email); 
    console.log(email);
    fetch("https://backend-deploy-render-mxok.onrender.com/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Response from server: ", data); 
      if (data.status === "User Not Exists!!") {
        alert(data.status); 
      } else if (data.status === "check your emailbox") {
        console.log("Email sent successfully"); 
        alert("เช็คอีเมลของคุณเพื่อรีเซ็ทรหัสผ่าน"); 
        this.setState({ email: "" }, () => {
          // ล้างค่า email หลังจากที่ตั้งค่า state แล้ว
          console.log("Email field cleared"); // ดูใน console ว่าค่าถูกรีเซ็ตหรือไม่
        });      }
    })
    .catch((error) => {
      console.error("Error:", error); 
      alert("เกิดข้อผิดพลาดในการส่งคำขอ");
    });
}


  render() {
    return (
        <div className="homereset_content">
              <div className="logoreset">
          <img src={logo} className="logoreset" alt="logo"></img>
        </div>
        {/* <div className="header1">ลืมรหัสผ่าน</div> */}
        <div className="formcontainerpf card mb-3">
      

        <form onSubmit={this.hanleSubmit}>
        <div className="header1">ลืมรหัสผ่าน</div>
        <div className="header2">กรุณากรอกอีเมลรับลิงก์เปลี่ยนรหัสผ่าน</div>
          <div className="mb-3">
            {/* <label>กรอกอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน</label> */}
            <input
              type="email"
              className="form-control"
              placeholder="อีเมล"
              value={this.state.email} 
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-outline py-2">
            รีเซ็ทรหัสผ่าน
            </button>
            <br />
          </div>
        </form>
      </div>
      </div>
    );
  }
}
