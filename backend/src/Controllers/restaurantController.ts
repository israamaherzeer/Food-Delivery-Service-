import mongoose from "mongoose";
import { Category } from "../models/Category.js";
import { MenuItem } from "../models/MenuItem.js";
import { Restaurant } from "../models/Restaurant.js";
import { AppError } from "../utils/errorHandler.js";

const getRestaurants = async () => {
    const restaurants = await Restaurant.find().populate("user categories");
    return restaurants

}

const getRestaurantById = async (id: string) => {

    const restaurant = await Restaurant.findById(id.trim())
        .populate("user categories")
        .populate({
            path: "menuItems",
            model: "MenuItem",
        });

    return restaurant
}

const getRestaurantByName = async (name: string) => {

    const restaurant = await Restaurant.findOne({ name })
        .populate("user categories")
        .populate({
            path: "menuItems",
            model: "MenuItem",
        });

    return restaurant
}

const getRestaurantsByCategory = async (categoryName: string) => {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
        throw (new AppError("Category not found", 404, true));
    }

    const restaurants = await Restaurant.find({ categories: category._id })
        .populate("user categories")
        .populate("menuItems");

    return restaurants;
};

const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
};

const isOpen = (opening: string, closing: string): boolean => {
    const now = new Date();
    const openTime = parseTime(opening);
    const closeTime = parseTime(closing);

    if (closeTime <= openTime) {
        return now >= openTime || now <= closeTime;
    }
    return now >= openTime && now <= closeTime;
};

const getRestaurantStatus = async (id: string) => {
    const restaurant = await Restaurant.findById(id.trim());
    if (!restaurant) return null;

    const open = isOpen(restaurant.opening_time, restaurant.closing_time);
console.log(new Date().toString());
    return {
        restaurantId: restaurant._id,
        name: restaurant.name,
        isOpen: open
    };
};

export {
    getRestaurants,
    getRestaurantById,
    getRestaurantsByCategory,
    getRestaurantByName,
    getRestaurantStatus
}