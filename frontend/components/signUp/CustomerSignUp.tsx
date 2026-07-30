import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import style from "./../login/Login.module.css";
import { useNavigate } from "react-router-dom";

const CustomerSignUp = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://food-delivery-service-production.up.railway.app/users/signup/customer", formData);
      console.log("Signup success:", res.data);
      navigate("/home");

    } catch (error: any) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Signup failed: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className={style.page}>
      <img src='../../../assets/loginBG.png' alt="loginBG" className={style.image} />
      <div className={style.Container} >
        <h3 className={style.title}>Customer Sign up</h3>
        <form onSubmit={handleSubmit}>
          <div className={style.formElement}>
            <label htmlFor="full_name" className={style.label}>Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className={style.input}
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>
          <div className={style.formElement}>
            <label htmlFor="email" className={style.label}>Email Address</label>
            <input
              type="text"
              id="email"
              name="email"
              className={style.input}
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={style.formElement}>
            <label htmlFor="password" className={style.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={style.input}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className={style.formElement}>
            <label htmlFor="phone_number" className={style.label}>Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              className={style.input}
              placeholder="Enter your phone Number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <button className={style.button} type="submit">SignUp</button>

          <div className={style.flex}>
            <p>
              Already have an account?{" "}
              <Link to={"/"} className={style.link}>
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignUp;
