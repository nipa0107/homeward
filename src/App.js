import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
import {BrowserRouter as Router, Routes, Route, Navigate,} from "react-router-dom";

import Login from "./components/login";
import Home from "./components/home";
import Profile from "./components/profile";
import Updateadmin from "./components/updateadmin";
import Alladmin from "./components/alladmin";
import AddAdmin from "./components/addadmin";
import AddEquip from "./components/addequipment";
import AllEquip from "./components/allequipment";
import AllMpersonnel from "./components/allmpersonnel";
import AddMpersonnel from "./components/addmpersonnel";
import AddCaremanual from "./components/addcaremanual";
import Reset from "./components/forgetpassword";
import UpdateCareManual from "./components/updatecaremanual";


const PrivateRoute = ({ element, isLoggedIn }) => {
  return isLoggedIn === "true" ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: window.location.pathname }} />
  );
};

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn === "true" ? <Home /> : <Login />}
          />

         <Route
            path="/home"
            element={
              <PrivateRoute element={<Home />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/alladmin"
            element={
              <PrivateRoute element={<Alladmin />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/addadmin"
            element={
              <PrivateRoute element={<AddAdmin />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/updateadmin"
            element={
              <PrivateRoute element={<Updateadmin />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute element={<Profile />} isLoggedIn={isLoggedIn} />
            }
          />

          <Route
            path="/allequip"
            element={
              <PrivateRoute element={<AllEquip />} isLoggedIn={isLoggedIn} />
            }
          />

          <Route
            path="/addequip"
            element={
              <PrivateRoute element={<AddEquip />} isLoggedIn={isLoggedIn} />
            }
          />

          <Route
            path="/allmpersonnel"
            element={
              <PrivateRoute element={<AllMpersonnel />} isLoggedIn={isLoggedIn} />
            }
          />

          <Route
            path="/addmpersonnel"
            element={
              <PrivateRoute element={<AddMpersonnel />} isLoggedIn={isLoggedIn} />
            }
          />

          <Route
            path="/addcaremanual"
            element={
              <PrivateRoute element={<AddCaremanual />} isLoggedIn={isLoggedIn} />
            }
          />

          <Route
            path="/updatecaremanual"
            element={
            <PrivateRoute element={<UpdateCareManual />} isLoggedIn={isLoggedIn} />
            }
          />

          <Route path="/forgetpassword" element={<Reset />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
