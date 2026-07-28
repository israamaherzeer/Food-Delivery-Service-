import { MenuItem } from "../models/MenuItem.js";
import { Restaurant } from "../models/Restaurant.js";

const getMenuItems = async () => {
  const items = await MenuItem.find();
  return items;
};
 const deleteMenuItem = async (id:string) => {
  const deleted = await MenuItem.findByIdAndDelete(id);
  if (!deleted) {
    const error = new Error("Menu item not found");
    
    throw error;
  }
}


 const addMenuItem = async (restaurantUserId:string, menuData:any) => {
  const restaurant = await Restaurant.findOne({ user: restaurantUserId });
  if (!restaurant) {
    throw new Error("Restaurant not found for this user");
  }

  const newMenuItem = new MenuItem({
    ...menuData,
    restaurant: restaurant._id,
  });

  return await newMenuItem.save();
};

export { getMenuItems, deleteMenuItem, addMenuItem };



