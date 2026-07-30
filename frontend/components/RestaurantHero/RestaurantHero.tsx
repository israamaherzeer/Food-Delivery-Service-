import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RestaurantHero.css';

import type { IRestaurant } from '../../types';

interface Iprops {
  restaurant: IRestaurant;
  isEditing: boolean;
  setRestaurant: React.Dispatch<React.SetStateAction<IRestaurant | null>>;
}

const RestaurantHero: React.FC<Iprops> = (props: Iprops) => {
  const [status, setStatus] = useState<"Open Now" | "Closed Now">("Closed Now");
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `https://food-delivery-service-production.up.railway.app/restaurants/status/${props.restaurant._id}`,
          { withCredentials: true }
        );
        if (res.data?.data?.isOpen) {
          setStatus("Open Now");
        } else {
          setStatus("Closed Now");
        }
      } catch (error) {
        console.error("Error fetching restaurant status", error);
      }
    };

    if (props.restaurant?._id) {
      fetchStatus();
    }
     
  }, [props.restaurant?._id]);

  return (
    <section className="restaurant-hero">
      <div className="hero-banner">
        <div className="banner-overlay"></div>
      </div>

      <div className="restaurant-info-card">
        <div className="restaurant-logo">
           <img
    src={
      props.restaurant.imageUrl
      ? props.restaurant.imageUrl.startsWith("http")
      ? props.restaurant.imageUrl
      : `https://food-delivery-service-production.up.railway.app/uploads/${props.restaurant.imageUrl}`
      : "/default-restaurant.png"
    }
        
            className="logo-image"
          />
        </div>

        <div className="restaurant-details">
          <div className="detail-section">
            <h3 className="section-title">Phone number</h3>
           
            {props.isEditing ? (
              <input
                type="number"
                value={String(props.restaurant.phone_number ?? '')}
                className="restaurant-input"
                onChange={(e) =>
                  props.setRestaurant((prev) =>
                    prev
                      ? { ...prev, phone_number: Number(e.target.value) }
                      : prev
                  )
                }
              />
            ) : (
              <p className="phone-text">
                {props.restaurant.phone_number} 
              </p>
            )}
          </div>

          <div className="detail-section">
            <h3 className="section-title">Location</h3>
            {props.isEditing ? (
              <input
                className="restaurant-input"
                value={props.restaurant.location}
                onChange={(e) =>
                  props.setRestaurant((prev) =>
                    prev ? { ...prev, location: e.target.value } : prev
                  )
                }
              />
            ) : (
              <p className="location-text">{props.restaurant.location}</p>
            )}
          </div>

          <div className="detail-section">
            <h3 className="section-title">Opening Hours</h3>
            <p className="hours-text">Saturday - Thursday</p>

            {props.isEditing ? (
              <>
                <input
                  value={props.restaurant.opening_time}
                  onChange={(e) =>
                    props.setRestaurant((prev) =>
                      prev ? { ...prev, opening_time: e.target.value } : prev
                    )
                  }
                  placeholder="Opening Time"
                  className="restaurant-input"
                />
                <input
                  value={props.restaurant.closing_time}
                  onChange={(e) =>
                    props.setRestaurant((prev) =>
                      prev ? { ...prev, closing_time: e.target.value } : prev
                    )
                  }
                  placeholder="Closing Time"
                  className="restaurant-input"
                />
              </>
            ) : (
              <>
                <p className="hours-text">
                  {props.restaurant.opening_time} - {props.restaurant.closing_time}
                </p>
              </>
            )}
            <p
              className={status === "Open Now" ? "status-open" : "status-closed"}
            >
              {status}
            </p>
          </div>

          <div className="detail-section">
            <h3 className="section-title">Delivery Price</h3>
            {props.isEditing ? (
              <input
                type="number"
                value={props.restaurant.deliveryPrice}
                className="restaurant-input"
                onChange={(e) =>
                  props.setRestaurant((prev) =>
                    prev
                      ? { ...prev, deliveryPrice: parseFloat(e.target.value) }
                      : prev
                  )
                }
              />
            ) : (
              <p className="delivery-price">
                {props.restaurant.deliveryPrice} ₪
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantHero;
