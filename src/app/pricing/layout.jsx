import Navbar from "../components/Navbar";
import { requireRole } from "../lib/core/session";

const PricingLayoutPage = async ({ children }) => {
  await requireRole("user");
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default PricingLayoutPage;
