import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import classes from "./AppNavigation.module.css";

import { UserContext } from "../../userCtx/UserContext";
import { FaHome } from "react-icons/fa";
import { IoIosUndo } from "react-icons/io";
import { TbTransfer } from "react-icons/tb";
import { FaCreditCard } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";

function AppNavigation() {
  const navigate = useNavigate();
  const { handleReset } = useContext(UserContext);

  function handleLogOut() {
    handleReset();
    navigate("/");
  }

  return (
    <>
      <div className={classes.appNavCon}>
        <div className={classes.appNav}>
          <h1>YourBank</h1>
          <nav className={classes.nav}>
            <ul>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  to="dashboard"
                >
                  <FaHome />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  to="transfer"
                >
                  <IoIosUndo />
                  <p>Transfer</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  to="transactions"
                >
                  <TbTransfer />
                  <p>Transactions</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  to="accounts"
                >
                  <FaCreditCard />
                  <p>Accounts and Cards</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className={classes.appCTACon}>
          <ul>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                to="settings"
              >
                <RiUserSettingsFill />
                <p>Settings</p>
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogOut}>
                <IoLogOut />
                <p>Logout</p>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default AppNavigation;
