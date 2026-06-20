import { requireRole } from "@/app/lib/core/session";

const UserLayoutPage = async ({ children }) => {
  await requireRole("user");
  return children;
};

export default UserLayoutPage;
