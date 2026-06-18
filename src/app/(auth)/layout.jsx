import Navbar from "../components/Navbar";

const AuthLayoutPage = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default AuthLayoutPage;
