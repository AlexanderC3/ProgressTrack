import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSession } from "../firebase/UserProvider";
import { logout } from "../firebase/auth";

const Navbar = () => {
  const { user } = useSession();
  const history = useHistory();

  var dashboardRef = "";

  if (!!user) {
    dashboardRef = `/dashboard`;
  }

  const logoutUser = async () => {
    await logout();
    history.push("/login");
  };

  return (
    <div
      style={{
        width: "100%",
        position: "sticky",
        top: "0",
        zIndex: "40",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "auto",
          position: "absolute",
          top: "0",
          background: "rgb(34 34 32)",
          boxShadow: "0 5px 10px rgb(255 255 255 / 10%)",
        }}
      >
        <nav
          className="navbar navbar-expand-lg navbar-mainbg"
          style={{
            width: "85%",
            margin: "auto",
          }}
        >
          <a
            className="navbar-logo"
            style={{ pointerEvents: "initial", textDecoration: "none" }}
            href={dashboardRef}
          >
            TrackYourProgress
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i
              className="fas fa-bars text-white"
              style={{ fontSize: "1.3em" }}
            ></i>
          </button>

          {!user && (
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active" style={{ display: "contents" }}>
                  <NavLink
                    className="nav-link"
                    to="/login"
                    exact
                    style={{ marginRight: "1.5em" }}
                  >
                    <i className="far fa-user-circle"></i> Login
                  </NavLink>
                  <NavLink className="nav-link" to="/signup" exact>
                    <i className="fas fa-user-plus"></i> Signup
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
          {!!user && (
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active" style={{ display: "contents" }}>
                  <NavLink
                    className="nav-link"
                    to="/profile"
                    exact
                    style={{ marginRight: "1.5em" }}
                  >
                    <i className="fas fa-user-circle"></i> Welcome{" "}
                    {user.displayName}
                  </NavLink>
                  <NavLink
                    className="nav-link"
                    onClick={logoutUser}
                    to="/login"
                    exact
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};
export default Navbar;
