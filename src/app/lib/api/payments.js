import { protectedFetch, serverFetch } from "../core/server";

export const getPayments = async () => {
  return protectedFetch(`/api/payments`);
};
