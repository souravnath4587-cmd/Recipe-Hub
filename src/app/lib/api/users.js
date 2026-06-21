import { serverFetch } from "../core/server";

export const getUsers = async () => {
  return serverFetch("/api/users");
};
