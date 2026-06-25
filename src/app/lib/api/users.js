import { protectedFetch, serverFetch } from "../core/server";

export const getUsers = async () => {
  return protectedFetch("/api/users");
};
