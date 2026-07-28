import React, { useEffect, useState } from "react";
import axios from "axios";
import type { IRestaurant } from '../../types';
import style from './Resturant.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fullStar, faStarHalfAlt as halfStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from 'react-router-dom';

interface Iprops {
  resturant: IRestaurant;
}

const Resturant = (props: Iprops) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getresturentId = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FontAwesomeIcon key={i} icon={fullStar} style={{ color: "#FC8A06FF" }} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FontAwesomeIcon key={i} icon={halfStar} style={{ color: "#FC8A06FF" }} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={emptyStar} style={{ color: "#FC8A06FF" }} />);
      }
    }
    return stars;
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/restaurants/status/${props.resturant._id}`,
          { withCredentials: true }
        );
        setIsOpen(res.data?.data?.isOpen || false);
      } catch (error) {
        console.error("Error fetching restaurant status", error);
      }
    };

    if (props.resturant?._id) {
      fetchStatus();
    }
  }, [props.resturant?._id]);

  return (
    <div
      className={style.resturntCard}
      onClick={() => getresturentId(props.resturant._id)}
    >
   <div className={style.imageWrapper}>


    <img
    src={
      props.resturant.imageUrl
      ? props.resturant.imageUrl.startsWith("http")
      ? props.resturant.imageUrl
      : `http://localhost:5000/uploads/${props.resturant.imageUrl}`
      : "/default-restaurant.png"
    }
    className={style.logo}
    style={{
      border: `4px solid ${isOpen ? "green" : "red"}`,
    }}
    
  />
<div className={style.rating}>

  <FontAwesomeIcon 
    icon={fullStar}
    style={{ color:"#FC8A06" }}
  />

  <span className={style.ratingNumber}>
    {props.resturant.totalRating?.toFixed(1) || "0.0"}
  </span>

</div>

</div>

      <p className={style.name}>{props.resturant.name}</p>

      <div className={style.categories}>
        {props.resturant.categories.map((cat: any, index) => (
          <span key={index} className={style.category}>
            {typeof cat === "string" ? cat : cat.name}
          </span>
        ))}
      </div>

      {/* <div className={style.footercontainer}>
        <div>
          <p className={style.label}>Delivery Price   

          <span> {"   "}{props.resturant.deliveryPrice}₪</span>

          </p>
        </div>
       
      </div> */}
    </div>
  );
};

export default Resturant;
