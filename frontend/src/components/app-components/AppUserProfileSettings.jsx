import { useContext, useState } from "react";
import { UserContext } from "../../userCtx/UserContext";

import AppRightSdNav from "./AppRightSdNav";
import classes from "./AppUserProfileSettings.module.css";

function AppUserProfileSettings() {
  const { userData, updateUserProfile } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const userProfileLogo = userData.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  async function handleUpdateUserProfile(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const transferData = Object.fromEntries(fd.entries());
    console.log(transferData);

    if (
      transferData.phone.trim().length < 10 &&
      !transferData.phone.trim() === ""
    ) {
      alert("Phone Number nust be in 10 digits");
      return;
    }

    const userDatas = {
      email: userData.email,
      name: transferData.name.trim() === "" ? userData.name : transferData.name,
      phone:
        transferData.phone.trim() === "" ? userData.phone : transferData.phone,
    };

    try {
      const response = await fetch("http://localhost:3000/api/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDatas),
      });

      if (!response.ok) {
        throw { message: "Something went worng!" };
      }

      const data = await response.json();

      if (data.success) {
        updateUserProfile(data.user.name, data.user.phone);
        setIsEdit(false);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className={classes.appRightCon}>
      <AppRightSdNav
        profileImgName={userProfileLogo}
        title={"Account Settings"}
        userName={userData.name}
      />

      <div className={classes.userProfileLogo}>
        <p>{userProfileLogo}</p>
      </div>
      <form onSubmit={handleUpdateUserProfile}>
        <div className={classes.userDetails}>
          <p>
            Name:{" "}
            {isEdit ? (
              <input name="name" type="text" placeholder="Enter name" />
            ) : (
              userData.name
            )}
          </p>
          <p>
            Phone No:{" "}
            {isEdit ? (
              <input
                name="phone"
                type="number"
                maxLength="10"
                placeholder="Enter 10 digit Ph.No"
              />
            ) : (
              userData.phone
            )}
          </p>
          <p>Email: {userData.email}</p>
          <p>Account Number: {userData.accountNumber}</p>
        </div>
        <div className={classes.profileCta}>
          {!isEdit && (
            <button type="button" onClick={() => setIsEdit(true)}>
              Edit Profile
            </button>
          )}
          {isEdit && <button>Save</button>}
          {isEdit && (
            <button type="button" onClick={() => setIsEdit(false)}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AppUserProfileSettings;
