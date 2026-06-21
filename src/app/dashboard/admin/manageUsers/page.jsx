import React from "react";
import ManageUsersPage from "./ManageUsers";
import { getUsers } from "@/app/lib/api/users";

const page = async () => {
  const allUsers = await getUsers();

  return (
    <div>
      <ManageUsersPage allUsers={allUsers} />
    </div>
  );
};

export default page;
