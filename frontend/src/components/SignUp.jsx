import { Link } from "react-router-dom";
import classes from "./SignUp.module.css";
import { useState } from "react";
import RegisterFace from "./face-recognition/RegisterFace";

function SignUp() {
  const [gotoFaceRecognition, setGotoFaceRecognition] = useState(false);
  const [userData, setUserData] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    console.log(data);
    const accNo =
      data.phone.slice(6, 11) + Math.floor(Math.random() * 999999).toString();

    if (!(data.password === data.confirmPassword)) {
      alert("password must be equal!");
      return;
    }

    const collectedUserData = {
      name: data.firstName + " " + data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      accountNumber: accNo,
    };
    // console.log(collectedUserData);
    setUserData(collectedUserData);
    setGotoFaceRecognition(true);
  }

  if (gotoFaceRecognition) {
    return <RegisterFace userId={userData.email} userInputData={userData} />;
  }

  return (
    <>
      <section className={`container section ${classes.signupCon}`}>
        <h2>Sign Up</h2>
        <p>
          Join our community today! Create an account to unlock exclusive
          features and personalized experiences.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            required
            placeholder="Enter First Name"
          />
          <input
            type="text"
            name="lastName"
            required
            placeholder="Enter Last Name"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Enter Your Email"
          />
          <input
            type="number"
            name="phone"
            required
            maxLength={10}
            minLength={10}
            placeholder="Enter Your PhoneNumber"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your Password"
          />
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm your Password"
          />
          <div className={classes.btnCon}>
            <button type="submit" className={classes.signupBtn}>
              {/* <Link to={""}>Sign Up</Link> */}
              Sign Up
            </button>
            <button className={classes.loginBtn}>
              <Link to={"/login"}>Login</Link>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default SignUp;
