import { Outlet } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <NavigationBar />
      <div className="main-content">
        <Outlet /> {/* Aquí carga la vista correspondiente */}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
