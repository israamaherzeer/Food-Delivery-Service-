import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopBar from "../../TopBar/TopBar";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import {
  faUser,
  faPhone,
  faLocationDot,
  faClockRotateLeft,
  faTruck,
  faCalendarDays,
  faHouse,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import style from "./CustomerProfile.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  date: string;
  totalPrice: number;
  paymentMethod: "Cash" | "CreditCard";
  status: string;
  restaurant: { name: string; location?: string };
  driver?: { full_name: string; phone_number?: string } | null;
  items: OrderItem[];
}

interface ICustomer {
  _id: string;
  full_name: string;
  phone_number: string;
}

const CustomerProfile = () => {
  const [user, setUser] = useState<ICustomer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurantRating, setRestaurantRating] = useState<{ [key: string]: number }>({});
  const [driverRating, setDriverRating] = useState<{ [key: string]: number }>({});
  const [originalData, setOriginalData] = useState({
    fullName: "",
    phoneNumber: "",
    addresses: [] as { _id?: string; label: string; address: string }[],
  });

  const [addresses, setAddresses] = useState<{ _id?: string; label: string; address: string }[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://food-delivery-service-production.up.railway.app/users/profile", {
          withCredentials: true,
        });
        const data = res.data;
        setUser(data.user);
        setFullName(data.user.full_name || "");
        setPhoneNumber(data.user.phone_number || "");

        const addressRes = await axios.get("https://food-delivery-service-production.up.railway.app/customer-profile/address", {
          withCredentials: true,
        });
        setAddresses(addressRes.data.data || []);

        setOriginalData({
          fullName: data.user.full_name || "",
          phoneNumber: data.user.phone_number || "",
          addresses: addressRes.data.data || [],
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchOrders = async () => {
  try {
    const res = await axios.get("https://food-delivery-service-production.up.railway.app/api/orders", { withCredentials: true });

    const formattedOrders: Order[] = (res.data.data || []).map((order: any) => ({
      orderId: order._id || "UNKNOWN_ID",
      date: order.createdAt || new Date().toISOString(),
      totalPrice: typeof order.total_price === "number" ? order.total_price : 0,
      paymentMethod: order.payment_method === "CreditCard" ? "CreditCard" : "Cash",
      status: order.status || "Unknown",
      restaurant: {
        name: order.restaurant?.name || "Unknown Restaurant",
        location: order.restaurant?.location,
      },
      driver: {
        name: order.driver?.full_name || "Not Assigned Yet",
        phone_number: order.driver?.phone_number || undefined,
      },
      items: Array.isArray(order.items)
        ? order.items.map((item: any) => ({
            name: item.menuItem?.name || "Unnamed item",
            price: typeof item.price === "number" ? item.price : 0,
            quantity: typeof item.quantity === "number" ? item.quantity : 1,
          }))
        : [],
    }));

    const initialRestaurantRatings: { [key: string]: number } = {};
    const initialDriverRatings: { [key: string]: number } = {};

    (res.data.data || []).forEach((order: any) => {
      if (order.restaurant_rating) {
        initialRestaurantRatings[order._id] = order.restaurant_rating;
      }
      if (order.driver_rating) {
        initialDriverRatings[order._id] = order.driver_rating;
      }
    });

    setOrders(formattedOrders);
    setRestaurantRating(initialRestaurantRatings);
    setDriverRating(initialDriverRatings);

  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};



    fetchProfile();
    fetchOrders();
  }, []);

  const handleAddAddress = () => {
    setAddresses((prev) => [...prev, { label: "", address: "" }]);
  };

  const handleAddressChange = (index: number, key: "label" | "address", value: string) => {
    const updated = [...addresses];
    updated[index][key] = value;
    setAddresses(updated);
  };

  const handleDeleteAddress = async (index: number) => {
    const addrToDelete = addresses[index];

    if (addrToDelete._id) {
      try {
        await axios.delete(`https://food-delivery-service-production.up.railway.app/customer-profile/address/${addrToDelete._id}`, {
          withCredentials: true,
        });
      } catch (err) {
        console.error("Error deleting address", err);
        return;
      }
    }

    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      await axios.put(
        `https://food-delivery-service-production.up.railway.app/customer-profile/users/${user._id}`,
        {
          full_name: fullName,
          phone_number: phoneNumber,
        },
        { withCredentials: true }
      );

      for (const addr of addresses) {
        if (!addr._id) {
          await axios.post(
            "https://food-delivery-service-production.up.railway.app/customer-profile/address",
            {
              label: addr.label,
              address: addr.address,
            },
            { withCredentials: true }
          );
        } else {
          await axios.put(
            `https://food-delivery-service-production.up.railway.app/customer-profile/address/${addr._id}`,
            { address: addr.address },
            { withCredentials: true }
          );
        }
      }

      setOriginalData({
        fullName,
        phoneNumber,
        addresses,
      });
      setIsEditing(false);
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error("Error saving profile:", error);
      }
    }
  };

  const handleCancel = () => {
    setFullName(originalData.fullName);
    setPhoneNumber(originalData.phoneNumber);
    setAddresses([...originalData.addresses]);
    setIsEditing(false);
  };

  const handleRating = async (orderId: string, type: "restaurant" | "driver", rating: number) => {
    try {
      if (type === "restaurant") {
        setRestaurantRating((prev) => ({ ...prev, [orderId]: rating }));
      } else {
        setDriverRating((prev) => ({ ...prev, [orderId]: rating }));
      }

      await axios.put(`https://food-delivery-service-production.up.railway.app/api/orders/${orderId}/rating`, {
        type,
        rating,
      }, { withCredentials: true });

      console.log("Rating submitted successfully!");
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const renderStars = (orderId: string, type: "restaurant" | "driver") => {
  const currentRating = type === "restaurant" ? restaurantRating[orderId] || 0 : driverRating[orderId] || 0;
  return (
    <div className={style.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={star <= currentRating ? solidStar : regularStar}
          onClick={() => handleRating(orderId, type, star)}
          className={`${style.starIcon} ${star <= currentRating ? style.filled : ""}`}
        />
      ))}
    </div>
  );
};

  return (
    <>
     <TopBar 
  searchTerm=""
  setSearchTerm={() => {}}
/>
      <div className={style.container} >
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
              <button className={style.editBtn} onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faPen} /> Edit Profile
              </button>
            )}
          </div>

          <div className={style.cardInfo1}>
            <div className={style.ProfileData}>
              <label className={style.label}>
                <FontAwesomeIcon icon={faUser} /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className={style.ProfileData}>
              <label className={style.label}>
                <FontAwesomeIcon icon={faPhone} /> Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className={style.ProfileData}>
            <div className={style.addressHeader}>
              <label className={style.label}>
                <FontAwesomeIcon icon={faLocationDot} /> Delivery Addresses:
              </label>
              {isEditing && (
                <button className={style.addAddressBtn} onClick={handleAddAddress}>
                  + Add New Address
                </button>
              )}
            </div>

            {addresses.map((addr, index) => (
              <div key={index} className={style.addressRow}>
                <span className={style.addressIndex}>{index + 1}.</span>
                <input
                  type="text"
                  value={addr.label}
                  onChange={(e) => handleAddressChange(index, "label", e.target.value)}
                  disabled={!isEditing}
                  className={style.addressLabel}
                  placeholder={`Label ${index + 1}`}
                />
                <input
                  type="text"
                  value={addr.address}
                  onChange={(e) => handleAddressChange(index, "address", e.target.value)}
                  disabled={!isEditing}
                  className={style.addressInput}
                  placeholder={`Address ${index + 1}`}
                />
                {isEditing && (
                  <button className={style.deleteAddressBtn} onClick={() => handleDeleteAddress(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className={style.buttonsContainer}>
              <button className={style.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button className={style.saveButton} onClick={handleSaveChanges}>
                <FontAwesomeIcon icon={faPen} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className={style.OrderCard}>
          <div className={style.orderHeader}>
            <div className={style.History}>
              <div className={style.HistoryIcon}>
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </div>
            </div>
            <div className={style.headerText}>
              <h4 className={style.title}>Order History</h4>
              <span>View your past orders and leave reviews</span>
            </div>
            <span className={style.orderCount}>
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
            <button onClick={() => setShowOrder(!showOrder)} className={style.viewOrderBtn}>
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>

          {showOrder && orders.length === 0 && <p>No orders found.</p>}

          {showOrder &&
            orders.map((order,index) => (
              <div key={order.orderId} className={style.orderCard}>
                <div className={style.orderHeaderCard}>
                  <h3 className={style.resturentName}>{order.restaurant?.name || "Unknown Restaurant"}</h3>
                  <span className={style.deliveredStatus}>{order.status}</span>
                </div>
                <span className={style.ordernumber}>
                 #ORD-{index+1}
                </span>
                <div className={style.orderContent}>
                  <div>
                    <h3 className={style.orderItem}>Order Items</h3>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={style.orderInfo}>
                    <p className={style.orderDetails}>
                      <strong>₪{order.totalPrice.toFixed(2)}</strong>
                    </p>
                    <p className={style.orderDetails}>
                      <FontAwesomeIcon icon={faTruck} /> <strong>Driver:</strong> {`${" "+order.driver?.full_name + " Driver_Phone_Number : "+order.driver?.phone_number}` || "N/A"}
                    </p>
                    <p className={style.orderDetails}>
                      <FontAwesomeIcon icon={faCalendarDays} /> <strong>Date:</strong>{" "}
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={style.payment}>
                  <strong>
                    <FontAwesomeIcon icon={faHouse} /> Payment:
                  </strong>{" "}
                  {order.paymentMethod}
                </p>
                {order.status === "Delivered" && (
                  <>
                    <div className={style.ratingTitle}>Ratings:</div>
                   <div className={style.ratingContainer}>
                    <div className={style.ratings}>
                      <p>Rate Restaurant:</p>
                      {renderStars(order.orderId, "restaurant")}
                    </div>
                    <div className={style.ratings}>

                    <p>Rate Driver:</p>
                    {renderStars(order.orderId, "driver")}
                    </div>
                    
                  </div>
                  </>
                 
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
