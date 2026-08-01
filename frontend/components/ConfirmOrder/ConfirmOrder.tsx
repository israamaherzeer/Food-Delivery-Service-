import { useState, useEffect } from "react";
import style from "./ConfirmOrder.module.css";
import type { CartItem } from "../../types";

import Notification from "../Notification/Notification";
import api from "../../src/api/axios";

interface Iprops {
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  restaurantId: string; 
  clearCart: () => void;
  
}

interface Address {
  _id?: string;
  label: string;
  address: string;
}

const ConfirmOrder = (props: Iprops) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
    const res = await api.get("/customer-profile/address");
  
      
        setAddresses(res.data.data || []);
      } catch (err) {
        console.error("Error fetching addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    let finalAddress = "";

    if (selectedAddress === "new") {
      if (!newAddress.trim()) {
        setError("Please enter a delivery address.");
        return;
      }
      finalAddress = newAddress.trim();
    } else if (selectedAddress) {
      const chosen = addresses.find(addr => addr._id === selectedAddress);
      finalAddress = chosen?.address || "";
    } else {
      setError("Please select a delivery address.");
      return;
    }

    setError("");

    const orderData = {
      restaurantId: props.restaurantId,
      address: finalAddress,
      paymentMethod: paymentMethod,
          items: props.cartItems.map((item) => ({
            menuItem: (item as any).menuItem?._id || (item as any).menuItem,
            quantity: item.quantity,
            price: (item as any).menuItem?.price || 0,
          })),
    };

    try {
     await api.post("/api/orders", orderData);

        
   
      

     props.clearCart();
     setShowSuccess(true);
   
    } catch (error: any) {
      console.error("Error placing order:", error);
     setShowError(true);
    }
  };

  return (
    <div className={style.background}>
      <div className={style.card}>
        <div className={style.header}>
          <h6 className={style.title}>Checkout</h6>
          <button className={style.closeBtn} onClick={props.onClose}>
            ×
          </button>
        </div>

        <div className={style.section}>
          <label className={style.sectionLabel}>Delivery Address</label>
          <select
            style={{width:"90%", marginLeft:"10px"}}
            className={style.input}
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            <option value="">-- Select Address --</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.label} - {addr.address}
              </option>
            ))}
            <option value="new">+ Add New Address</option>
          </select>

          {selectedAddress === "new" && (
            <input
              type="text"
              placeholder="Enter your new delivery address"
              className={style.input}
              style={{marginTop:"10px",marginLeft:"10px"}}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          )}

          {error && <p style={{ color: "red", marginTop: "4px" }}>{error}</p>}
        </div>

        <div className={style.section}>
          <label className={style.sectionLabel}>Payment Method</label>
          <div className={style.radioGroup}>
            <label className={style.radioOption}>
              <input
                type="radio"
                name="payment"
                value="Cash"
                checked={paymentMethod === "Cash"}
                onChange={() => setPaymentMethod("Cash")}
              />
              <div>
                <div className={style.radioTitle}>Pay at Delivery</div>
                <div className={style.radioDesc}>Cash payment upon delivery</div>
              </div>
            </label>

            <label className={style.radioOption}>
              <input
                type="radio"
                name="payment"
                value="CreditCard"
                checked={paymentMethod === "CreditCard"}
                onChange={() => setPaymentMethod("CreditCard")}
              />
              <div>
                <div className={style.radioTitle}>Credit Card</div>
                <div className={style.radioDesc}>Pay now with credit card</div>
              </div>
            </label>
          </div>
        </div>

        <div className={style.section}>
          <label className={style.sectionLabel}>Order Summary</label>
          <div className={style.orderSummery}>
            {props.cartItems.map((item) => (
              <div className={style.summaryRow} key={item._id}>
                <span>
                  {item.quantity}x {(item as any).menuItem?.name}
                </span>
                <span>{(((item as any).menuItem?.price || 0) * item.quantity).toFixed(2)} ₪</span>
              </div>
            ))}
          </div>

          <div className={style.summaryRow}>
            <span>Subtotal</span>
            <span>{props.subtotal.toFixed(2)} ₪</span>
          </div>
          <div className={style.summaryRow}>
            <span>Delivery Fee</span>
            <span>{props.deliveryFee.toFixed(2)} ₪</span>
          </div>
          <div className={style.totalRow}>
            <span>Total</span>
            <span>{props.total.toFixed(2)} ₪</span>
          </div>
        </div>

        <button className={style.placeOrderBtn} onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
      {showSuccess && (
  <Notification
    Name="Order placed successfully!"
    isDelete={false}
      isSuccess={true}
    onConfirm={() => {
      setShowSuccess(false);
      props.onClose();
    }}
    onCancel={() => {}}
  />
)}

{showError && (
  <Notification
    Name="Failed to place order. Please try again."
    isDelete={false}
    onConfirm={() => setShowError(false)}
    onCancel={() => {}}
  />
)}
    </div>
    
  );
};

export default ConfirmOrder;
