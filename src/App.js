import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";


import Login from "./components/login";
import Home from "./components/home";
import Detail from "./components/detail";
import Profile from "./components/profile";
import Alladmin from "./components/alladmin";
import AddAdmin from "./components/addadmin";

const PrivateRoute = ({ element, isLoggedIn }) => {
  return isLoggedIn === "true" ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: window.location.pathname }} />
  );
};

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  // const addDoc = window.localStorage.getItem("addDoc");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn === "true" ? <Detail/> : <Login />}/>
           {/* <Route 
              path="/home" 
              element={<PrivateRoute element={<Home />} isLoggedIn={isLoggedIn} />}
           />  */}
            {/* <Route
              path="/detail"
              element={<PrivateRoute element={<Detail />} isLoggedIn={isLoggedIn} />}
            /> */}

            {/* -------------------- */}
            <Route path="/home" element={<Home />} />    
            <Route path="/detail" element={<Detail />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/alladmin" element={<Alladmin />} />
            <Route path="/addadmin" element={<AddAdmin />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;