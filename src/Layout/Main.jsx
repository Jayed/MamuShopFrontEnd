import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Shared/Footer/Footer";
import NavBar from "../Shared/NavBar/NavBar";

const Main = () => {
  const location = useLocation();
  // console.log(location.pathname);
  const isLogin = location.pathname.includes("login") || location.pathname.includes("signup");
  return (
    <div className="text-center mx-auto">
      {isLogin || <NavBar></NavBar>}
      <Outlet></Outlet>
      {isLogin || <Footer></Footer>}
    </div>
  );
};

export default Main;
