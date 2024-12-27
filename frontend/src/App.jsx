import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootPage from "./pages/RootPage";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import UserContextProvider from "./userCtx/UserContext";
import AppRootPage from "./pages/AppRootPage";
import AppHome from "./components/app-components/AppHome";
import AppDashboard from "./components/app-components/AppDashboard";
import AppTransfer from "./components/app-components/AppTransfer";
import AppTransactions from "./components/app-components/AppTransactions";
import AppAccountsAndCards from "./components/app-components/AppAccountsAndCards";
import AppUserProfileSettings from "./components/app-components/AppUserProfileSettings";
import ForgetPassword from "./components/ForgetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "change-password",
        element: <ForgetPassword />,
      },
    ],
  },
  {
    path: "/app",
    element: <AppRootPage />,
    children: [
      {
        index: true,
        element: <AppHome />,
      },
      {
        path: "dashboard",
        element: <AppDashboard />,
      },
      {
        path: "transfer",
        element: <AppTransfer />,
      },
      {
        path: "transactions",
        element: <AppTransactions />,
      },
      {
        path: "accounts",
        element: <AppAccountsAndCards />,
      },
      {
        path: "settings",
        element: <AppUserProfileSettings />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </>
  );
}

export default App;
