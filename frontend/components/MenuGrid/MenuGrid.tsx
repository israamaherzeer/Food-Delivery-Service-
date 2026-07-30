import React, { useEffect, useState } from 'react';
import './MenuGrid.css';
import axios from 'axios';
import type { CartItem, MenuItem } from '../../types';

interface MenuGridProps {
  activeFilter: string;
  onAddToCart: (item: MenuItem) => void;
  resturentId: string;
  cartItems: { [id: string]: CartItem };
  onUpdateQuantity: (id: string, quantity: number) => void;
  isOwnerView?: boolean;
  logoImage:string
}

const MenuGrid: React.FC<MenuGridProps> = ({ activeFilter, onAddToCart, resturentId, cartItems, onUpdateQuantity,isOwnerView,logoImage }) => {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [menuItems, setMenuItem] = useState<MenuItem[] | null>(null)
  const [QuantityItemId, setQuantityItemId] = useState<string | null>(null);
  const[,setLoading] = useState(false);

  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean | null>(
    null
  );

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

    
      const menuRes = await axios.get(`https://food-delivery-service-production.up.railway.app/menu-items`, {
        withCredentials: true,
      });
      const allItems = menuRes.data.data;
      const filteredByRestaurant = allItems.filter(
        (item: MenuItem) => item.restaurant === resturentId
      );
      setMenuItem(filteredByRestaurant);

      
      const statusRes = await axios.get(
        `https://food-delivery-service-production.up.railway.app/restaurants/status/${resturentId}`,
        { withCredentials: true }
      );
      setIsRestaurantOpen(statusRes.data.data.isOpen);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [resturentId]);



console.log(isRestaurantOpen);

  const filteredItems = activeFilter === 'All'
    ? menuItems
    : menuItems?.filter(item => item.type === activeFilter
   

    );

  const handleSizeSelect = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size,
    }));
  };
  console.log("ana itemmmms : ",menuItems);
  return (
    <div className="menu-grid">
      <div className="menu-container">
        <div className="menu-items">
          {filteredItems?.map((item) => (
            <div key={item._id} className="menu-item">
              <div className="item-image">
                <img
                  src={item.image_url || logoImage}
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = logoImage)}
                />
              </div>
              <div className="item-content">
                <div className="item-header">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-price">{item.price} ₪</span>
                </div>
                <p className="item-description">{item.description}</p>
                {item.sizes && (
                  <div className="size-options">
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-button ${
                          selectedSizes[item._id] === size ? "selected" : ""
                        }`}
                        onClick={() => handleSizeSelect(item._id, size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  {QuantityItemId === String(item._id) ? (
                    <div className="quantity-container">
                      <button
                        className="quantity-btn"
                        onClick={() => {
                          const newQuantitiy =
                            cartItems[item._id]?.quantity - 1;
                          onUpdateQuantity(String(item._id), newQuantitiy);
                          if (newQuantitiy <= 0) setQuantityItemId(null);
                        }}
                      >
                        -
                      </button>
                      <span className="quantity-count">
                        {cartItems[item._id]?.quantity || 0}
                      </span>
                      <button
                        className="quantity-btn plus"
                        onClick={() =>
                          onUpdateQuantity(
                            String(item._id),
                            (cartItems[item._id]?.quantity || 0) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                  onClick={() => {
  if (!isOwnerView && isRestaurantOpen) {
    setQuantityItemId(String(item._id)); // يظهر أزرار + و-
    onAddToCart(item); // أرسل الطلب بدون انتظار
  }
}}
                      disabled={isOwnerView || !isRestaurantOpen}
                      style={{
                        opacity: isOwnerView || !isRestaurantOpen ? 0.6 : 1,
                        cursor:
                          isOwnerView || !isRestaurantOpen
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      Add To Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuGrid;