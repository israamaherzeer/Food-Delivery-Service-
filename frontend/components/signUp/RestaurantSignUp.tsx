import { useEffect, useState } from "react";
import axios from "axios";
import style from "./RestaurantSignUp.module.css";
import { Link, useNavigate } from "react-router-dom";

const RestaurantSignUp = () => {

  interface ICategory {
    _id: string;
    name: string;
  }


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    location: "",
    opening_time: "",
    closing_time: "",
    categories: [] as string[]
  });


  const [categories, setCategories] = useState<ICategory[]>([]);
  const [image, setImage] = useState<File | null>(null);

const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    const data = new FormData();


    Object.entries(formData).forEach(([key,value])=>{

      if(key !== "categories"){
        data.append(key,value as string);
      }

    });


    formData.categories.forEach(category=>{

      data.append("categories",category);

    });



    if(image){

      data.append("image",image);

    }



    try {

      await axios.post(
        "http://localhost:5000/users/signup/restaurant",
        data,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      );


     const loginResponse = await axios.post(
    "http://localhost:5000/users/login",
    {
      email: formData.email,
      password: formData.password
    },
    {
      withCredentials:true
    }
  );


  console.log(loginResponse.data);


  navigate("/restaurant/dashboard");


    }  catch(error:any){

  alert(
    error.response?.data?.message ||
    "Something went wrong. Please try again."
  );

  console.log(error.response?.data);

}

  };




  useEffect(()=>{

    axios.get(
      "http://localhost:5000/categories"
    )
    .then(res=>{

      setCategories(res.data.data);

    });


  },[]);





  return (

    <div className={style.restaurantPage}>


      <img
        src="../../../assets/loginBG.png"
        className={style.restaurantImage}
        alt="background"
      />



      <div className={style.restaurantContainer}>


        <h6 className={style.restaurantTitle}>
          Restaurant Sign Up
        </h6>



        <form
          className={style.restaurantForm}
          onSubmit={handleSubmit}
        >



          <div className={style.formElement}>

            <label className={style.label}>
              Restaurant Name
            </label>

            <input
              className={style.input}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter restaurant name"
            />

          </div>




          <div className={style.formElement}>

            <label className={style.label}>
              Email
            </label>

            <input
              className={style.input}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

          </div>





          <div className={style.formElement}>

            <label className={style.label}>
              Password
            </label>

            <input
              type="password"
              className={style.input}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

          </div>





          <div className={style.formElement}>

            <label className={style.label}>
              Restaurant Image
            </label>


            <input
              type="file"
              accept="image/*"
              className={style.fileInput}
              onChange={(e)=>{

                if(e.target.files){

                  setImage(e.target.files[0]);

                }

              }}
            />

          </div>






          <div className={style.formElement}>

            <label className={style.label}>
              Phone Number
            </label>


            <input
              className={style.input}
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone number"
            />

          </div>






          <div className={style.formElement}>

            <label className={style.label}>
              Location
            </label>


            <input
              className={style.input}
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Restaurant location"
            />

          </div>







          <div className={style.timeRow}>


            <div className={style.formElement}>

              <label className={style.label}>
                Opening Time
              </label>

              <input
                type="time"
                className={style.input}
                name="opening_time"
                value={formData.opening_time}
                onChange={handleChange}
              />

            </div>




            <div className={style.formElement}>

              <label className={style.label}>
                Closing Time
              </label>

              <input
                type="time"
                className={style.input}
                name="closing_time"
                value={formData.closing_time}
                onChange={handleChange}
              />

            </div>



          </div>







          <div className={style.formElement}>


            <label className={style.label}>
              Categories
            </label>



            <select

              multiple

              className={style.categorySelect}

              value={formData.categories}


              onChange={(e)=>{


                const selected =
                Array.from(
                  e.target.selectedOptions,
                  option=>option.value
                );


                setFormData({

                  ...formData,

                  categories:selected

                });


              }}

            >


              {
                categories.map(cat=>(

                  <option
                    key={cat._id}
                    value={cat._id}
                  >

                    {cat.name}

                  </option>

                ))
              }


            </select>



          </div>






          <button
            className={style.button}
            type="submit"
          >

            Sign Up

          </button>





          <p className={style.footer}>

            Already have an account?{" "}

            <Link
              to="/"
              className={style.link}
            >
              Login
            </Link>

          </p>



        </form>


      </div>


    </div>

  );

};


export default RestaurantSignUp;