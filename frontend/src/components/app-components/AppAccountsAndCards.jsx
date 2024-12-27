import { useContext } from "react";

import { UserContext } from "../../userCtx/UserContext";
import classes from "./AppAccountsAndCards.module.css";
import { convertUTCToIST } from "../../utils/utils";
import AppRightSdNav from "./AppRightSdNav";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { SiMastercard } from "react-icons/si";
import { FcSimCardChip } from "react-icons/fc";

function AppAccountsAndCards() {
  const { userData, userTransactions } = useContext(UserContext);

  const userProfileLogo = userData.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  const amountSent = [];
  const amountReceived = [];
  let income = 0;
  let expenses = 0;
  userTransactions.forEach((tnx) => {
    if (userData?.email === tnx?.sender?.email) {
      amountSent.push(tnx);
      expenses += tnx.amount;
    } else {
      amountReceived.push(tnx);
      income += tnx.amount;
    }
  });

  return (
    <div className={classes.appRightCon}>
      <AppRightSdNav
        profileImgName={userProfileLogo}
        title={"Accounts and Cards"}
        userName={userData.name}
      />

      <h2 className={classes.accountsAndCardTitle}>My accounts</h2>
      <div className={classes.cards}>
        <div className={classes.accountCard}>
          <p className={classes.accType}>Savings Account</p>
          <p className={classes.accCardDesc}>Balance</p>
          <h2>INR {userData.balance}</h2>
          <div className={classes.incExp}>
            <div className={classes.income}>
              <div className={classes.incExpLogo}>
                <IoMdArrowDropup className={classes.incomeIcon} />
                <p>Income</p>
              </div>
              <p>INR {income}</p>
            </div>
            <div className={classes.incExpBreakThrough}></div>
            <div className={classes.income}>
              <div className={classes.incExpLogo}>
                <IoMdArrowDropdown className={classes.expIcon} />
                <p>Expenses</p>
              </div>
              <p>INR {expenses}</p>
            </div>
          </div>
        </div>

        <div className={classes.accountDetailsCard}>
          <div className={classes.accountDetailsCardLogo}>
            <SiMastercard className={classes.accountDetailCardLogo} />
            <FcSimCardChip />
          </div>
          <p className={classes.accNoLabel}>Account Number</p>
          <h2 className={classes.accNo}>{userData.accountNumber}</h2>
          <p className={classes.userName}>UserName: {userData.name}</p>
          <p className={classes.createdDateLabel}>Account Created At:</p>
          <p className={classes.createdDate}>
            {convertUTCToIST(userData.createdAt)}
          </p>
        </div>
      </div>

      <h2 className={classes.accountsAndCardTitle}>My cards</h2>
      <div className={classes.myCards}>
        <p>Coming soon...</p>
      </div>
    </div>
  );
}

export default AppAccountsAndCards;
