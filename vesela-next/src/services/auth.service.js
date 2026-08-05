import { get, post } from "@/lib/apiService";

export const loginUser = (data) => post("/dj-rest-auth/login/", data);
export const registerUser = (data) => post("/dj-rest-auth/registration/", data);
export const getPlan = () => get("/api/get_plan/");

export const requestPasswordReset = async (data) => {
  let res = await post("/api/auth/password/forgot/", data);
  if (res.status === 404 || (res.error && typeof res.data === "string" && res.data.includes("<!DOCTYPE"))) {
    res = await post("/auth/password/forgot/", data);
  }
  if (res.status === 404 || (res.error && typeof res.data === "string" && res.data.includes("<!DOCTYPE"))) {
    res = await post("/dj-rest-auth/password/reset/", data);
  }
  return res;
};

export const confirmPasswordReset = async (data) => {
  let res = await post("/api/auth/password/forgot/confirm/", data);
  if (res.status === 404 || (res.error && typeof res.data === "string" && res.data.includes("<!DOCTYPE"))) {
    res = await post("/auth/password/forgot/confirm/", data);
  }
  if (res.status === 404 || (res.error && typeof res.data === "string" && res.data.includes("<!DOCTYPE"))) {
    res = await post("/dj-rest-auth/password/reset/confirm/", data);
  }
  return res;
};
