"use server";
import { serverMutation } from "../core/server";

export const uploadPaymetsData = async (payload) => {
  return serverMutation("/api/payments/checkout", payload, "POST");
};
