import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const AuthLayoutPage = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default AuthLayoutPage;
