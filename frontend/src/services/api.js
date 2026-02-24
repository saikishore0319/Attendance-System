const BASE_URL = "https://your-api-gateway-url";

export async function getSummary(token) {
  const res = await fetch(`${BASE_URL}/attendance/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function uploadImage(imageBase64) {
  // Replace with presigned URL logic
  console.log("Uploading image...");
}

