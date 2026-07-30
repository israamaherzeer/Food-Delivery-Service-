import React from 'react';
import style from './DriverTopBar.module.css'; 
import axios from 'axios';
import {  NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

interface DriverTopBarProps {
  userRole: 'customer' | 'restaurant' | 'driver'; 
}

const DriverTopBar: React.FC<DriverTopBarProps> = ({ userRole }) => {
   const navigate = useNavigate();
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
          onClick={() => navigate("/driver/incoming-orders")}
          className={style.logContainer}
        >
          <img src="../../assets/logo3.png" alt="logo" className={style.logo} />
          <span className={style.dashboardText}>
            {" "}
            {"  "} Delivery Driver Dashboard
          </span>
        </div>

        <div className={style.topbarActions}>
          {userRole === "driver" && (
            <NavLink
              to="/driver/incoming-orders"
              className={({ isActive }) =>
                `${style.storeIcon} ${isActive ? style.activeLink : ""}`
              }
            >
              <i>
                <FontAwesomeIcon icon={faBoxOpen} />
              </i>
            </NavLink>
          )}
          <NavLink
            to="/driverProfile"
            className={({ isActive }) =>
              `${style.userIcon} ${isActive ? style.activeLink : ""}`
            }
          >
            <svg
              width="24"
              height="24"
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
              width="24"
              height="24"
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

export default DriverTopBar;