import style from "./Login.module.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/users/login", 
        { email, password },
        { withCredentials: true } 
      );
      if (response.data.status === "success") {
        console.log("success mais");
        const userType = response.data.data.type;
        console.log(userType);
        if (userType === "customer") {
          navigate("/home");
        } else if (userType === "restaurant") {
          navigate("/restaurant/dashboard");
        }else if (userType === "driver"){
           navigate("/driver/incoming-orders");
        }
        else console.log("not okkkkkk");
      }
    
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
   <div className={style.page}>
      <img src='../../../assets/loginBG.png' alt="loginBG" className={style.image} />

      <div className={style.Container}>
        <h3 className={style.title}>Login</h3>

        <form onSubmit={handleLogin}>
          <div className={style.formElement}>
            <label htmlFor="email" className={style.label}>Email Address</label>
            <input
              type="text"
              id="email"
              className={style.input}
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={style.formElement}>
            <label htmlFor="Password" className={style.label}>Password</label>
            <input
              type="password"
              id="Password"
              className={style.input}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className={style.button}>Login</button>

          <div className={style.flex}>
            {/* <a onClick={() => {}} className={style.link}>Forget Password?</a> */}
            <p>
              Don't have an account? <Link to="/signUp" className={style.link}>Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
