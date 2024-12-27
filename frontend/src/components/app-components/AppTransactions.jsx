import { useContext, useState } from "react";
import { UserContext } from "../../userCtx/UserContext";
import { Chart } from "react-google-charts";

import classes from "./AppTransactions.module.css";
import { convertUTCToIST } from "../../utils/utils";
import AppRightSdNav from "./AppRightSdNav";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { SiMastercard } from "react-icons/si";
import { FcSimCardChip } from "react-icons/fc";

function AppTransactions() {
  const { userData, userTransactions } = useContext(UserContext);
  const [transactionsTypeData, setTransactionsTypeData] = useState({
    type: "all",
    data: userTransactions,
  });
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

  const data = [
    ["Finance", "Money Flow"],
    ["income", income],
    ["expenses", expenses],
  ];

  // const options = {
  //   title: "Money Flow",
  // };

  const options = {
    title: "Money Flow",
    pieHole: 0.4, // Creates a Donut Chart. Does not do anything when is3D is enabled
    is3D: true, // Enables 3D view
    // slices: {
    //   1: { offset: 0.2 }, // Explodes the second slice
    // },
    pieStartAngle: 100, // Rotates the chart
    sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 14,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
  };

  function handleTransactionTypeData(type) {
    setTransactionsTypeData({
      type: type,
      data:
        type === "all"
          ? userTransactions
          : type === "expenses"
          ? amountSent
          : amountReceived,
    });
  }

  return (
    <>
      <div className={classes.appRightCon}>
        <AppRightSdNav
          profileImgName={userProfileLogo}
          title={"Transactions Overview"}
          userName={userData.name}
        />
        <div className={classes.tnxOverView}>
          <div className={classes.leftSid}>
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
            <Chart
              chartType="PieChart"
              data={data}
              options={options}
              width={"100%"}
              height={"400px"}
            />
          </div>

          <div className={classes.rightSid}>
            <h2 className={classes.rightSidHeading}>Transactions</h2>
            <ul className={classes.transTypes}>
              <li
                className={`${classes.transType} ${
                  transactionsTypeData.type === "all"
                    ? classes.transTypeActive
                    : undefined
                }`}
                onClick={() => handleTransactionTypeData("all")}
              >
                All
              </li>
              <li
                className={`${classes.transType} ${
                  transactionsTypeData.type === "expenses"
                    ? classes.transTypeActive
                    : undefined
                }`}
                onClick={() => handleTransactionTypeData("expenses")}
              >
                Expenses
              </li>
              <li
                className={`${classes.transType} ${
                  transactionsTypeData.type === "income"
                    ? classes.transTypeActive
                    : undefined
                }`}
                onClick={() => handleTransactionTypeData("income")}
              >
                Income
              </li>
            </ul>

            <div className={classes.tnxDetails}>
              {transactionsTypeData.data.map((data) => {
                const isIncome = data.receiver.name === userData.name;
                const userProfileLogo = data.receiver.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("");
                return (
                  <div className={classes.tnxDetail} key={data.referenceNumber}>
                    <div className={classes.userLogo}>{userProfileLogo}</div>
                    <div className={classes.userTnxDetail}>
                      <div className={classes.userTnxDetailLeft}>
                        <p className={classes.userTnxRefNo}>
                          Ref No: {data.referenceNumber}
                        </p>
                        <p className={classes.userTnxName}>
                          {isIncome ? data.sender.name : data.receiver.name}
                        </p>
                        <p className={classes.userTnxDesc}>
                          {data.description}
                        </p>
                      </div>
                      <div className={classes.userTnxDetailRight}>
                        <p
                          className={`${classes.userTnxAmount} ${
                            isIncome ? classes.income : classes.expense
                          }`}
                        >
                          {isIncome
                            ? `${"+₹" + data.amount}`
                            : `${"-₹" + data.amount}`}
                        </p>
                        <p className={classes.userTnxTime}>
                          {convertUTCToIST(data.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppTransactions;
