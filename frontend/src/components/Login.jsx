import { Link } from "react-router-dom";
import classes from "./Login.module.css";
import { useState } from "react";
import VerifyFace from "./face-recognition/VerifyFace";

function Login() {
  const [gotoVerifyFace, setGotoVerifyFace] = useState(false);
  const [loginData, setLoginData] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    const lgData = {
      email: data.email,
      password: data.password,
    };
    setLoginData(lgData);
    setGotoVerifyFace(true);
  }

  if (gotoVerifyFace) {
    return <VerifyFace userId={loginData.email} loginData={loginData} />;
  }

  return (
    <section className={`container section ${classes.signupCon}`}>
      <h2>Login</h2>
      <p>Welcome back! Please log in to access your account.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Enter Your Email" />
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
        />
        <div className={classes.gotoCon}>
          <Link to={"/change-password"} className={classes.forgetPass}>
            Forget Password?
          </Link>
          <div className={classes.btnCon}>
            <button className={classes.loginBtn}>
              {/* <Link to={""}>Login</Link> */}
              Login
            </button>
            <button className={classes.signupBtn}>
              <Link to={"/signup"}>Sign Up</Link>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default Login;
