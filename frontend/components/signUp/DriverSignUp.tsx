import { Link, useNavigate } from "react-router-dom";
import style from "./../login/Login.module.css";
import { useState } from "react";
import axios from "axios";



const DriverSignUp = () => {

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
  
  });
const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://food-delivery-service-production.up.railway.app/users/signup/driver",
        formData
      );

      const loginResponse = await axios.post(
      "https://food-delivery-service-production.up.railway.app/users/login",
      {
        email: formData.email,
        password: formData.password
      },
      {
        withCredentials: true
      }
    );


    console.log(loginResponse.data);


    alert("Driver account created successfully");


    navigate("/driver/incoming-orders");;

    } catch (error: any) {
      console.log(error.response?.data || error.message);
      alert("Signup failed");
    }
  };


  return (
    <>
      <div className={style.page}>

        <img
          src="../../../assets/loginBG.png"
          alt="loginBG"
          className={style.image}
        />


        <div
          className={style.Container}
         
        >

          <h4 className={style.title}>
            Driver Sign up
          </h4>


          <form 
            className={style.form}
            onSubmit={handleSubmit}
          >


            <div className={style.formElement}>
              <label className={style.label}>
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                className={style.input}
                placeholder="Enter your full name"
                onChange={handleChange}
              />
            </div>



            <div className={style.formElement}>
              <label className={style.label}>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                className={style.input}
                placeholder="Enter your Email"
                onChange={handleChange}
              />
            </div>




            <div className={style.formElement}>
              <label className={style.label}>
                Password
              </label>

              <input
                type="password"
                name="password"
                className={style.input}
                placeholder="Enter your password"
                onChange={handleChange}
              />
            </div>




            <div className={style.formElement}>
              <label className={style.label}>
                Phone Number
              </label>

              <input
                type="text"
                name="phone_number"
                className={style.input}
                placeholder="Enter your phone number"
                onChange={handleChange}
              />
            </div>





            {/* <div className={style.formElement}>
              <label className={style.label}>
                City
              </label>

              <input
                type="text"
                name="city"
                className={style.input}
                placeholder="Enter city"
                onChange={handleChange}
              />
            </div>
 */}




            {/* <div className={style.formElement}>
              <label className={style.label}>
                Vehicle Type
              </label>


              <select
                name="vehicle_type"
                className={style.input}
                onChange={handleChange}
              >

                <option value="bike">
                  Bike
                </option>

                <option value="car">
                  Car
                </option>

                <option value="scooter">
                  Scooter
                </option>

                <option value="other">
                  Other
                </option>


              </select>

            </div>
 */}



            <button 
              type="submit"
              className={style.button}
            >
              Sign Up
            </button>



            <div className={style.flex}>

              <p>
                Already have an account?{" "}

                <Link 
                  to={"/"} 
                  className={style.link}
                >
                  Log In
                </Link>

              </p>

            </div>


          </form>


        </div>

      </div>
    </>
  );
};


export default DriverSignUp;

