import Navbar from "../components/Navbar";

const MainLayoutPage = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayoutPage;
