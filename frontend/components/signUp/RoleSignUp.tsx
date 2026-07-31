import style from "./../login/Login.module.css";

import { Link } from "react-router";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <>
     <div className={style.page}>
        <img
          src='/loginBG.png'
          alt="loginBG"
          className={style.image}
        />
        <div className={style.Container}>
          <h3 className={style.title}>Sign up</h3>
          <p className={style.header}>Select Your Role</p>

          <button
            className={style.button}
            onClick={() => {
              navigate("/customerSignUp");
            }}
          >
            Customer
          </button>
          <button
            className={style.button}
            onClick={() => {
              navigate("/restaurantSignUp");
            }}
          >
            Restaurant
          </button>
          <button
            className={style.button}
            onClick={() => {
              navigate("/driverSignUp");
            }}
          >
            Delivery Driver
          </button>

          <div className={style.flex}>
            <p>
              Already have an account?{" "}
              <Link to={"/"} className={style.link}>
                Log In
              </Link>
              
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;