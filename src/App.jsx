import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Checkout from "./components/Checkout/Checkout";
import Book from "./pages/admin/Book/Book";
import Home from "./components/Home/Home";
import RegisterPage from "./pages/register/RegisterPage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doFetchAccount, doLogin } from "./redux/account/accountSlice";
import { getAccount } from "./utils/api";
import Loading from "./components/Loading/Loading";
import NotFound from "./components/NotFound/NotFound";
import AdminPage from "./pages/admin/AdminPage";
import ProtectedPage from "./components/ProtectedPage/ProtectedPage";
import DashBoard from "./pages/admin/DashBoard";
import User from "./pages/admin/User/User";
import BookPage from "./components/Book/BookPage";
import Order from "./components/Order/Order";
import History from "./components/Order/History";
import ManageOrder from "./pages/admin/Order/ManageOrder";

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </>
  );
};

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "checkout",
          element: <Checkout />,
        },
        {
          path: "order",
          element: (
            <ProtectedPage>
              <Order />
            </ProtectedPage>
          ),
        },
        {
          path: "history",
          element: (
            <ProtectedPage>
              <History />
            </ProtectedPage>
          ),
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedPage>
          <AdminPage />
        </ProtectedPage>
      ),
      // errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <DashBoard />,
        },
        {
          path: "user",
          element: <User />,
        },
        {
          path: "book",
          element: <Book />,
        },
        {
          path: "order",
          element: <ManageOrder />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  const fetchAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      return;
    }
    let res = await getAccount();
    if (res && res.data) {
      dispatch(doFetchAccount(res?.data?.user));
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <>
      {isAuthenticated ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
