import { createContext, useState, useCallback } from "react";

export const UserContext = createContext({
  userData: "",
  userTransactions: "",
  setUserDatas() {},
  setTransactions() {},
  handleReset() {},
  updateUserProfile() {},
});

function UserContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState({});
  const [userTransactions, setUserTransactions] = useState([]);
  console.log(userDetails);
  console.log(userTransactions);

  function setUserDatas(userData) {
    setUserDetails({
      ...userData,
    });
  }

  function setTransactions(transactions, isAmountUpdate = false, amount = 0) {
    setUserTransactions(transactions);
    if (isAmountUpdate) {
      setUserDetails((prevState) => {
        const newU = { ...prevState };
        newU.balance = newU.balance - amount;
        return newU;
      });
    }
  }

  function handleReset() {
    setUserDetails({});
    setUserTransactions([]);
  }

  function updateUserProfile(name, phone) {
    setUserDetails((prevState) => {
      const newData = {
        ...prevState,
        name: name,
        phone: phone,
      };

      return newData;
    });
  }

  const ctxValue = {
    userData: userDetails,
    userTransactions,
    setUserDatas,
    setTransactions,
    handleReset,
    updateUserProfile,
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
}

export default UserContextProvider;
