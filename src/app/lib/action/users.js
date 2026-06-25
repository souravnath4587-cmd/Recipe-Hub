"use server";

import { serverMutation } from "../core/server";

export const userStatusUpdate = async (id, setData) => {
  return serverMutation(`/api/users/${id}/status`, setData, "PATCH");
};
