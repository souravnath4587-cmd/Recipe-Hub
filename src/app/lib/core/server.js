const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

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

//  try {
//     const res = await fetch(`/api/recipes/${id}`, {
//       method: "DELETE",
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Recipe deleted successfully");
//     }
//   } catch (error) {
//     console.error(error);
//   }
