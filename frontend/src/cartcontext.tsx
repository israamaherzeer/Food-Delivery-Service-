import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from 'axios';
import type { MenuItem, CartItem } from "../types";
import Notification from '../components/Notification/Notification.js';

interface CartContextType {
  cartItems: { [id: string]: CartItem };
  totalCount: number;
  isOpen: boolean;
  deliveryPrice: number;
  setDeliveryPrice: (price: number) => void;
  addToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  onClose: () => void;
  toggleCart: () => void;
   clearCart:()=>void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

const API_BASE_URL = 'https://food-delivery-service-production.up.railway.app/api/cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<{ [id: string]: CartItem }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [moreThanOneRestaurant , setMoreThanOneRestaurant] = useState(false);


  const fetchCart = async () => {
    try {
     const token = localStorage.getItem("token");

const res = await axios.get(API_BASE_URL, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      const itemsArray: CartItem[] = res.data.data.items || [];

      const itemsObj = itemsArray.reduce((acc, item) => {
     acc[item.menuItem._id] = item;
        return acc;
      }, {} as { [id: string]: CartItem });

      setCartItems(itemsObj);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };  

  useEffect(() => {
    fetchCart();
  }, [isCartOpen]);

const handleAddToCart = async (item: MenuItem) => {

  try {
    const res = await axios.post(
      `${API_BASE_URL}/add`,
      {
        productId: item._id,
        quantity: 1,
      },
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const itemsArray = res.data.data.items || [];

    const itemsObj = itemsArray.reduce((acc: any, cartItem: any) => {
      acc[cartItem.menuItem._id] = cartItem;
      return acc;
    }, {});

    setCartItems(itemsObj);

  } catch (error) {
    console.error(error);
    fetchCart();
  }
};

  const onUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      try {
      
        await axios.delete(`${API_BASE_URL}/${id}`,{
 headers:{
  Authorization:`Bearer ${localStorage.getItem("token")}`
 }
});
        setCartItems(prev => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/update`, {
        productId: id,
        quantity,
      }, { withCredentials: true });

      const itemsArray: CartItem[] = res.data.data.items || [];
      const itemsObj = itemsArray.reduce((acc, item) => {
         acc[item.menuItem._id] = item;

        return acc;
      }, {} as { [id: string]: CartItem });
      setCartItems(itemsObj);

    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const totalCount = Object.values(cartItems).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <>
    <CartContext.Provider
      value={{
        cartItems,
        deliveryPrice,
        setDeliveryPrice,
        addToCart: handleAddToCart,
        onUpdateQuantity,
        totalCount,
        isOpen: isCartOpen,
        openCart,
        onClose: closeCart,
        toggleCart,
        clearCart: () => {
  setCartItems({});
},
      }}
    >
      {children}
    </CartContext.Provider>
    
    { moreThanOneRestaurant &&
       <Notification
            Name={`Cart can only contain items from one restaurant!`}
            isDelete={false}
            onConfirm={()=>{setMoreThanOneRestaurant(false)}}
            onCancel={()=>{}}
        />
       
       
       }
    </>

    
  );
};
