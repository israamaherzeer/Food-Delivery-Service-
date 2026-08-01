import React, { useState, useEffect } from 'react';

import DriverTopBar from '../DriverTopBar/DriverTopBar';
import DriverOrderCard from '../DriverOrderCard/DriverOrderCard';
import style from './DriverIncomingOrdersPage.module.css';
import { Switch } from "antd";
import api from '../../src/api/axios';

const DriverIncomingOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'In Delivery' | 'Delivered'>('Pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [availability, setAvailability] = useState<"Available" | "Not Available" | null>(null);
  const[loading, setLoading] = useState(false);


  useEffect(() => {
    console.log("from driver orders !! ", orders);
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);
  useEffect(() => {
   
    fetchOrders();
  }, []);
  console.log(orders);
  
   const fetchOrders = async () => {
      try {
        setLoading(true);
       const res = await api.get('/api/driver/orders');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
      setLoading(false);
    };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
       const res = await api.get("/api/driver/availability");
        setAvailability(res.data.availability);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };
    fetchAvailability();
  }, []);

  const updateAvailability = async (status: "Available" | "Not Available") => {
    try {
      setAvailability(status);  
     await api.put(
  "/api/driver/availability",
  { status }
);
    } catch (error:any) {
      console.error(
        "Error updating availability:",
        error.response?.data || error
      );
    }
  };
  
  const handleUpdateOrderStatus = async (
  orderId: string,
  newStatus: 'In Delivery' | 'Delivered'
) => {

  try {

    // منع أخذ أكثر من طلب
    if (
      newStatus === "In Delivery" &&
      availability === "Not Available"
    ) {
      alert("You already have an active order");
      return;
    }


    let url = "";


    if (newStatus === "In Delivery") {
  url = `/api/driver/orders/${orderId}/startDelivery`;
  setAvailability("Not Available");

} else if (newStatus === "Delivered") {
  url = `/api/driver/orders/${orderId}/delivered`;
  setAvailability("Available");
}


await api.put(url, {});

    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? {
              ...order,
              driverStatus:newStatus
            }
          : order
      )
    );


  } catch(error:any){

    console.error(
      "Error updating order status:",
      error.response?.data || error
    );

  }

};
  
 


  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Pending') return order.driverStatus === 'Pending';
    if (activeTab === 'In Delivery') return order.driverStatus === 'In Delivery';
    if (activeTab === 'Delivered') return order.driverStatus === 'Delivered';
    return false;
  });

  return (
    <div className={style.pageContainer}>
      <DriverTopBar userRole="driver" />
      <div className={style.dashboardContent}>
        <div className={style.tabsContainer}>
          <div className={style.tabs}>
            {["Pending", "In Delivery", "Delivered"].map((tab) => (
              <div
                key={tab}
                className={`${style.tab} ${
                  activeTab === tab
                    ? style[`active${tab.replace(" ", "")}`]
                    : ""
                }`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab}{" "}
                <span className={style.badge}>
                  {orders.filter((o) => o.driverStatus === tab).length}
                </span>
              </div>
            ))}
          </div>
        <div className={style.availabilityContainer}>
   <span>Availability</span>
                  <Switch
                    checked={availability === "Available"}
                    onChange={(checked) =>
                      updateAvailability(
                        checked ? "Available" : "Not Available"
                      )
                    }
                  
                 
                    style={{
                      width: "50px",
                      height: "25px",
                    }}
                  />
              
              </div>
            
          </div>
        </div>

        <div className={style.orderListContainer}>

          {loading? 
            <div className={style.loading}>
              <img
                src="/loading2.png"
                style={{
                  width: "100px",
                  height: "100px"
                }}
                alt="no image"
              />
            </div> : <>


            {filteredOrders.length === 0 ? (
            <p className={style.noOrdersMessage}>
              No {activeTab.toLowerCase()} orders at the moment.
            </p>
          ) : (
            <div className={style.ordersGrid}>
              {filteredOrders.map((order,index) => (
                <DriverOrderCard
                key={order._id}
              orderNumber={index + 1} 
                order={{
                  id: order._id,
                  customerName: order.customer?.full_name || '',
                  orderNumber: order._id,
                  phoneNumber: order.customer?.phone_number || '',
                  address: order.address,
                  timeAgo: '',
                  items: order.items.map((item: any) => ({
                    name: item.menuItem?.name || 'Unknown',
                    quantity: item.quantity,
                    price: item.price,
                  })),
                  totalPrice: order.total_price,
                  paymentMethod: order.payment_method,
                  restaurantInfo: {
                    name: order.restaurant?.name || '',
                    location: order.restaurant?.location || '',
                    phoneNumber: order.restaurant?.phone_number || '',
                    deliveryPrice: order.restaurant?.deliveryPrice || 0,
                  },
                  yourEarnings:  order.restaurant?.deliveryPrice || 0,
                  status: order.driverStatus as any,
                }}
                driverRating={order.driver_rating} 
                onAccept={() => handleUpdateOrderStatus(order._id, 'In Delivery')}
                onPickedUp={() => handleUpdateOrderStatus(order._id, 'In Delivery')}
                onDelivered={() => handleUpdateOrderStatus(order._id, 'Delivered')}
              />


              ))}
            </div> )}
            </>
          }
          
          
        </div>
      </div>
  
  );
};

export default DriverIncomingOrdersPage;
