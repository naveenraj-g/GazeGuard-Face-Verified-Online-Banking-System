import { Outlet } from "react-router-dom";
import HomeNavigation from "../components/HomeNavigation";
import classes from "./RootPage.module.css";

function RootPage() {
  return (
    <>
      <div className={classes.home}>
        <HomeNavigation />
        <main className={classes.mainCon}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default RootPage;
