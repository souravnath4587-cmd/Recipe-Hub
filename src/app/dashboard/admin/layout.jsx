import { requireRole } from "@/app/lib/core/session";

const AdminLayoutPage = async ({ children }) => {
  await requireRole("admin");
  return children;
};

export default AdminLayoutPage;
