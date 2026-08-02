import React from 'react';
import style from './OrderCard.module.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import type { Order } from '../../types';

import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

interface OrderCardProps {
  deliveryPrice: number;
  order: Order;
  restaurantRating?: number;
  onConfirm: (orderId: string) => void;
  onOutForDelivery: (orderId: string) => void;
  onDelivered: (orderId: string) => void;
  onserachingForDriver: (orderId: string) => void;
  orderNumber?: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ order,deliveryPrice, restaurantRating, onConfirm, onOutForDelivery, onDelivered,onserachingForDriver,orderNumber }) => {
  const totalPrice = order.total_price ?? 0;

  const renderStaticStars = (rating: number) => (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={star <= rating ? solidStar : regularStar}
          style={{ color: star <= rating ? 'gold' : 'gray', fontSize: '16px' }}
        />
      ))}
    </div>
  );
  return (
    <div className={style.orderCard}>
      <div className={style.header}>
        <div className={style.first}>
          <span className={style.customerName}>{order.full_name}</span>
          <span className={style.totalPrice}>₪{totalPrice.toFixed(2)}</span>
        </div>
        <div className={style.second}>
          <p>#ORD-{orderNumber}</p>
          <p>{order.timeAgo}</p>
        </div>
      </div>
      <div className={style.details}>
        <p className={style.detailRow}>
          <i className="fas fa-phone"></i>
          {order.phone_number}
        </p>
        <p className={style.detailRow}>
          <i className="fas fa-map-marker-alt"></i>
          {order.address}
        </p>
      </div>

      <div className={style.items}>
        <h4 className={style.itemsTitle}>Order Items</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className={style.itemRow}>
              <span>
                {item.quantity} x {item.menuItem.name}
              </span>
              <span className={style.itemPrice}>
                ₪ {(item.quantity * item.price).toFixed(2)}
              </span>
            </li>
          ))}
          
        </ul>
         <span className={style.itemRow}>
          <span style={{ marginLeft: "16px" }}>Delivery Price </span>
          <span>₪ {deliveryPrice.toFixed(2)}</span>
        </span>
      </div>

      {order.status === "Out for Delivery" && order.driverInfo && (
        <div className={style.driverInfo}>
          <p className={style.detailRow}>Delivery Driver Info :</p>
          <div className={style.driver}>
            <span className={style.driverName}>
              {" "}
              <FontAwesomeIcon icon={faUser} /> {order.driverInfo.name}
            </span>
            <span className={style.driverPhone}>
              {" "}
              <FontAwesomeIcon icon={faPhone} /> {order.driverInfo.phoneNumber}
            </span>
          </div>
        </div>
      )}

      <div className={style.payment}>
        <p className={style.detailRow}>Payment</p>
        <span className={style.paymentMethod}>{order.payment_method}</span>
      </div>

      {order.status === "Pending" && (
        <button
          className={style.confirmButton}
          onClick={() => onConfirm(order._id)}
        >
          Confirm Order <span className={style.arrow}>&gt;</span>
        </button>
      )}
      {order.status === "In Preparation" && (
        <button
          className={style.outForDeliveryButton}
          onClick={() => onserachingForDriver(order._id)}
        >
          Searching for driver<span className={style.arrow}>&gt;</span>
        </button>
      )}
      {/* {order.status === "Searching for driver" && (
        <button
          className={style.outForDeliveryButton}
          onClick={() => onOutForDelivery(order._id)}
        >
          Out for Delivery <span className={style.arrow}>&gt;</span>
        </button>
      )} */}
      {/* {order.status === "Out for Delivery" && (
        <button
          className={style.deliveredButton}
          onClick={() => onDelivered(order._id)}
        >
          Delivered <span className={style.arrow}>&gt;</span>
        </button>
      )} */}

      {order.status === "Delivered" && restaurantRating !== undefined ? (
        <div className={style.viewDetailsButton}>
          {renderStaticStars(restaurantRating)}
        </div>
      ) : (
        <div className={style.viewDetailsButton}>
          <FontAwesomeIcon
            icon={regularStar}
            style={{ color: "gray", fontSize: "16px" }}
          />
          <FontAwesomeIcon
            icon={regularStar}
            style={{ color: "gray", fontSize: "16px" }}
          />
          <FontAwesomeIcon
            icon={regularStar}
            style={{ color: "gray", fontSize: "16px" }}
          />
          <FontAwesomeIcon
            icon={regularStar}
            style={{ color: "gray", fontSize: "16px" }}
          />
          <FontAwesomeIcon
            icon={regularStar}
            style={{ color: "gray", fontSize: "16px" }}
          />
        </div>
      )}
      {/* {order.status === "Delivered" && (
        <button className={style.viewDetailsButton} disabled>
          <FontAwesomeIcon icon={solidStar} style={{ color: "#facc15" }} />
          <FontAwesomeIcon icon={solidStar} style={{ color: "#facc15" }} />
          <FontAwesomeIcon icon={solidStar} style={{ color: "#facc15" }} />
          <FontAwesomeIcon icon={solidStar} style={{ color: "#facc15" }} />
          <FontAwesomeIcon icon={solidStar} style={{ color: "#facc15" }} />
        </button>
      )} */}
    </div>
  );
};

export default OrderCard;