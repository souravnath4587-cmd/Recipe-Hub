import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayoutPage = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayoutPage;
