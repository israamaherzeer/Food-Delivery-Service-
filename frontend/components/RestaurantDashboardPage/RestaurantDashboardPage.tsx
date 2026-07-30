/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'; 
import DashboardTopBar from '../DashboardTopBar/DashboardTopBar';
import OrderCard from '../OrderCard/OrderCard';
import style from './RestaurantDashboardPage.module.css';
import axios from 'axios';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Order } from '../../types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

dayjs.extend(relativeTime);


const RestaurantDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'In Preparation' | 'Out for Delivery' | 'Delivered' |'Searching for driver'>('Pending');
  const [orders, setOrders] = useState<Order[]>([]); 

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://food-delivery-service-production.up.railway.app/api/orders/restaurant-orders",
        {
          withCredentials: true, 
        }
      );
  
      const formattedOrders = response.data.data.map((order: any) => ({
        ...order,
        orderNumber: `${order._id}`,
        timeAgo: dayjs(order.createdAt).fromNow(),
        phone_number: order.customer?.phone_number || "",
        full_name: order.customer.full_name,
      }));
      

      setOrders(formattedOrders);
      console.log("ppppppppppppppppppp ",response);
    
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  // fetchOrders();
  useEffect(() => {
    console.log("in the use effect!");
    fetchOrders();
  }, [activeTab]);
 
  useEffect(() => {
    console.log("these are the orders!!!! ",orders);
  }, [orders]);
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: "In Preparation" | "Out for Delivery" | "Delivered"
  ) => {
    try {
      await axios.put(
        `https://food-delivery-service-production.up.railway.app/api/orders/${orderId}/preparation`,
        { status: 'In Preparation' },
        { withCredentials: true }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            const updatedOrder = { ...order, status: newStatus };
            if (newStatus === "Out for Delivery" && !updatedOrder.driverInfo) {
              updatedOrder.driverInfo = {
                name: "Mohammad Ali",
                phoneNumber: "+1 (555) 123-4567",
              };
            }
            return updatedOrder;
          }
          return order;
        })
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
 const handleUpdateOrderStatusforSearching = async (
    orderId: string,
    newStatus: "Searching for driver"
  ) => {
    try {
      const res = await axios.put(
        `https://food-delivery-service-production.up.railway.app/api/orders/${orderId}/searchingForDriver`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            const updatedOrder = { ...order, status: newStatus };

            return updatedOrder;
          }
          return order;
        })
      );
      console.log("her i ammmmmmmmmmmmmm ",orderId, " ", res);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

    const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className={style.pageContainer}>
      <DashboardTopBar userRole="restaurant" />
      <div className={style.dashboardContent}>
        <div className={style.tabsContainer}>
          <div
            className={`${style.tab} ${
              activeTab === "Pending" ? style.activePending : ""
            }`}
            onClick={() => setActiveTab("Pending")}
          >
            <span className={style.tabIcon}>
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span>
            Pending Orders{" "}
            <span className={style.badge}>
              {orders.filter((o) => o.status === "Pending").length}
            </span>
          </div>
          <div
            className={`${style.tab} ${
              activeTab === "In Preparation" ? style.activeInPreparation : ""
            }`}
            onClick={() => setActiveTab("In Preparation")}
          >
            <span className={style.tabIcon}>
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
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M16 12H8m4-4v8" />
              </svg>
            </span>
            In Preparation{" "}
            <span className={style.badge}>
              {orders.filter((o) => o.status === "In Preparation").length}
            </span>
          </div>

          <div
            className={`${style.tab} ${
              activeTab === "Searching for driver"
              ? style.activeInPreparation
              : ""
            }`}
            onClick={() => setActiveTab("Searching for driver")}
          >
            <span className={style.tabIcon}>
              <FontAwesomeIcon icon={faSearch}  />
            </span>
            Searching for driver{" "}
            <span className={style.badge}>
              {orders.filter((o) => o.status === "Searching for driver").length}
            </span>
          </div>
          <div
            className={`${style.tab} ${
              activeTab === "Out for Delivery" ? style.activeOutForDelivery : ""
            }`}
            onClick={() => setActiveTab("Out for Delivery")}
          >
            <span className={style.tabIcon}>
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
                <path d="M18 8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z" />
                <path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
                <path d="M12 18v-6" />
              </svg>
            </span>
            Out for Delivery{" "}
            <span className={style.badge}>
              {orders.filter((o) => o.status === "Out for Delivery").length}
            </span>
          </div>
          <div
            className={`${style.tab} ${
              activeTab === "Delivered" ? style.activeDelivered : ""
            }`}
            onClick={() => setActiveTab("Delivered")}
          >
            <span className={style.tabIcon}>
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
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            Delivered{" "}
            <span className={style.badge}>
              {orders.filter((o) => o.status === "Delivered").length}
            </span>
          </div>
        </div>

        <div className={style.orderListContainer}>
          {filteredOrders.length === 0 ? (
            <p className={style.noOrdersMessage}>
              No {activeTab.toLowerCase()} orders at the moment.
            </p>
          ) : (
            <div className={style.ordersGrid}>
              {filteredOrders.map((order, index) => (
                <OrderCard
                  deliveryPrice ={order.restaurant?.deliveryPrice||0}
                  key={order._id}
                  order={order}
                  orderNumber={index + 1}
                  restaurantRating={
                    order.status === "Delivered" ? order.restaurant_rating : 0
                  }
                  onConfirm={() =>
                    handleUpdateOrderStatus(order._id, "In Preparation")
                  }
                  onserachingForDriver={() =>
                    handleUpdateOrderStatusforSearching(
                      order._id,
                      "Searching for driver"
                    )
                  }
                  onOutForDelivery={() =>
                    handleUpdateOrderStatus(order._id, "Out for Delivery")
                  }
                  onDelivered={() =>
                    handleUpdateOrderStatus(order._id, "Delivered")
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboardPage;