import React, { useEffect, useState } from "react";
import logo from "../components/Images/apple-touch-icon.png";
import { isMobile } from "react-device-detect";
import MenuItem from "./MenuItem";

//per menu-item wordt een object toegevoegd in deze JSON: naam, to (url), icon en eventuele subitems in subMenus.
export const menuItems = [
  {
    name: "Dashboard",
    to: `/dashboard`,
    iconClassName: "fas fa-tachometer-alt",
  },
  {
    name: "Exercises",
    to: "/exercises",
    iconClassName: "fas fa-dumbbell",
    subMenus: [
      { name: "Abs", to: "/exercises/abs" },
      { name: "Arms", to: "/exercises/arms" },
      { name: "Back", to: "/exercises/back" },
      { name: "Chest", to: "/exercises/chest" },
      { name: "Legs", to: "/exercises/legs" },
      { name: "Shoulders", to: "/exercises/shoulders" },
    ],
  },
  {
    name: "Workouts",
    to: `/workouts`,
    iconClassName: "fas fa-fire-alt",
  },
  {
    name: "Overview",
    to: `/overview`,
    iconClassName: "fas fa-tasks",
  },
];

const SideMenu = (props) => {
  //isMobile --> wanneer de website bekeken wordt op een mobiel scherm zal de sidebar bij default ingeklapt zijn.
  const [inactive, setInactive] = useState(isMobile);

  useEffect(() => {
    if (inactive) {
      //submenus worden ingeklapt.
      removeActiveClassFromSubMenu();
    }

    if (!inactive) {
      document.querySelectorAll(".sub-menu").forEach((el) => {
        el.classList.add("active");
      });
    }

    props.onCollapse(inactive);
  }, [inactive, props]);

  const removeActiveClassFromSubMenu = () => {
    document.querySelectorAll(".sub-menu").forEach((el) => {
      el.classList.remove("active");
    });
  };

  useEffect(() => {
    let menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((el) => {
      el.addEventListener("click", (e) => {
        const next = el.nextElementSibling;
        removeActiveClassFromSubMenu();
        menuItems.forEach((el) => el.classList.remove("active"));
        el.classList.toggle("active");
        if (next !== null) {
          next.classList.toggle("active");
        }
      });
    });
  }, []);

  return (
    <div className={`side-menu ${inactive ? "inactive" : ""}`}>
      <div className="top-section">
        <div className="logo">
          <img src={logo} alt="webscript" />
        </div>
        <div onClick={() => setInactive(!inactive)} className="toggle-menu-btn">
          {inactive ? (
            <i className="bi bi-arrow-right-square-fill"></i>
          ) : (
            <i className="bi bi-arrow-left-square-fill"></i>
          )}
        </div>
      </div>

      <div className="search-controller">
        <button className="search-btn">
          <i className="bi bi-search"></i>
        </button>

        <input type="text" placeholder="search" />
      </div>

      <div className="divider"></div>

      <div className="main-menu">
        <ul>
          {menuItems.map((menuItem, index) => (
            <MenuItem
              key={index}
              name={menuItem.name}
              exact={menuItem.exact}
              to={menuItem.to}
              subMenus={menuItem.subMenus || []}
              iconClassName={menuItem.iconClassName}
              onClick={(e) => {
                if (inactive) {
                  setInactive(false);
                }
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
