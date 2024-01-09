import React from "react";

export default function Profile({ profile }) {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          {/* Name<h1>{profile.username}</h1>
          Email <h1>{profile.password}</h1> */}
          <br />
          <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}