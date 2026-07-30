import React from "react";
import "./TopBar.css";
import { useCartContext } from "../../src/cartcontext";
import { useNavigate, useLocation } from "react-router-dom";


interface TopBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const TopBar = ({ searchTerm, setSearchTerm }: TopBarProps) => {
  const { totalCount, toggleCart } = useCartContext();
  const navigate = useNavigate();
const location = useLocation();

const showSearch = location.pathname === "/home";

  const toggleSearch = () => {
  };

  const handleLogout = async () => {
    await fetch("https://food-delivery-service-production.up.railway.app/users/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  return (
    <header className="topbar">
      <div className="topbar-container">
        <div onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <img src="../../assets/logo3.png" alt="logo" className="logo" />
        </div>

      {showSearch && (
  <div className="search-container">
    <div className="search-box">
      <svg
        className="search-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>

      <input
        type="text"
        placeholder="Search restaurants"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>
)}

        <div className="topbar-actions">
       {showSearch && (
  <div className="search-icon2" onClick={toggleSearch}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m24 24-7-7"></path>
    </svg>
  </div>
)}

          <div className="cart-icon" onClick={toggleCart}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-badge">{totalCount}</span>
          </div>

          <div className="user-icon" onClick={() => navigate("/customerProfile")}>
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
          </div>

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

export default TopBar;
