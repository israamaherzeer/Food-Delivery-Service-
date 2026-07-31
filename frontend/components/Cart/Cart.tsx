import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';
import type { CartItem } from '../../types';

// Ensure CartItem has menuItem when coming from backend (some typings may differ)
type CartItemWithMenu = CartItem & { menuItem?: any };
import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmOrder from '../ConfirmOrder/ConfirmOrder';
import Notification from '../Notification/Notification.js';

interface CartProps {
   isOpen: boolean;
  onClose: () => void;
  deliveryPrice: number;

  items?: CartItem[];

  cartItems?: CartItem[];

  onUpdateQuantity?: (
    id: string,
    quantity: number
  ) => void;
}

const API_BASE_URL = 'https://food-delivery-service-production.up.railway.app/api/cart';

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const [itemToDelete, setItemToDelete] = useState<CartItemWithMenu | null>(null);
  const [cartItems, setCartItems] = useState<CartItemWithMenu[]>([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restId, setRestId] = useState(String||undefined);

  const [deliveryFee, setDeliveryFee] = useState(0);
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL, { withCredentials: true });
     console.log("FETCH CART DATA:", res.data);
      if(res.data.data.restaurant !== null&&res.data.data.items){
        setDeliveryFee(res.data.data.restaurant.deliveryPrice);
        setCartItems(res.data.data.items || []);
        setRestId(res.data.data.restaurant._id.toString());
      }
      // console.log("my cart ", res);
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);


  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    console.log("im in the handle update quantiti!!!!! ");
    if (newQuantity < 1){
      console.log("less than 1");
      
      return;
    } 

    const currentItem = cartItems.find(item => item.menuItem._id === itemId);
    if (!currentItem) {
      console.log("no currentItem");
      return;
    }
    console.log("this is the current item " ,currentItem);
    const diff = newQuantity - currentItem.quantity;
    if (diff === 0) return;

    try {
      if (diff > 0) {
        // console.log("im here!", itemId);
        const res = await axios.post(`${API_BASE_URL}/add`, {
          productId: itemId,
          quantity: diff,
        }, { withCredentials: true });
        setCartItems(res.data.data.items);
      } else {
        const item = cartItems.find(item => item.menuItem._id === itemId);

        if(item) await axios.delete(`${API_BASE_URL}/${item._id}`, { withCredentials: true });
        if (newQuantity > 0) {
          const res = await axios.post(`${API_BASE_URL}/add`, {
            productId: itemId,
            quantity: newQuantity,
          }, { withCredentials: true });
          setCartItems(res.data.data.items);
        } else {
          setCartItems(prev => prev.filter(item => item._id !== itemId));
        }
      
      }
      console.log("im the length ", cartItems.length)
      
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const requestDeleteItem = (item: CartItem) => {
    setItemToDelete(item);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/${itemToDelete._id}`, { withCredentials: true });
      setCartItems(prev => {
        const updatedCart = prev.filter(item => item._id !== itemToDelete._id);
        if (updatedCart.length === 0) {
          clearCart();
        }

        return updatedCart;
      });

      
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setItemToDelete(null);
    }
  };

  const clearCart = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/clear`, { withCredentials: true });
    setCartItems([]);
  } catch (error) {
    console.error("Failed to clear cart:", error);
  }
};
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.menuItem?.price || 0) * item.quantity,
    0
  );
  
//  console.log("cart before return :", cartItems);
 
  const total = cartItems.length>0 ?subtotal + deliveryFee : 0.0;

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <p>Your Cart</p>

          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
          {/* <p>From Restaurant : cartItems[0]</p> */}
          {loading ? (
           <div className="empty-cart">
            <p>Loading...</p>
            <img src="/loading2.png" style={{ marginLeft:"30px",width: "70px", height:"80px" }} />
          </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: "36px" }} />
              <p>Your cart is empty.</p>
              <p>Add some delicious food to get started!</p>
            </div>
          ) : (
          <>
            <div className="cart-items">
              
              {cartItems.map(item => (
                <div key={item.menuItem._id} className="cart-item">
                  <div className="cart-item-details">
                    <img
                      src={item.menuItem.image_url}
                      alt={item.menuItem.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-section">
                      <h3>{item.menuItem.name}</h3>
                      <p>{item.menuItem.price?.toFixed(2) || "0.00"} ₪ each</p>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleUpdateQuantity(item.menuItem._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn plus"
                          onClick={() =>
                            handleUpdateQuantity(item.menuItem._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => requestDeleteItem(item)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} ₪</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee.toFixed(2)} ₪</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{total.toFixed(2)} ₪</span>
              </div>
            </div>

            <button className="place-order-btn" onClick={() => {
              setIsAddVisible(true) ;  }}>
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
      {itemToDelete && (
          <Notification
            Name={`Are you sure you want to delete\n"${itemToDelete.menuItem.name}"?`}
            isDelete={true}
            onConfirm={confirmDeleteItem}
            onCancel={() => setItemToDelete(null)}
          />
      )}

      {isAddVisible  &&  (
        <ConfirmOrder
          onClose={() => setIsAddVisible(false)}
          cartItems={cartItems}
          deliveryFee={deliveryFee}
          subtotal={subtotal}
          total={total}
          restaurantId={restId}
          clearCart={() => clearCart()}

        />
      )}
      
    </div>
  );
};

export default Cart;