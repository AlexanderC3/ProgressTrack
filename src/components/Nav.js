import React from "react";
import "../App.css";
import { useSession } from "../firebase/UserProvider";
import { logout } from "../firebase/auth";

function Nav() {
  const { user } = useSession();
  var profileRef = "";
  var dashboardRef = "";

  if (!!user) {
    profileRef = `/profile`;
    dashboardRef = `/dashboard`;
  }

  const logoutUser = async () => {
    await logout();
  };

  return (
    <div id="upperNav">
      <nav
        className="navbar navbar-shrink navbar-expand-lg navbar-light fixed-top"
        id="mainNav"
      >
        {!user && (
          <div className="container">
            <a className="navbar-brand js-scroll-trigger" href="#page-top">
              <span className="logo">TrackYourProgress</span>
            </a>
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              Menu
              <i className="fas fa-bars"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link js-scroll-trigger" href="/login">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link js-scroll-trigger" href="/signup">
                    Signup
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {!!user && (
          <div className="navBar">
            <a className="nav_logo_ref" href={dashboardRef}>
              <div className="nav_logo">TrackYourProgress</div>
            </a>
            <div className={"nav_buttons"}>
              <div>
                <a href={profileRef.toString()} className="user-button">
                  <button
                    className="ui primary button nav-button"
                    style={{ marginRight: "2em" }}
                  >
                    Welcome {user.displayName}
                  </button>
                </a>
              </div>
              <div>
                <a href="/login">
                  <button
                    className="ui primary button nav-button"
                    onClick={logoutUser}
                  >
                    Logout
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Nav;
