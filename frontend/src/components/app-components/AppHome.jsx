import { useContext } from "react";
import { UserContext } from "../../userCtx/UserContext";
import classes from "./AppHome.module.css";

function AppHome() {
  const { userData } = useContext(UserContext);
  const userProfileLogo = userData.name
    .split(" ")
    .map((word) => word[0])
    .join("");
  console.log(userProfileLogo);

  return (
    <>
      <div className={classes.appHomeCon}>
        <div className={classes.appHomeUser}>
          <div className={classes.userLogoCon}>
            <p>{userProfileLogo}</p>
          </div>
          <p className={classes.userName}>{userData.name}</p>
          <h1>
            Welcome to <span className={classes.bankNameSpc}>&#123;</span>
            YourBank<span className={classes.bankNameSpc}>&#125;</span>
          </h1>
        </div>
      </div>
    </>
  );
}

export default AppHome;
