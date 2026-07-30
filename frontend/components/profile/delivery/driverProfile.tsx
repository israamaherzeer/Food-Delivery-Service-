
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faPhone,
  
} from "@fortawesome/free-solid-svg-icons";
import style from './driverProfile.module.css'
import { useEffect, useState } from "react";
import type { IDriver } from "../../../types";
import axios from 'axios';
import DriverTopBar from "../../DriverTopBar/DriverTopBar";


const DriverProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<IDriver | null>(null);
  const [availability, setAvailability] = useState<boolean | null>(null);
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await axios.get("https://food-delivery-service-production.up.railway.app/users/profile", 
          { withCredentials: true }
          );
          const data = res.data;
          if (res.status === 200) {
            setUser(data.user);
             setAvailability(data.user.availability);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
  
      fetchProfile();
    }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => prev && { ...prev, [name]: value });
  }
  const handleSave = async () => {
    if (!user) return;

    try {
      const res = await axios.put(
        "https://food-delivery-service-production.up.railway.app/api/driver/profile",
        {
          full_name: user.full_name,
          phone_number: user.phone_number,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setIsEditing(false);
        setUser(res.data.data); 
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile, please try again.");
    }
  };

  return (
    <>
      <DriverTopBar userRole="driver" />
      <div
        className={style.container}
      
      >
        <div className={style.card}>
          <div className={style.cardHeader}>
            <div className={style.profile}>
              <div className="user-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={style.profileIcon}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div className={style.headerText}>
              <h4 className={style.title}>My Profile</h4>
              <span>Manage your account information and preferences</span>
            </div>
            {!isEditing && (
              <button
                className={style.editBtn}
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faPen} /> Edit Profile
              </button>
            )}
          </div>

          <div className={style.cardInfo1}>
            <div className={style.ProfileData}>
              <label className={style.label}>
                <i>
                  <FontAwesomeIcon icon={faUser} />
                </i>{" "}
                Full Name
              </label>
              <input
                type="text"
                value={user?.full_name}
                name="full_name"
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={style.ProfileData}>
              <label className={style.label}>
                <i>
                  <FontAwesomeIcon icon={faPhone} className={style.icon} />{" "}
                </i>
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={user?.phone_number}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className={style.cardInfo2}></div>
          {isEditing && (
            <button className={style.saveButton} onClick={handleSave}>
              <FontAwesomeIcon icon={faPen} /> Save Changes
            </button>
          )}
        </div>
      </div>
      <div></div>
    </>
  );
};

export default DriverProfile;
