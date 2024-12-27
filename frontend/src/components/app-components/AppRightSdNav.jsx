import classes from "./AppRightSdNav.module.css";

function AppRightSdNav({ title, profileImgName, userName }) {
  return (
    <nav className={classes.nav}>
      <h1>{title}</h1>
      <div className={classes.profileCon}>
        <div className={classes.profilePicCon}>
          <p>{profileImgName}</p>
        </div>
        <p>{userName}</p>
      </div>
    </nav>
  );
}

export default AppRightSdNav;
