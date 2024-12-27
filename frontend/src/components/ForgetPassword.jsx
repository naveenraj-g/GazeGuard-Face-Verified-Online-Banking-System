import { useState } from "react";
import classes from "./ForgetPassword.module.css";
import FaceVerificationForPassChange from "./face-recognition/FaceVerificationForPassChange";

function ForgetPassword() {
  const [emailISMatch, setEmailIsMatch] = useState({
    data: {},
    isEmailMatch: false,
  });
  async function handleChangePassword(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    setEmailIsMatch((preState) => {
      return {
        ...preState,
        data,
      };
    });

    try {
      const response = await fetch("http://localhost:3000/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const resData = await response.json();
      if (!resData.success) {
        alert("Enter a valid email");
        setEmailIsMatch((prevState) => {
          return {
            ...prevState,
            isEmailMatch: false,
          };
        });
        return;
      }
      setEmailIsMatch((prevState) => {
        return {
          ...prevState,
          isEmailMatch: true,
        };
      });
    } catch (err) {
      console.error("Error during request: " + err);
      setEmailIsMatch((prevState) => {
        return {
          ...prevState,
          isEmailMatch: false,
        };
      });
    }
  }

  if (emailISMatch.isEmailMatch) {
    return (
      <FaceVerificationForPassChange
        email={emailISMatch.data.email}
        newPassword={emailISMatch.data.password}
      />
    );
  }

  return (
    <>
      <section className={`container section ${classes.signupCon}`}>
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            required
          />
          <button className={classes.passChange}>Change Password</button>
        </form>
      </section>
    </>
  );
}

export default ForgetPassword;
