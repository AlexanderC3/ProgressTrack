import React from "react";
import { NavLink, Link } from "react-router-dom";

//Deze module behandelt ieder menu-item van de sidebar, er wordt een list-item aangemaakt met behulp van de properties die meegegeven werden in de SideMenu module.

const MenuItem = (props) => {
  const { name, subMenus, iconClassName, to } = props;

  return (
    <li onClick={props.onClick}>
      <Link to={to} className={`menu-item`}>
        <div className="menu-icon">
          <i className={iconClassName}></i>
        </div>
        <span>{name}</span>
      </Link>
      {/* Als er submenus zijn en de lengte van submenus is groter dan 1 wordt er een extra <ul> aangemaakt waarin er geloopt wordt over de submenus (map functie) */}
      {subMenus && subMenus.length > 0 ? (
        <ul className={`sub-menu`}>
          {subMenus.map((menu, index) => (
            <li key={index}>
              <NavLink to={menu.to}>{menu.name}</NavLink>
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </li>
  );
};

export default MenuItem;
