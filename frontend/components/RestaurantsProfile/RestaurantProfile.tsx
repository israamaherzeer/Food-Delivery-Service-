import React, { useEffect, useState } from 'react';
import TopBar from '../TopBar/TopBar';
import RestaurantHero from '../RestaurantHero/RestaurantHero';
import './RestaurantProfile.modules.css';
import FilterBar from '../FilterBar/FilterBar';
import MenuGrid from '../MenuGrid/MenuGrid';
import Cart from '../Cart/Cart';
import axios from "axios";
import { useParams } from 'react-router-dom';
import type { IRestaurant } from '../../types';

import { useCartContext } from '../../src/cartcontext';


const RestaurantProfile: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    

  const [isCartOpen, setIsCartOpen] = useState(false);

  const { id } = useParams();
  const { cartItems, addToCart, onUpdateQuantity: updateQuantity, setDeliveryPrice ,deliveryPrice } = useCartContext();
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`https://food-delivery-service-production.up.railway.app/restaurants/id/${id}`,
          {
            withCredentials: true,
          }
        );
        setRestaurant(res.data.data);
        setDeliveryPrice(res.data.data.deliveryPrice);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [id]);
  // console.log(restaurant);



  const handleCartToggle = () => {
    setIsCartOpen(prev => !prev);
  };




  return (
    <div className="App">
      { !restaurant ? <div className="empty">
        <img
          src="/loaginBar.png"
          style={{
            width: "300px",
            height: "200px"
          }}
          alt="no image"
        />
      </div> : (
        <>
       <TopBar 
 searchTerm=""
 setSearchTerm={() => {}}
/>
          <RestaurantHero
            restaurant={restaurant}
            isEditing={false}
            setRestaurant={setRestaurant}
          />
          <FilterBar
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <MenuGrid
            activeFilter={activeFilter}
            onAddToCart={addToCart}
            resturentId={restaurant._id}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            logoImage={restaurant.imageUrl}
          />
          <Cart
            isOpen={isCartOpen}
            onClose={handleCartToggle}
            items={Object.values(cartItems)}
            onUpdateQuantity={updateQuantity}
            deliveryPrice={deliveryPrice}
          />
        </>
      )}
    </div>
  );
};

export default RestaurantProfile;
