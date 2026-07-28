/* eslint-disable react-hooks/rules-of-hooks */
import Login from "../components/login/Login.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "../components/signUp/RoleSignUp.tsx";
import CustomerSignUp from "../components/signUp/CustomerSignUp.tsx";
import RestaurantSignUp from "../components/signUp/RestaurantSignUp.tsx";
import DriverSignUp from "../components/signUp/DriverSignUp.tsx";
import CustomerProfile from "../components/profile/CustomerProfile/CustomerProfile.tsx";
import DriverProfile from "../components/profile/delivery/driverProfile";
import Home from "../components/home/Home.tsx";
import RestaurantDashboardPage from "../components/RestaurantDashboardPage/RestaurantDashboardPage.tsx";
import MenuManagementPage from "../components/MenuManagementPage/MenuManagementPage.tsx";
import RestaurantProfile from "../components/RestaurantsProfile/RestaurantProfile.tsx";
import DriverIncomingOrdersPage from "../components/DriverIncomingOrdersPage/DriverIncomingOrdersPage";

import Cart from "../components/Cart/Cart.tsx";
import { useCartContext } from "./cartcontext.tsx";
import ManageRestaurantProfile from '../components/profile/ManageRestaurantprofile/ManagemenurestauranrtProfile';

const App = () => {
  
const {
  isOpen: isCartOpen,
  onClose: closeCart,
  cartItems,
  onUpdateQuantity,
} = useCartContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/customerSignUp" element={<CustomerSignUp />} />
        <Route path="/restaurantSignUp" element={<RestaurantSignUp />} />
        <Route path="/driverSignUp" element={<DriverSignUp />} />

        <Route
          path="/driver/incoming-orders"
          element={<DriverIncomingOrdersPage />}
        />
        <Route
          path="/restaurant/dashboard"
          element={<RestaurantDashboardPage />}
        />

        <Route
          path="/restaurant/dashboard"
          element={<RestaurantDashboardPage />}
        />

        <Route path="/customerProfile" element={<CustomerProfile />} />
        <Route path="/driverProfile" element={<DriverProfile />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/restaurant/menu-management"
          element={<MenuManagementPage />}
        />
        <Route path="/restaurant/:id" element={<RestaurantProfile />} />
        <Route path="/restaurant/profile" element={<ManageRestaurantProfile />} />
      </Routes>
      <Cart
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={Object.values(cartItems)}
        onUpdateQuantity={onUpdateQuantity}
      />
    </BrowserRouter>
  );
};

export default App;

