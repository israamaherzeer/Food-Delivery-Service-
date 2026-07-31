import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import style from './DashboardTopBar.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";


interface DashboardTopBarProps {
  userRole: 'customer' | 'restaurant' | 'driver'; // Assuming userRole is passed
}

const DashboardTopBar: React.FC<DashboardTopBarProps> = ({ userRole }) => {
  // const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const navigate = useNavigate();

  // const toggleSettingsMenu = () => {
  //   setShowSettingsMenu(prev => !prev);
  // };
  const handleLogout = async () => {
    await axios.post(
      "https://food-delivery-service-production.up.railway.app/users/logout",

      {
        withCredentials: true,
      }
    );

    navigate("/");
  };

  return (
    <header className={style.topbar}>
      <div className={style.topbarContainer}>
        <div
          onClick={() => navigate("/restaurant/dashboard")}
          className={style.logContainer}
        >
          <img src="/logo3.png" alt="logo" className={style.logo} />
          <span className={style.dashboardText}>
            {" "}
            {"  "}Restaurant Dashboard
          </span>
        </div>

        <div className={style.topbarActions}>
          {/* Store Icon (Red, filled) */}
          {userRole === "restaurant" && (
            <NavLink
              to="/restaurant/dashboard"
              className={({ isActive }) =>
                `${style.storeIcon} ${isActive ? style.activeLink : ""}`
              }
            >
              <i>
                <FontAwesomeIcon icon={faBoxOpen} />
              </i>
            </NavLink>
          )}
          {/* {showSettingsMenu && (
            <div className={style.settingsDropdown}>
              <NavLink
                to="/restaurant/menu-management"
                className={({ isActive }) =>
                  `${style.dropdownItem} ${isActive ? style.activeLink : ""}`
                }
              >
                Menu Management
              </NavLink>
              <NavLink
                to="/restaurant/reviews"
                className={({ isActive }) =>
                  `${style.dropdownItem} ${isActive ? style.activeLink : ""}`
                }
              >
                Reviews
              </NavLink>
            </div>
          )} */}

          {/* <div className={style.settingsIcon} onClick={toggleSettingsMenu}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div> */}

          <NavLink
  to="/restaurant/profile"
  className={({ isActive }) =>
    `${style.userIcon} ${isActive ? style.activeLink : ''}`
  }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            
</NavLink>
       
          <div className="menu-icon" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;