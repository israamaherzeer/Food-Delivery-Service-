export interface IRestaurant {
  _id: string;
  name: string;
  categories: string[] | { name: string }[];
  rating?: number;
  deliveryTime?: string;
  priceRange?: string;
  minOrder?: string;
  imageUrl: string;
  deliveryPrice: number;
  location: string;
  opening_time: string;
  closing_time: string;
  totalRating: number;
  phone_number:number
  
}
 export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
   type: string;
   sizes?: string[];
  restaurant: string;
}
   export interface ICustomer {
     email: string;
     password: string;
     full_name: string;
     phone_number: string;
    }
    export type vehicleType = "bike" | "car" | "scooter" | "other";
     export interface IDriver {
       email: string;
       password: string;
       full_name: string;
       phone_number: string;
       availability: boolean;
       vehicle_type: vehicleType;
       city: string;
}
//  export interface CartItem {
//    _id: string;
//    name: string;
//    price: number;
//    quantity: number;
//    image_url: string;
   
//  }
export interface CartItem {
  _id: string;
  quantity: number;
  menuItem: MenuItem;
}
 export interface OrderItem {
   id: string;
   quantity: number;
   price: number;
   name: string;
 }

 export interface Order {
   _id: string;
   orderNumber: string;
   full_name: string;
   phone_number: string;
   address: string;
   timeAgo: string;
   menuItem: OrderItem[];
   total_price: number;
   payment_method: string;
   driverInfo?: {
     name: string;
     phoneNumber: string;
   };
   status: "Pending" | "In Preparation" | "Out for Delivery" | "Delivered" |"Searching for driver";
 }






