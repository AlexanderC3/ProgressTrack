import React from "react";
import { useState } from "react";
import SideMenu from "../components/SideMenu";

const MainLayout = (props) => {
  const [inactive, setInactive] = useState(false);

  return (
    <div className="dashboardLayout">
      <div className="controlPanel">
        <div className="sidebar">
          <SideMenu
            onCollapse={(inactive) => {
              setInactive(inactive);
            }}
          />
        </div>
        <div className={`container ${inactive ? "inactive" : ""}`}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
