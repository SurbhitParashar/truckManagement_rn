import client from "./client";

// GET driver by username
export async function getDriverByUsername(username) {
  const res = await client.get(`/driver/${username}`);
  return res.data;
}
