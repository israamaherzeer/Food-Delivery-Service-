import React, { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCartContext } from "../../../src/cartcontext";
import type { IRestaurant } from "../../../types";
import RestaurantHero from "../../RestaurantHero/RestaurantHero";
import FilterBar from "../../FilterBar/FilterBar";
import MenuGrid from "../../MenuGrid/MenuGrid";
import style from './ManageMenuresturaentProfile.module.css'
import DashboardTopBar from "../../DashboardTopBar/DashboardTopBar";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ManageRestaurantProfile: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
   const navigate = useNavigate();


  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const {
    cartItems,
    addToCart,
    onUpdateQuantity: updateQuantity,
    setDeliveryPrice,
  
  } = useCartContext();
  useEffect(() => {

    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`https://food-delivery-service-production.up.railway.app/users/profile`,
          {
            withCredentials: true,
          }
        );
        const profileData = res.data.user;
         if (profileData && profileData.menuItems) {
             setRestaurant(profileData);
         }
        setDeliveryPrice(res.data.data.deliveryPrice);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [id]);
  console.log(restaurant);
const handleSave = async () => {
  try {
    const res = await axios.put(
      "https://food-delivery-service-production.up.railway.app/restaurants/profile",
      restaurant,
      {
        withCredentials: true,
      }
    );

    setRestaurant(res.data.data);
    setIsEditing(false);

  } catch (error) {
    console.error("Save error:", error);
  }
};


if (!restaurant) {
  return (
    <>
      <DashboardTopBar userRole="restaurant" />
      <div className={style.loadingContainer}>
        <img
          src="/loaginBar.png"
          alt="Loading..."
          className={style.loadingImage}
        />
      </div>
    </>
  );
}
  return (
    <div className="App">
      <DashboardTopBar userRole="restaurant" />
      <RestaurantHero
        restaurant={restaurant}
        isEditing={isEditing}
        setRestaurant={setRestaurant}
      />
      <div className={style.editprofile}>
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <div className={style.buttons}>
          <button
            className={style.editBtn}
            onClick={() => navigate(`/restaurant/menu-management`)}
          >
            {" "}
            <FontAwesomeIcon icon={faPen} /> Edit Menu
          </button>
          <button
            className={style.editBtn}
          onClick={() => {
  if (isEditing) {
    handleSave();
  } else {
    setIsEditing(true);
  }
}}
          >
            {" "}
            <FontAwesomeIcon icon={faPen} />{" "}
            {isEditing ? "Save changes " : "Edit profile"}
          </button>
        </div>
      </div>

      <MenuGrid
        activeFilter={activeFilter}
        onAddToCart={addToCart}
        resturentId={restaurant._id}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        isOwnerView={true} logoImage={""}       
      />
    </div>
  );
};

export default ManageRestaurantProfile;
