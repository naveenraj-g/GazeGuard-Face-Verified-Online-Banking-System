import { NavLink, useNavigate } from "react-router-dom";

import logo from "/logo.png";
import classes from "./HomeNavigation.module.css";

function HomeNavigation() {
  const navigate = useNavigate();

  function gotoHome() {
    navigate("/");
  }

  return (
    <>
      <section className={classes.navSection}>
        <nav className={`container ${classes.nav}`}>
          <div className={classes.bankLogoName} onClick={gotoHome}>
            <img src={logo} alt="logo" className={classes.logoImg} />
            <h1 className={classes.bankName}>YourBank</h1>
          </div>
          <div className={classes.navCTA}>
            <button className={classes.navCTABtn}>
              <NavLink
                to={"signup"}
                className={({ isActive }) =>
                  isActive
                    ? `${classes.active} ${classes.navCTALink}`
                    : classes.navCTALink
                }
              >
                Sign Up
              </NavLink>
            </button>
            <button className={classes.navCTABtn}>
              <NavLink
                to={"login"}
                className={({ isActive }) =>
                  isActive
                    ? `${classes.active} ${classes.navCTALink}`
                    : classes.navCTALink
                }
              >
                Login
              </NavLink>
            </button>
          </div>
        </nav>
      </section>
    </>
  );
}

export default HomeNavigation;
