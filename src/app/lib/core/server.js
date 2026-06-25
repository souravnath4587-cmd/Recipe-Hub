import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const authHeader = async () => {
  const token = await getUserToken();
  const header = token
    ? {
        authorization: `Bearer ${token}`,
      }
    : {};
  return header;
};

export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
  });

  // handle 401, 403

  return res.json();
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch recipes. Status: ${res.status}`);
  }
  // handle 401, 404, 403
  return res.json();
};

export const serverMutation = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  // handle 401, 404, 403

  return res.json();
};

export const serverMutationPayment = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // handle 401, 404, 403

  return res.json();
};

export const serverDelete = async (path, id) => {
  try {
    const res = await fetch(`${baseUrl}${path}${id}`, {
      method: "DELETE",
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

// handle 401, 404, 403
const handleStatusCode = (res) => {
  if (res.status === 401) {
    redirect("/unauthorized");
  } else if (res.status === 403) {
    redirect("/forbidden");
  }

  return res.json();
};
