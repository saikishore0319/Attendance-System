export const BASE_URL = "https://2zz6sbixv9.execute-api.ap-south-1.amazonaws.com"; 
// Example:
// https://abcd123.execute-api.ap-south-1.amazonaws.com

// ---------- Helper ----------
async function request(endpoint, method = "GET", body = null, token) {
  // console.log(token);
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// ---------- API Calls ----------

export async function enrollFace(image, token) {
  return request("/enroll", "POST", { image }, token);
}

export async function getProfile(token) {
  return request("/profile", "GET", null, token);
}

export async function markAttendance(image, token) {
  return request("/attendance", "POST", { image }, token);
}

export async function getSummary(token) {
  return request("/attendance/summary", "GET", null, token);
}

