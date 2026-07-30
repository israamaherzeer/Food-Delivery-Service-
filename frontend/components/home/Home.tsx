import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import Resturant from "../resturant/Resturant";
import style from "./Home.module.css";

import type { IRestaurant } from "../../types.ts";
import TopBar from "../TopBar/TopBar.tsx";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  
  faLocationDot,
  faPhone,
 
} from "@fortawesome/free-solid-svg-icons";

const categories = [
  "All",
  "Pizza",
  "Fast Food",
  "Breakfast",
  "Traditional",
  "Seafood",
  "Shaweerma"
  
];



const Home = () => {
  
   const restaurantRef = useRef<HTMLDivElement>(null);

const [restaurants,setRestaurants] =
useState<IRestaurant[]>([]);

const [selectedCategory,setSelectedCategory]
=useState("All");

const [searchTerm,setSearchTerm]
=useState("");

const [loading,setLoading]
=useState(true);

useEffect(() => {
  console.log("Selected:", selectedCategory);
}, [selectedCategory]);


useEffect(()=>{


const fetchRestaurants = async()=>{

try{

setLoading(true);



const url =
  selectedCategory === "All"
    ? "https://food-delivery-service-production.up.railway.app/restaurants"
    : `https://food-delivery-service-production.up.railway.app/restaurants/category?category=${encodeURIComponent(selectedCategory)}`;

const res =
await axios.get(url,{
withCredentials:true
});


const data=res.data.data;



const restaurantsWithStatus =
await Promise.all(

data.map(async(rest:any)=>{

try{

const status =
await axios.get(
`https://food-delivery-service-production.up.railway.app/restaurants/status/${rest._id}`,
{
withCredentials:true
}
);


return{

...rest,

isOpen:
status.data?.data?.isOpen || false

};


}catch{

return{
...rest,
isOpen:false
};

}


})

);



setRestaurants(restaurantsWithStatus);


}catch(err){

console.log(err);

}

finally{

setLoading(false);

}


};


fetchRestaurants();


},[selectedCategory]);





const filteredRestaurants =
restaurants.filter((restaurant)=>{


const search =
searchTerm.toLowerCase();



if(search==="open")
return restaurant.isOpen;


if(search==="close")
return !restaurant.isOpen;



return (

restaurant.name
.toLowerCase()
.includes(search)

||
restaurant.location
?.toLowerCase()
.includes(search)

);


});

useEffect(()=>{

 const timer = setTimeout(()=>{

   if(searchTerm.trim() !== ""){

     restaurantRef.current?.scrollIntoView({
       behavior:"smooth",
       block:"start"
     });

   }

 },700);


 return ()=>clearTimeout(timer);


},[searchTerm]);




return (

<div className={style.container}>


<TopBar
searchTerm={searchTerm}
setSearchTerm={setSearchTerm}
/>






<motion.section
  className={style.hero}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>

  {/* Full Screen Background Image */}

  <div className={style.heroImage}>

    <motion.img
      src="/food.png"
      alt="Delicious Food"
      animate={{
        scale: [1, 1.08, 1]
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

  </div>


  {/* Dark Overlay */}

  <div className={style.overlay}></div>



  {/* Text Content */}

  <motion.div

    className={style.heroContent}

    initial={{
      opacity: 0,
      y: 40
    }}

    animate={{
      opacity: 1,
      y: 0
    }}

    transition={{
      duration: 1,
      delay: 0.3
    }}

  >


<div className={style.Content}>

<h1 className={style.titleWrapper}>

<span className={style.whiteText}>
Delicious Food,
</span>

<br/>

<span className={style.redText}>
Delivered Fast
</span>

</h1>


<p className={style.blacktext}>
Your favorite meals from the best restaurants in your area!
</p>


<div className={style.heroButtons}>

<motion.button
className={style.primaryBtn}
whileHover={{scale:1.05}}
whileTap={{scale:.95}}
onClick={()=>
restaurantRef.current?.scrollIntoView({
behavior:"smooth"
})
}
>

Browse Restaurants

</motion.button>



</div>


</div>



   



  </motion.div>



</motion.section>





{/* CATEGORIES */}


<motion.div

className={style.categories}

initial={{
opacity:0,
y:30
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

>


{
categories.map(category=>(


<motion.div

whileHover={{
scale:1.08
}}

whileTap={{
scale:.95
}}


key={category}

className={

`${style.category}

${category===selectedCategory
?
style.active
:""}

`

}


onClick={()=>setSelectedCategory(category)}

>


{category}


</motion.div>


))
}


</motion.div>







{/* RESTAURANTS */}



<section className={style.restaurantSection}  ref={restaurantRef}>
   


 <motion.div className={style.Resturants}>
  <div className={style.sectionTitle}>


<p>
Discover the best restaurants near you.
</p>

</div>
</motion.div>



{
loading?


<div className={style.loading}>

<div></div>
<div></div>
<div></div>

</div>


:

filteredRestaurants.length===0?


<div className={style.empty}>

No restaurants found 

</div>



:

<motion.div

className={style.Resturants}

initial="hidden"

whileInView="visible"

viewport={{
once:true
}}

variants={{

visible:{

transition:{
staggerChildren:.15
}

}


}}



>
 



{
filteredRestaurants.map((restaurant,index)=>(
  

<motion.div


key={index}

variants={{

hidden:{
opacity:0,
y:60,
scale:.9
},

visible:{
opacity:1,
y:0,
scale:1,

transition:{
duration:.5
}

}

}}

whileHover={{
y:-8
}}

>


<Resturant
  resturant={restaurant}
/>

</motion.div>


))
}


</motion.div>


}




</section>



<footer className={style.footer}>

  <div className={style.footerContainer}>

    {/* Logo & Description */}

    <div className={style.footerSection}>

      <h2 className={style.footerLogo}>
        Food<span>Hub</span>
      </h2>

      <p>
        Discover the best restaurants around you and enjoy
        fast, fresh, and reliable food delivery anytime.
      </p>

    </div>



    {/* Quick Links */}

    <div className={style.footerSection}>

      <h3>Quick Links</h3>

      <a href="#">Home</a>
      <a href="#">Restaurants</a>
      <a href="#">Categories</a>

    </div>



    {/* Support */}

    <div className={style.footerSection}>

      <h3>Support</h3>

      <a href="#">Contact Us</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms & Conditions</a>

    </div>



    {/* Contact */}

    <div className={style.footerSection}>

      <h3>Contact</h3>

      <p>
          <label className={style.label}>
                        <FontAwesomeIcon icon={faLocationDot} /> {" "}
                      </label>
         Hebron, Palestine</p>
      <p> 
           <label className={style.label}>
                        <FontAwesomeIcon icon={faPhone} /> 
                      </label>
        +970 569724492 
                      </p>
     

    </div>

  </div>



  <div className={style.footerBottom}>

    © 2026 FoodHub. All rights reserved.

  </div>

</footer>
</div>



);

};


export default Home;