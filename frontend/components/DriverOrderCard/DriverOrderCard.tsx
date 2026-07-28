import React from 'react';
import style from './DriverOrderCard.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  orderNumber: string;
  phoneNumber: string;
  address: string;
  timeAgo: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  restaurantInfo: {
    name: string;
    location: string;
    phoneNumber: string;
    deliveryPrice: number;
  };
  yourEarnings: number;
  status: 'Pending' | 'In Delivery' | 'Delivered';
}

interface DriverOrderCardProps {
  order: Order;
  orderNumber:number
  onAccept: (orderId: string) => void;
  driverRating: number;
  // onReject: (orderId: string) => void;
  onPickedUp: (orderId: string) => void;
  onDelivered: (orderId: string) => void;
}
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

const DriverOrderCard: React.FC<DriverOrderCardProps> = ({ order,   driverRating,onAccept, onPickedUp, onDelivered,orderNumber }) => {
  return (
    <div className={style.orderCard}>
      <div className={style.header}>
        <div className={style.first}>
          <span className={style.customerName}>
            Customer: {order.customerName}
          </span>
          <span className={style.totalPrice}>
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>
        <div className={style.second}>
          <p>#ORD-{orderNumber}</p>
          <p>{order.timeAgo}</p>
        </div>
      </div>

      <div className={style.details}>
        <p className={style.detailRow}>
          <i className="fas fa-phone"></i> {order.phoneNumber}
        </p>
        <p className={style.detailRow}>
          <i className="fas fa-map-marker-alt"></i> {order.address}
        </p>
      </div>

      <div className={style.items}>
        <h4 className={style.itemsTitle}>Order items</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className={style.itemRow}>
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>₪ {item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <span className={style.itemRow}>
          <span style={{ marginLeft: "16px" }}>Delivery Price </span>
          <span>₪ {order.restaurantInfo.deliveryPrice.toFixed(2)}</span>
        </span>
      </div>

      <div className={style.paymentInfo}>
        <p className={style.detailRow}>Payment</p>
        <span className={style.paymentMethod}>{order.paymentMethod}</span>
      </div>

      <div className={style.restaurantInfo}>
        <h4 className={style.restName}>
          Restaurant: {order.restaurantInfo.name}
        </h4>
        <p className={style.detailRow}>
          <i className="fas fa-map-marker-alt"></i>{" "}
          {order.restaurantInfo.location}
        </p>
        <p className={style.detailRow}>
          <i className="fas fa-phone"></i> {order.restaurantInfo.phoneNumber}
        </p>
      </div>

      <div className={style.earnings}>
        <span>Your Earnings:</span>
        <span className={style.earningsAmount}>
          ₪ {order.yourEarnings.toFixed(2)}
        </span>
      </div>

      <div className={style.actions}>
        {order.status === "Pending" && (
          <>
            <button
              className={`${style.button} ${style.confirmButton}`}
              onClick={() => onAccept(order.id)}
            >
              Confirm
            </button>
          </>
        )}
        </div>
        {order.status === "In Delivery" && (
          <>
          
            <button
              className={`${style.button} ${style.deliveredButton}`}
              onClick={() => onDelivered(order.id)}
            >
              Order Delivered
            </button>
          </>
        )}
        <div>
        {order.status === "Delivered" && driverRating !== undefined ? (
          <div className={style.viewDetailsButton}>
            {renderStaticStars(driverRating)}
          </div>
        ) : (
          <>
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
          </>
        )}

        </div>
      </div>
   
  );
};

export default DriverOrderCard;
