import { Outlet } from "react-router-dom";
import AppNavigation from "../components/app-components/AppNavigation";
import classes from "./AppRootPage.module.css";

function AppRootPage() {
  return (
    <>
      <div className={`container ${classes.containerCon}`}>
        <AppNavigation />
        <main style={{ height: "100vh", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AppRootPage;
