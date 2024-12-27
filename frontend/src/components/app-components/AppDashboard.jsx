import { useContext } from "react";
import { UserContext } from "../../userCtx/UserContext";
import classes from "./AppDashboard.module.css";
import AppRightSdNav from "./AppRightSdNav";
import { convertUTCToIST } from "../../utils/utils";

import { Chart } from "react-google-charts";

function AppDashboard() {
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

  console.log(amountSent);

  const amountSentByTime = amountSent.map((data) => {
    return {
      name: data.receiver.name,
      amount: data.amount,
      timestamp: convertUTCToIST(data.timestamp),
    };
  });

  const amountReceivedByTime = amountReceived.map((data) => {
    return {
      name: data.sender.name,
      amount: data.amount,
      timestamp: convertUTCToIST(data.timestamp),
    };
  });

  console.log(amountSentByTime, amountReceivedByTime);

  const incExpCollected = {};
  amountSentByTime.slice(0, 15).forEach((data) => {
    let date = data.timestamp.slice(0, 5);
    if (date[4] == "/") {
      date = date.slice(0, 4);
    }

    if (incExpCollected.hasOwnProperty(date)) {
      incExpCollected[date][1] += data.amount;
    } else {
      incExpCollected[date] = [0, data.amount];
    }
  });

  amountReceivedByTime.slice(0, 15).forEach((data) => {
    let date = data.timestamp.slice(0, 5);
    if (date[4] == "/") {
      date = date.slice(0, 4);
    }

    if (incExpCollected.hasOwnProperty(date)) {
      incExpCollected[date][0] += data.amount;
    } else {
      incExpCollected[date] = [data.amount, 0];
    }
  });

  const amountSendToPeople = {};
  const amountReceivedFromPeople = {};

  amountSentByTime.forEach((data) => {
    if (amountSendToPeople.hasOwnProperty(data.name)) {
      amountSendToPeople[data.name] += data.amount;
    } else {
      amountSendToPeople[data.name] = data.amount;
    }
  });

  amountReceivedByTime.forEach((data) => {
    if (amountReceivedFromPeople.hasOwnProperty(data.name)) {
      amountReceivedFromPeople[data.name] += data.amount;
    } else {
      amountReceivedFromPeople[data.name] = data.amount;
    }
  });

  console.log(amountSendToPeople);

  const formattedData = Object.entries(incExpCollected).map(
    ([year, [amount, secondValue]]) => {
      return [year, amount, secondValue];
    }
  );

  const formattedAmountSentDetails = Object.entries(amountSendToPeople);
  const formattedAmountReceivedDetails = Object.entries(
    amountReceivedFromPeople
  );
  console.log(formattedAmountSentDetails, formattedAmountReceivedDetails);

  const data = [["Date", "Income", "Expenses"], ...formattedData];

  const options = {
    chart: {
      title: "Account Details",
      subtitle: "Income and Expenses over the Period",
    },
  };
  return (
    <>
      <div className={classes.appRightCon}>
        <AppRightSdNav
          profileImgName={userProfileLogo}
          title={"Dashboard"}
          userName={userData.name}
        />

        <Chart
          chartType="Line"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />

        <div className={classes.moneySent}>
          <h3>Money Sent to people</h3>
          <Chart
            width={"100%"}
            height={"100%"}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={[["Name", "Amount"], ...formattedAmountSentDetails]}
            options={{
              legend: { position: "bottom" },
            }}
            rootProps={{ "data-testid": "6" }}
            chartPackages={["corechart", "controls"]}
            render={({ renderControl, renderChart }) => {
              return (
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <div>{renderControl(() => true)}</div>
                  <div>{renderChart()}</div>
                </div>
              );
            }}
            controls={[
              {
                controlType: "StringFilter",
                options: {
                  filterColumnIndex: 0,
                  matchType: "any",
                  ui: {
                    label: "Search by name",
                  },
                },
              },
              {
                controlType: "NumberRangeFilter",
                controlID: "age-filter",
                options: {
                  filterColumnIndex: 1,
                  ui: {
                    labelStacking: "vertical",
                    label: "Money Filter",
                    allowTyping: false,
                    allowMultiple: false,
                  },
                },
              },
            ]}
          />
        </div>

        <div className={classes.moneySent}>
          <h3>Money Received from people</h3>
          <Chart
            width={"100%"}
            height={"100%"}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={[["Name", "Amount"], ...formattedAmountReceivedDetails]}
            options={{
              legend: { position: "bottom" },
            }}
            rootProps={{ "data-testid": "6" }}
            chartPackages={["corechart", "controls"]}
            render={({ renderControl, renderChart }) => {
              return (
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <div>{renderControl(() => true)}</div>
                  <div>{renderChart()}</div>
                </div>
              );
            }}
            controls={[
              {
                controlType: "StringFilter",
                options: {
                  filterColumnIndex: 0,
                  matchType: "any",
                  ui: {
                    label: "Search by name",
                  },
                },
              },
              {
                controlType: "NumberRangeFilter",
                controlID: "money-filter",
                options: {
                  filterColumnIndex: 1,
                  ui: {
                    labelStacking: "vertical",
                    label: "Money Filter",
                    allowTyping: false,
                    allowMultiple: false,
                  },
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default AppDashboard;
