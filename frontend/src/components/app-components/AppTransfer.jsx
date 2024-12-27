import { useContext } from "react";
import { UserContext } from "../../userCtx/UserContext";
import AppRightSdNav from "./AppRightSdNav";
import { convertUTCToIST } from "../../utils/utils";
import classes from "./AppTransfer.module.css";

function AppTransfer() {
  const { userData, setTransactions, userTransactions } =
    useContext(UserContext);
  const userProfileLogo = userData.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  async function handleAmountTransfer(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const transferData = Object.fromEntries(fd.entries());

    if (transferData.amount > userData.balance) {
      alert("Insufficient amount!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        throw { message: "Something went worng!" };
      }

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        const res = await fetch(
          `http://localhost:3000/api/transactions/${userData.email}`
        );
        const tnxData = await res.json();
        setTransactions(tnxData, true, transferData.amount);
        event.target.reset();
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
        title={"Transfer"}
        userName={userData.name}
      />
      <div className={classes.transferCon}>
        <div className={classes.accountDetails}>
          <h2>Savings Account</h2>
          <p className={classes.bal}>Balance</p>
          <h1>INR {userData.balance.toFixed(2)}</h1>
          <h3>Account Number</h3>
          <p className={classes.accNo}>{userData.accountNumber}</p>
          <h3>Account Owner</h3>
          <p>{userData.name}</p>
        </div>
        <div className={classes.transferFormCon}>
          <form onSubmit={handleAmountTransfer}>
            <h2>Transfer to</h2>
            <input
              type="text"
              placeholder="Your Email"
              value={userData.email}
              name="senderEmail"
              required
            />
            <input
              type="number"
              placeholder="Receiver Account Number"
              name="receiverAccountNumber"
              required
            />
            <input type="number" placeholder="Amount" name="amount" required />
            <input
              type="text"
              placeholder="Description"
              name="description"
              required
            />
            <div className={classes.btnCon}>
              <button type="submit">Continue Payment</button>
              <button type="reset">Clear</button>
            </div>
          </form>
        </div>
      </div>
      <div className={classes.recentTnx}>
        <h2>Recent Transfer</h2>
        <div className={classes.tnxs}>
          {userTransactions.map((tnx) => {
            const date = convertUTCToIST(tnx.createdAt);
            const isDep = tnx.sender.name !== userData.name;
            return (
              <div className={classes.tnx} key={tnx.referenceNumber}>
                <p>Ref No: {tnx.referenceNumber}</p>
                <div className={classes.tnxDetails}>
                  <div className={classes.mainDetails}>
                    <p className={classes.mainDet}>
                      {isDep ? tnx.sender.name : tnx.receiver.name}
                    </p>
                    <p className={classes.subDet}>{tnx.description}</p>
                  </div>
                  <div className={classes.subDetails}>
                    <p
                      className={`${classes.mainDet} ${
                        isDep ? classes.dep : classes.wit
                      }`}
                    >
                      {isDep ? "+₹" + tnx.amount : "-₹" + tnx.amount}
                    </p>
                    <p className={classes.subDet}>{date}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* <div className={classes.tnx}>
            <p>Ref No: TRX1728966024224</p>
            <div className={classes.tnxDetails}>
              <div className={classes.mainDetails}>
                <p className={classes.mainDet}>Naveen Raj</p>
                <p className={classes.subDet}>Gift</p>
              </div>
              <div className={classes.subDetails}>
                <p className={classes.mainDet}>Rs.200</p>
                <p className={classes.subDet}>15/10/2024</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AppTransfer;
