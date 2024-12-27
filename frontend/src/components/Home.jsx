import { Link } from "react-router-dom";
import classes from "./Home.module.css";
import heroImg from "/heroImg.png";
import { MdVerified } from "react-icons/md";

function Home() {
  return (
    <>
      <section className={`container ${classes.hero}`}>
        <div className={classes.heroLeft}>
          <div className={classes.checkPoint}>
            <MdVerified />
            <p>No LLC Required, No Credit Check.</p>
          </div>
          <h1 className={classes.heroHeadingPrimary}>
            Welcome to YourBank Empowering Your <span>Financial Journey</span>
          </h1>
          <p>
            At YourBank, our mission is to provide comprehensive banking
            solutions that empower individuals and businesses to achieve their
            financial goals. We are committed to delivering personalized and
            innovative services that prioritize our customer&apos;s needs.
          </p>
          <button>
            <Link to={"signup"}>Open Account</Link>
          </button>
        </div>
        <div className={classes.heroRight}>
          <img
            src={heroImg}
            alt="bank employee explaining something to customer"
          />
        </div>
      </section>

      <section
        className={`container section ${classes.productsSection}`}
      ></section>
    </>
  );
}

export default Home;
